# Platform App Hierarchy

Use this full hierarchy for generated React files:

`Top User Bar -> First-Level Application Navigation -> Second-Level Module And Tab Navigation -> Page -> Detail Drawer`

The business application hierarchy itself remains:

`Application -> Module -> Page -> Detail Drawer`

## Platform User And Application Switch Layer

This host-owned layer sits above every business application. It is not an application module and must not be recreated by a feature.

- Basic: company logo, application switcher, and user/account entry only.
- Pro: the same physical structure as Basic; upgrade knowledge capabilities without adding a new navigation row, persistent rail, or strongly differentiated shell.
- Max: includes Pro and Basic, then adds the persistent platform left rail, all platform functions, all business applications, and user-center backend capabilities.
- Tiers are cumulative: `Max > Pro > Basic`.
- In Max, a platform top-layer or platform-left-rail entry owns every descendant route, page, drawer, and backend-management surface reached from that entry.
- A business application listed in the Max rail is platform-governed for discovery, launch context, permissions, and routing, but its internal UI still follows `Application -> Module -> Page -> Detail Drawer`.
- Never place platform functions or user-center backend pages in application `globalActions`, `moduleGroups`, tabs, page sections, or business detail data.

Use these ownership domains:

| Domain      | Owns                                                                                                                                                      | Does not own                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Platform    | company/user/application-switch top layer, Max platform left rail, platform entries and descendants, app catalog/launch, user-center backend capabilities | business fields, record state, application workflows                                  |
| Application | application identity, app-wide actions, modules, pages, business records, detail/form/workflow behavior                                                   | company identity, cross-app switching, platform rail, platform account administration |

## Application

Application metadata belongs in the app/workspace navigation model. Keep these fields aligned:

- `id`: stable app id, e.g. `structure-template`
- `routeKey`: app route, e.g. `app-structure-template`
- `label`: visible application name
- `desc`: visible summary in secondary nav
- `logoSrc`: application logo path
- `defaultChildModuleId`: selected module when entering the app
- `moduleGroups`: top-level modules
- `globalActions`: first-level application functions such as `运行总览`, `风险预警`, `消息`, `待办`, `设置`
- `applicationSettingsModule`: settings module/tabs when settings is a structured app area

Application secondary nav logo rules:

- module/workbench logo: 48 x 48
- module logo radius: 8px
- system icon box: 48 x 48, icon inside 36 x 36
- application title: 16px / 24px, weight 700, color `#292929`
- application summary: 12px / 16px, color `rgba(41, 41, 41, .45)`

Application first-level right-side action rules:

- Prefer standard `globalActions` for app-wide functions: `dashboard`, `riskWarning`, `messages`, `todo`, `config`.
- Use the built-in label/icon mapping from `application-navigation.md`: `LayoutGrid`, `ShieldAlert`, `MessageSquareText`, `FileCheck2`, `Settings`.
- If the app has `config` as a global action, do not also show a duplicate settings trigger.
- Keep upgrade/back/fullscreen/settings as shell actions; do not model them as page content actions.

## Module

Each module is a child of the application:

```js
{
  id: 'app-domain-module',
  label: '模块名称',
  routeKey: 'app-domain:module-key',
  tabs: modulePageTabs
}
```

Rules:

- Use stable ids and route keys; route keys are the source of truth.
- If only module names are known, generate placeholder `moduleGroups` from those names using `createPlaceholderModuleGroups` in `application-navigation.md`.
- Do not add empty future modules with `tabs: []` to a generated application. Give each included module at least one visible tab, or omit the module until its page is defined.
- Do not invent content for modules not requested.
- Put left-side module switching in the shared secondary nav below the application title row, not inside the page content.
- Put module tabs in the same secondary navigation row with shadcn tabs; page content receives only the active route/section.
- Keep the module row and at least one active tab visible for Account, Platform, Shortcut, and Direct launches; generated applications do not use title-only shell behavior.

## Page

Each page/tab under a module must have a section contract:

```js
{
  id: 'page-key',
  menu: '页面名称',
  subtitle: '一句业务说明',
  routeKey: 'app-domain:module-key:page-key',
  primaryAction: '新增记录',
  actions: ['新增记录', '导出'],
  metrics: [['指标名', '值', '辅助说明']],
  viewModes: [{ key: 'list', label: '列表' }, { key: 'sidebar', label: '侧栏' }, { key: 'card', label: '卡片' }],
  defaultViewMode: 'list',
  searchPlaceholder: '搜索名称、编号、单位',
  filters: [{ key: 'status', label: '状态', options: ['全部', '在办'] }],
  batchActions: ['批量调整', '批量导出', '批量通知'],
  columns: [['code', '编号'], ['name', '名称']],
  rows: [{ code: 'A001', name: '示例' }]
}
```

Page route defaults:

- First page in a module uses the module route itself: `app-domain:module-key`.
- Later pages append a suffix: `app-domain:module-key:sub-page`.
- Normalize hash/app prefixes in model helpers before comparing routes.
- Include `sort` as a filter definition when the source has sorting; keep it single-select in model code.
- Keep view modes and default view mode section-scoped so non-list/custom pages can opt out cleanly.
- Keep batch actions page-scoped so each tab can pass real selection handlers.
- The content update/action row uses `primaryAction` and `actions`; the shared application navigation uses `globalActions`.

## Detail Drawer

Every table/list row that opens details should resolve to a detail object:

```js
{
  title: '主标题',
  subtitle: '编号｜状态｜单位（数据可保留，但标准抽屉标题区不渲染辅助信息）',
  actions: ['查看档案', '维护记录', '导出详情', '查看日志'],
  kpis: [['状态', '在办', '业务口径']],
  tabs: ['基本信息', '业务详情', '材料清单', '办理记录', '操作日志'],
  info: [['所属单位', '集团总部']],
  sectionTitle: '详情标题',
  leftTitle: '业务办理信息',
  leftRows: [['记录主题', '内容', '状态', 100]],
  rightTitle: '办理记录',
  timeline: [['2026-07-02 09:30', '记录已登记']],
  bottomTitle: '材料、联动与操作',
  cards: [{ title: '材料清单', text: '...', status: '已记录' }]
}
```

Drawer should be global over the viewport, not visually stitched into the page area. Mount the layer to `document.body`, set the layer to fixed `inset: 0` with z-index 130, make the mask cover the full viewport with no radius and 8px blur, and place the drawer absolutely on the right inside that layer. Do not compute drawer offsets from the top navigation, sidebar, or embedded application shell.

The drawer header renders only the main title. Do not show record codes, categories, status, or organization breadcrumbs as a subtitle under the title; put those fields in the KPI strip or information grid. Add a bottom divider to the header. Keep drawer actions on the header row: the first action is the primary contextual action and later actions are secondary/quiet actions before the close button.

## File Boundaries

Prefer this split for generated code:

- `data/<domain>Data.js`: tabs, sections, rows, metrics, filters, detail source data.
- `model/<domain>Model.js`: route resolution, filtering, sorting, row identity, detail mapping.
- `ui/<Domain>Layout.jsx`: state composition and layout branches.
- `ui/<Domain>Chrome.jsx`: update row, action buttons, stats, toolbar.
- `ui/<Domain>RosterViews.jsx`: list/sidebar/card implementations.
- `ui/<Domain>DetailDrawer.jsx`: detail drawer.
- `views/apps/<Domain>View.css` or feature-owned CSS: all visual rules for this page.

Keep new business-specific code out of broad global CSS when a feature owner exists.
