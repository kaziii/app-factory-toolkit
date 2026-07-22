# Application Interaction Standards

Use this reference when creating or updating generated application pages for a target platform repository containing `docs/平台建设UI规范.md` and the shared shell.

## Contents

- Current Stable Sources
- Toolbar Order
- Sorting
- Filters And Search
- View Modes
- Actions
- Selection And Batch Operations
- Pagination
- Empty, Loading, Feedback, And Detail
- Tests To Add Or Update

## Current Stable Sources

- `structure-template` is the strongest contract for generated enterprise applications: route-scoped list/sidebar/card view modes, sort-as-filter, multi-select filters, toolbar layout, row selection, pagination, card actions, and full-viewport drawers.
- `contract-management` is the strongest contract for specialized workflow applications: filter tabs, left-side sorting tools, native table pagination, row-click detail opening, source-specific row actions, and shared batch actions.
- `AppCenterView` is the strongest contract for the application directory: category pills, status filters, search, adaptive app cards, fixed right rail, and app open actions.
- `ApplicationRecordList` is the preferred adapter for ordinary record-management pages when it exists in the target checkout. `ListTableShell`, `ListBatchActionBar`, `ListSelectionCheckbox`, shadcn `DropdownMenu`, shadcn `Button`, shared `SearchField`, `.ui-secondary-button`, and lucide icons remain the lower-level primitives.

## Toolbar Order

Use `application-navigation.md` for the content update/action row above this toolbar.

Use this order for ordinary record list pages:

1. Sort dropdown on the far left.
2. A 1px vertical divider.
3. Quick filter dropdowns or filter tabs.
4. Flexible spacer.
5. Search input.
6. Advanced `筛选` dropdown button.

Rules:

- Keep toolbar height 32px, gap 8px, and one visual row on desktop.
- Use source labels and option order. Do not rename `排序方式`, `全部`, status labels, or business actions to generic alternatives.
- Show selected filter values in the trigger. For multi-select filters, show `标签 N`; for sort, show the selected sort label.
- Keep dropdowns shadcn-based. Use `DropdownMenuCheckboxItem` for selectable filters and prevent accidental menu close when multi-selecting. Use `ApplicationAdvancedFilterMenu` for grouped advanced filters; it owns its selected state and single clear action.
- Put source-specific sorting tools such as `按时限排序` and `只看阻断` on the left side of the filter tabs, not above the table card.

## Sorting

Model sorting as a filter definition with `key: 'sort'` when the source exposes sorting options.

- `sort` is single-select: selecting a new sort option replaces the previous one.
- `全部`, `排序方式`, and placeholder-like labels are trigger copy for an empty selection, not a selected value. Preserve the label, store `undefined` or an equivalent empty state, and do not expose selected styling or `aria-pressed="true"` until the user selects a real option.
- Apply data operations in this order: filters -> search -> sort.
- Keep sorting pure in the feature model so tests can cover it without rendering.
- Avoid table-header sort affordances unless the source explicitly uses them; the platform default is a toolbar dropdown/tool.

## Filters And Search

- Define filters in section data with stable `key`, visible `label`, and ordered `options`.
- Treat `全部` options and empty selections as no-op filters.
- Ordinary quick filters are multi-select sets unless the source marks them as tabs or radio behavior.
- Filter tabs are for high-frequency business states and should use `role="tablist"` when implemented as tab-like controls.
- Search should scan the active section's visible row fields, not a global dataset from another module.
- Search placeholders must name business fields, for example `搜索合同名称/编号/相对方/当前节点`.
- Provide a clear-filter action inside the advanced filter menu only when any non-sort filter is active; clearing must restore the default labels and remove selected trigger state.
- Portal-mounted dropdown content must carry `data-ui-layer="application"`; add `data-application-theme` when the page scope supplies theme-specific overrides. A portal does not inherit CSS variables from its page scope.

## View Modes

Default generated list pages should support:

- `list` / `列表`: dense selectable table, pagination, row actions, and row-click detail.
- `sidebar` / `侧栏`: left grouped record rail plus right scoped detail table.
- `card` / `卡片`: status/pool columns with compact selectable cards and icon-only card actions.

Rules:

- Store active view mode per route/page using the repo storage helpers when they exist.
- Validate stored modes against the active section's allowed `viewModes`; fall back to `defaultViewMode` or `list`.
- Custom non-list pages may define their own `viewModes` such as `tree`, or omit the standard switch when list/sidebar/card would be fake.
- Put the view-mode trigger in the page title/action row as `.ui-secondary-button` with a chevron and checked menu item.
- Switching views must not lose filters/search/selection unless the source flow requires a reset.

## Actions

Use this action hierarchy:

- Primary page action: one shadcn `Button`, 32px height, blue fill, usually the source's `primaryAction`.
- Content-row page actions follow `application-navigation.md`: primary action first, view dropdown second, secondary/more actions third.
- Secondary page actions: `.ui-secondary-button` and a `更多` dropdown when there are more than one or two.
- Row actions: text buttons in tables; icon-only buttons in cards; both must stop row-click propagation.
- Detail drawer actions: keep source action labels in the drawer header, on the same row as the title group, aligned to the right before the close button. The first action is the primary contextual action; following actions are secondary/quiet actions. Do not put a separate drawer action row at the top of the body.
- Create-like actions such as `新建`, `新增`, `发起`, `发布`, `安排`, and `登记` must open a shadcn `Dialog` form or source-specific modal carrier, not a detail drawer. Detail drawers are for viewing or maintaining an existing record context.
- App directory action: `进入系统` resolves through route helpers; unavailable/unimplemented apps should open the app access/explanation flow rather than becoming inert.

Rules:

- Every visible business action should have a handler path: open drawer/modal, route, update local row state, emit feedback/toast, or call `onAsk`.
- Do not leave migrated source actions as decorative buttons.
- Row click opens detail only when the click target is not `button, input, select, textarea, a, label`.
- Disabled actions need visible disabled state and a reason in nearby status text or accessible label when the reason is not obvious.

## Selection And Batch Operations

- Use `ApplicationRecordList` for an ordinary dense selectable table page when it is available. It composes `ListTableShell` and owns the common record-list visual/column baseline while the feature supplies columns, rows, field mapping, source labels, row actions, and domain wrappers.
- Use `ListTableShell` directly only when the source requires custom `<tr>` markup or a specialized adapter that `ApplicationRecordList` cannot express. Keep the shared pagination, current-page select-all/clear behavior, active batch actions, and row-click detail behavior in the shell.
- `ListTableShell` can also own non-selectable/sidebar tables: omit `selection` and `batchActions`, keep the same `rowKey` / `rowDetailKey`, and pass the feature's table/scroll/pagination class slots. Do not fake a selection column in sidebar mode.
- Use `ListSelectionCheckbox` for selectable rows/cards.
- Use `ListBatchActionBar` for batch actions unless the feature already has a stricter local wrapper around it.
- Hide the batch bar when selected count is zero; show it above the table/list content at full list width when active.
- Include selected count, page/list name, domain-specific batch actions, and `取消选择`.
- The first batch action is the primary batch action but remains restrained: white background with blue border/text by current shared styling.
- Batch actions must be tab/page-specific. Do not pass no-op selection handlers into a tab and assume the shared table wrapper covers it.
- `ListTableShell` row clicks must ignore controls with this selector: `button, input, select, textarea, a, label`. Do not duplicate this row-click guard in each feature once the shared shell owns it.

## Pagination

- Keep table pagination in the list panel footer, not outside the feature surface.
- Default page size can be 10 unless the source says otherwise.
- Show record range and total count.
- Reset/clamp the current page when filters/search/page size change so empty pages are not reachable.
- Page-size menus should use shadcn `DropdownMenu`.
- When using `ListTableShell`, pass the feature's class slots instead of reimplementing the footer. The shared shell owns range text, current-page slicing, previous/next buttons, current-page select-all keys, and row-click cloning; the feature adapter owns visual class names and source-specific rows.
- If the source needs a page-size dropdown, pass `pageSizeOptions` plus `renderPageSizeControl` and implement that control with shadcn `DropdownMenu`. The shared shell still owns the selected page size and resets to page 1 after page-size changes.

## Empty, Loading, Feedback, And Detail

- Empty states should keep the current toolbar visible and state which filters/search produced zero rows.
- Loading states should preserve layout dimensions so rows, cards, and toolbars do not jump.
- Actions that mutate demo data should update local feature state and emit concise feedback.
- Detail drawers must use the full-viewport portal contract in `design-elements.md`; never mount a drawer inside a scrolled table/card panel. Drawer body modules should be arranged as one vertical stack with `gap: 12px`, instead of mixing ad hoc margins between KPI, tabs, info, section, and panel modules. Information cards, material rows, and process rows use neutral backgrounds without borders; labels and status copy use neutral color and regular weight unless a semantic status badge is required.

## Tests To Add Or Update

For interaction-heavy generated applications, add focused tests for:

- sort filter is single-select and applied after filters/search
- `全部` filters are no-op
- default `排序方式`/`全部` trigger labels are not selected or `aria-pressed`
- advanced-filter clear state restores defaults and hides its clear action
- portal dropdown content has the application layer marker; in the browser, confirm computed `background-color: rgb(255, 255, 255)`, 12px radius, and a non-empty shadow
- view modes persist per route and reject invalid stored values
- toolbar order contains sort, divider, quick filters, search, and advanced filter trigger
- row clicks open details while control clicks do not
- batch bars appear only when selected rows exist and each tab passes real selection handlers
- page actions, row actions, and drawer actions preserve source labels
