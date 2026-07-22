# React Implementation Patterns

Use these patterns when generating page files.

## Data Shape

For app navigation data, use the built-in global action defaults and module placeholder pattern in `application-navigation.md` before writing page data.

Define tabs and sections separately:

```js
export const moduleTabs = [
  { id: 'domain-module-page', label: '页面名称', routeKey: 'app-domain:module:page' }
];

export const moduleSections = [
  {
    id: 'page',
    menu: '页面名称',
    subtitle: '业务说明',
    routeKey: 'app-domain:module:page',
    primaryAction: '新增记录',
    actions: ['新增记录', '导出'],
    metrics: [['记录总数', '12', '当前筛选范围']],
    viewModes: [{ key: 'list', label: '列表' }, { key: 'sidebar', label: '侧栏' }, { key: 'card', label: '卡片' }],
    defaultViewMode: 'list',
    searchPlaceholder: '搜索名称、编号、单位',
    filters: [
      { key: 'sort', label: '排序方式', options: ['更新时间倒序', '更新时间正序'] },
      { key: 'status', label: '状态', options: ['全部', '在办', '已完成'] }
    ],
    batchActions: ['批量调整', '批量导出', '批量通知'],
    columns: [['code', '编号'], ['name', '名称'], ['status', '状态']],
    rows: []
  }
];
```

For custom pages, add `layout` and layout-specific data:

```js
{
  id: 'analysis',
  menu: '分析报告',
  routeKey: 'app-domain:module:analysis',
  layout: 'analysis-report',
  metrics: [],
  filters: [],
  columns: [],
  rows: [],
  topics: []
}
```

## Model Helpers

Implement pure helpers:

- `normalizeRoute(route)` strips `#` and `app-`.
- `routeMatchesExactly(route, routeKey)` compares normalized routes.
- `sectionForRoute(route)` returns the active page section.
- `filterDefinitionsForSection(section)` normalizes string options to `{ value, label }`.
- `visibleRowsForSection(section, { filters, searchQuery })` applies filters, search, then sort.
- `selectedSortValue(section, filters)` reads only `key: 'sort'`, ignores no-op `全部` options, and returns one selected value.
- `normalizeViewMode(viewMode, section)` validates stored route-scoped view modes against `section.viewModes`.
- `rowIdentityForRow(row, index)` returns `eventNo || code || id || name || row-${index}`.
- `resolveDetail(route, detailKey)` maps row data to the drawer detail object.

Treat selected filter values that include `全部` as no-op filters. Treat `sort` as single-select; ordinary filters remain multi-select sets.

## Layout State

Page layout owns only UI state:

```jsx
const [activeViewMode, setActiveViewMode] = useState(() => readViewMode(routeKey));
const [selectedFilters, setSelectedFilters] = useState(() => createEmptyFilters(filterDefinitions));
const [selectedRowIds, setSelectedRowIds] = useState(() => new Set());
const [activeSidebarGroup, setActiveSidebarGroup] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [detailKey, setDetailKey] = useState('');
const [activeAction, setActiveAction] = useState(null);
```

Branch rendering:

- custom layout -> header + summary + custom view
- sidebar mode -> full-height sidebar component
- list/card mode -> header + summary + toolbar + list panel
- content header -> update time/refresh on the left, primary action/view dropdown/more actions on the right
- toolbar -> sort dropdown, divider, quick filters, search, advanced filter trigger

Use a portal for the drawer:

```jsx
const portalRoot = typeof document === 'undefined' ? null : document.body;

{detailKey && portalRoot
  ? createPortal(
      <div className="domain-detail-layer">
        <button className="domain-detail-overlay" type="button" aria-label="关闭详情" onClick={() => setDetailKey('')} />
        <DomainDetailDrawer
          route={routeKey}
          detailKey={detailKey}
          onClose={() => setDetailKey('')}
          onAction={action => handleDomainAction(action, detailKey)}
        />
      </div>,
      portalRoot
    )
  : null}
```

Route action intent explicitly: `查看`/row detail opens the drawer, while create-like labels (`新建`, `新增`, `发起`, `发布`, `安排`, `登记`) set `activeAction` and render a shadcn `Dialog` form. Do not open a blank or create drawer for primary page actions.

The drawer CSS must match the personnel application contract:

```css
.domain-detail-layer {
  position: fixed;
  inset: 0;
  z-index: 130;
  pointer-events: none;
}

.domain-detail-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 0;
  border-radius: 0;
  background: rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.domain-detail-drawer {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: 1;
  width: 1280px;
  max-width: calc(100vw - 64px);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  pointer-events: auto;
}

.domain-detail-drawer .domain-drawer-top {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.domain-detail-drawer .domain-drawer-title {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.domain-detail-drawer .domain-drawer-actions {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.domain-detail-drawer .domain-drawer-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;
  gap: 12px;
  overflow: auto;
}
```

## Component Split

Use this split:

- `Chrome.jsx`: update/action header, primary action, view dropdown, more actions, summary cards, toolbar/filter dropdowns.
- `RosterViews.jsx`: table, card board, sidebar list, row cells, pagination, batch actions.
- `CustomViews.jsx`: non-list source-preserving views.
- `DetailDrawer.jsx`: drawer shell and detail sections.
- `ActionDialog.jsx` or a local dialog component in `Layout.jsx`: create/edit form carrier for create-like actions.
- `Layout.jsx`: route section lookup, UI state, view branching, portal.

Do not pack all of these into one large component.

## List Mode Checklist

- Prefer `ApplicationRecordList` from `shared/ui/application` for an ordinary dense business record list when it exists in the target checkout. It provides the human-resources visual baseline on top of `ListTableShell`; keep source-specific columns, fields, row actions, and labels in the feature.
- Use `ListTableShell` directly only when the source needs custom table-row markup or a specialized feature adapter. If `ApplicationRecordList` is not yet present in the target checkout, use the shell adapter rather than creating a second shared list implementation.
- Use shadcn `TableRow` / `TableCell` primitives for row markup where the project already uses them. Let `ListTableShell` own the outer table frame when it is handling pagination/selection.
- Include a 42px selection column when batch operations exist.
- Keep row click separate from controls; ignore row clicks from `button, input, select, textarea, a, label`.
- Use `ListSelectionCheckbox` and `ListBatchActionBar` when available.
- Reset page number when page size changes.
- Do not show batch bar when nothing is selected.
- Place active batch actions above the table at full list width, not floating over the table unless the feature already owns that contract.
- Keep row actions source-specific and wired to detail/modal/state/feedback, not decorative.

Canonical record-list adapter shape:

```jsx
<ApplicationRecordList
  pageId="employee-roster"
  pageName="员工档案"
  columns={[
    { key: 'name', label: '员工', kind: 'primary', meta: row => row.employeeNo },
    { key: 'department', label: '所属部门' },
    { key: 'status', label: '状态', kind: 'status' }
  ]}
  rows={visibleRows}
  rowKey={row => row.id}
  rowDetailKey={row => row.id}
  onRowDetail={openDetail}
  selection={selection}
  batchActions={batchActions}
  renderRowActions={({ row }) => <ApplicationRecordListInlineAction onClick={() => editRow(row)}>编辑</ApplicationRecordListInlineAction>}
  tableMinWidth={960}
/>
```

Use `ApplicationRecordDetailBody` inside `ApplicationDetailDrawer` when the source has metrics, an information grid, node/progress panels, timeline content, or summary cards. Use `ApplicationSchemaFieldGrid` inside `ApplicationFormDialog` for standard `text`, `select`, and `textarea` fields. Preserve a custom source detail/form composition when it has a stronger, documented layout.

Fallback `ListTableShell` adapter shape for a specialized workflow:

```jsx
function FeatureTableShell(props) {
  return (
    <ListTableShell
      {...props}
      selectionHeader={FeatureSelectionHeaderCell}
      batchBar={FeatureBatchActionBar}
      pageSizeOptions={[10, 20, 50]}
      renderPageSizeControl={renderFeaturePageSizeControl}
      cardAs="section"
      bodyClassName="feature-table-body"
      cardClassName="feature-table-card"
      scrollClassName="feature-table-scroll"
      tableClassName="feature-table"
      paginationClassName="feature-pagination"
      clickableRowClassName="feature-clickable-row"
    />
  );
}
```

The adapter should not re-own pagination slicing, select-all keys, row cloning, or row-click guard logic. Those belong to `ListTableShell`; the feature adapter preserves the feature's class names and wrapper components.

For sidebar tables that should not be selectable, reuse the same shell without selection props:

```jsx
<ListTableShell
  pageId="feature-sidebar"
  headers={tableHeaders}
  rows={groupRows}
  rowKey={rowIdentityForRow}
  rowDetailKey={rowIdentityForRow}
  onRowDetail={openDetail}
  pageSizeOptions={[10, 20, 50]}
  renderPageSizeControl={renderFeaturePageSizeControl}
  cardAs="section"
  bodyClassName="feature-table-body"
  cardClassName="feature-table-card"
  scrollClassName="feature-table-scroll"
  tableClassName="feature-table feature-sidebar-table"
/>
```

Do not pass no-op `selection` handlers just to keep the API shape. Missing `selection` means no selection column and no batch bar.

## Sidebar Mode Checklist

- Build groups from a stable row field: department, unit, signer, type, or status.
- Keep active group derived from available groups if the previous active group disappears.
- Left rail contains header, search, and group cards.
- Right detail contains title, summary, toolbar, table panel.
- Row click still opens the same drawer; prefer `ListTableShell` for the right-side table so pagination and row-click guard are not duplicated.

## Card Mode Checklist

- Group rows into at most five columns.
- Show compact cards with checkbox, title, timestamp, tags, description, footer metadata, and icon actions.
- Use stable keys composed from group key and row identity.
- Keep card actions icon-only with accessible labels.

## Tests

Add focused tests for:

- app navigation model includes first-level global actions when the source has app-wide functions
- modules and tabs map to shared secondary navigation route keys instead of page-local tabs
- module tabs map to expected route keys
- routes resolve imported/generated sections
- first list page route uses module base route
- custom pages expose expected `layout`
- filters and search use active section fields; `sort` is single-select and applied after filters/search
- view modes persist per route and reject invalid stored values
- content header renders update time/refresh plus right-side primary action, view dropdown, and more actions in order
- row clicks open details while control clicks are ignored
- batch actions render only with selected rows
- detail drawer maps row data to title/tabs/KPIs/info content; subtitle-like metadata stays out of the header
- detail drawer renders the title and business actions in one header row, adds a bottom divider, and separates drawer body modules with a 12px stack gap
- create-like page actions open a shadcn `Dialog` form, not the detail drawer
- view component source contains header + summary + toolbar + list/sidebar/card/custom branches when static contract tests are the local pattern

## Verification

Run the smallest relevant checks first, then build:

```bash
node --test apps/web/src/features/<feature>/model/<feature>Model.test.mjs
node --test apps/web/src/widgets/navigation/model/topNavigationModel.test.mjs
node --test apps/web/src/views/apps/<view>.test.mjs
pnpm --dir apps/web typecheck
pnpm build
```

For UI routes, use browser/Playwright to verify:

- target route renders after login/session setup
- module tabs appear
- list/sidebar/card mode switches render the expected DOM
- detail drawer overlay is full viewport and has no radius
- detail drawer information and process rows use neutral backgrounds without borders, with regular-weight labels and status text
- console has no runtime errors
