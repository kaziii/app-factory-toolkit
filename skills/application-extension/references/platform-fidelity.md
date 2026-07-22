# Platform Source Fidelity

Use this reference first when generating or migrating application pages for a target platform repository containing `docs/平台建设UI规范.md` and the shared shell.

## Default Stance

- Treat the existing React platform as the host product and the source HTML/Figma/screenshot as business content to preserve.
- Build the usable application screen as the first view. Do not create marketing, landing, or explanatory screens for operational modules.
- Prefer desktop fidelity. Mobile adaptation is paused unless the user explicitly asks for it.
- Preserve unrelated local edits and avoid broad rewrites.

## Work Mode Questions

Ask one concise pre-work question only when the user has not already specified the answer:

- `生成`: create a new app/module/page from requirements. Ask whether the user has detailed documentation by `应用 -> 模块 -> tab -> 字段 -> 操作 -> 交互`; if not, use the platform references below and state the assumptions before implementing.
- `合并`: merge an HTML/Figma/source page into the existing platform. Ask for a delivery scope and product tier separately.
- `基础接入`: base shell fit, route metadata, title/logo/summary, module tabs, main list/custom page, and core drawer.
- `完整业务`: `基础接入` plus complete business flow states, filters, batch actions, row actions, modals/drawers, toasts, and focused tests.
- `平台集成`: `完整业务` plus workspace shortcuts, global title-row actions, capability/risk/AI integration hooks, settings/config pages, audit/permission behavior, and cross-module navigation.
- Product tier: Basic, Pro, or Max. Tier behavior follows `application-navigation.md`; delivery scope does not imply a tier.

## First Pass

Before editing, inspect the current host surfaces:

- `docs/平台建设UI规范.md` for the product-tier, Max platform-boundary, and ownership contract.
- `.codex/project-map.md` for route, component, style, and data locations.
- `AGENTS.md` and `CONTRIBUTING.md` for repo rules and verification gates.
- `apps/web/src/lib/routes.js` for hash-route classification and app route helpers.
- `apps/web/src/App.jsx` and `apps/web/src/app/model/appShellModel.js` for shell modes.
- `apps/web/src/widgets/navigation/ui/TopNavigationPrimaryBar.jsx` for the host-owned company logo, application switcher, and user/account layer.
- `apps/web/src/widgets/sidebar/ui/Sidebar.jsx` for the Max platform left rail.
- `apps/web/src/widgets/navigation/model/topNavigationModel.js` and its tests for app metadata, module tabs, workspace shortcuts, and settings routes.
- `apps/web/src/widgets/navigation/ui/TopNavigationSecondaryNav.jsx` and `apps/web/styles/02-navigation.css` for first-level application actions, mandatory second-level module/tab navigation, upgrade CTA, fullscreen, and settings.
- `apps/web/src/views/apps/AppCenterView.jsx`, `AppCard.jsx`, and `AppCenterView.css` when the request concerns the application directory, application ordering/filtering/search, owned applications, or app-card actions.
- The target feature owner, usually `apps/web/src/features/<feature>/`, `apps/web/src/views/apps/`, or a dedicated view folder.
- The existing feature CSS before adding global CSS.

Report the likely edit files and why they are the right surface before non-trivial edits.

## Existing Platform Contracts

- The host-owned top platform layer precedes the selected application. Basic contains company logo, application switcher, and user; Pro keeps the same structure and upgrades knowledge capabilities; Max includes Pro and adds the platform left rail, all platform functions, all business applications, and user-center backend capabilities.
- Treat tiers as cumulative: `Max > Pro > Basic`. Do not use tier names as implementation-completeness labels.
- In Max, every descendant of a top-layer or platform-left-rail entry remains in the platform function domain, even when the routed content renders in the main workspace.
- Routing is hash-based. Add or update route metadata in the existing route/view registries; do not introduce React Router.
- Top-level application title, logo, summary, tier badge, right-side global actions, module switcher, module tabs, and tab labels belong to the shared shell/navigation model.
- Standard first-level app actions are `运行总览`, `风险预警`, `消息`, `待办`, and `设置`; model them as navigation global actions and render them in the app row's right-side action cluster.
- Modules and tabs must render in the secondary navigation below the application title row. Page content should not duplicate module tabs or title strips already owned by the shell.
- `buildWorkspaceShortcutRoute(entry)` is the correct entry for sidebar/workspace shortcut launches.
- `buildWorkspaceShortcutNavigationContext(route)` is the shortcut metadata truth path for `title`, `summary`, `backRoute`, `backLabel`, and `hideSecondaryTabs`.
- New generated business applications keep the module/tab row for Shortcut launches. Existing `hideSecondaryTabs` routes are legacy compatibility only and must not be copied into new application metadata.
- Application catalog data, app center cards, nav labels, route metadata, and logo assets must stay aligned.
- Application center directory behavior is category/status/search driven: preserve category pills, status filters, adaptive app cards, fixed right rail, owned-app actions, and `进入系统` routing behavior when updating app specs.
- Feature behavior and styles belong in feature-owned files. Use global styles only for shell primitives, shared tokens, shared batch bars, or proven cross-feature contracts.
- Content-area chrome is a proven shared contract: use `ApplicationPageScope` plus the primitives in `shared/ui/application/ApplicationPagePrimitives.jsx` for update/action rows, metric strips, query toolbars, filters, status badges, full-viewport detail drawers, and form dialogs. Preserve source-specific business layouts inside these components.
- When the source does not establish a needed visual or interaction rule, or conflicts with this component contract, ask the user before introducing a new local visual standard.

## Reference Screenshots

Use these assets when the incoming source has an unfamiliar structure:

- `assets/screenshots/contract-special-launch-list.jpg`: contract-special list page with shared app shell, source-document workflow, update row, six metrics, quick filters, search, table selection, row actions, and pagination.
- `assets/screenshots/contract-special-shortcut-title-only.jpg`: legacy contract-special shortcut behavior; reference-only and not the shell template for new generated applications.
- `assets/screenshots/structure-template-organization-current.jpg`: human-resources organization management page with hierarchy/master-detail structure, left entity rail, right detail facts, and custom source-preserving layout.
- `assets/screenshots/structure-template-list.png`: standard generated list page reference for dense table workflows.
- `assets/screenshots/structure-template-sidebar.png`: sidebar split-view reference for grouped records and a scoped detail table.
- `assets/screenshots/structure-template-card.png`: card/board reference for status-grouped records and icon-only card actions.
- `assets/screenshots/structure-template-detail-drawer.png`: full-viewport drawer reference with KPI cards, tabs, info grid, timeline, and material/action panels.

Do not copy these images into the app. Use them to choose layout direction, density, and interaction contracts.

## Contract Module Patterns

Use contract-special as the reference for specialized workflow applications:

- Navigation: `合同管控专项` uses global title-row actions (`运营总览`, `风险预警`, `消息`, `审批`, `设置`) plus business modules (`合同发起`, `合同签署`, `合同履约`, `变更解除`, `风险处置`, `案件管理`, `相对方管理`, `文本管理`, `台账归档`, `报表分析`, `能力监控`).
- Page data: preserve page metrics, quick filter tabs, search placeholders, batch actions, page actions, row fields, row-level actions, status badges, priority tags, amount/unit/counterparty fields, and source document references.
- Core layout: app shell -> module tab -> update/action row -> six metrics -> quick filters/search -> table -> pagination/batch bar -> drawer/modal.
- Workflow detail: primary actions such as `发起合同`, `进入审批`, `发起用印`, `发起变更`, `确认预警`, `登记风险`, `生成审计包` should open the source's drawer/modal surface instead of becoming inert buttons.
- Shortcut behavior: new generated applications retain the Module + Tab row when launched through a workspace shortcut. Do not copy the legacy title-only contract-special exception.

## Human Resources Module Patterns

Use human-resources/structure-template as the reference for broad multi-module applications:

- Navigation: one application (`人力资源管理`) owns module groups such as `组织管理`, `人事管理`, `招聘管理`, `薪酬管理`, `绩效管理`, `人才发展与干部管理`, and `员工服务`; each module owns its tabs and route keys.
- View modes: list/sidebar/card are route-scoped and should persist per route when the project already has storage helpers.
- Custom structures: organization hierarchy and other non-list structures should remain custom views first, then inherit the shared title row, summary row, toolbar, and drawer behavior only where appropriate.
- Data model: sections should carry metrics, filters, columns, rows, custom layout fields, sidebar grouping fields, and detail source data together.
- Detail behavior: row and card actions should route into a full-viewport portal drawer, with overlay close, action row, KPIs, tabs, info grid, timeline, and cards.

## Source Inventory Checklist

When migrating from a source file or screenshot, capture these items before implementing:

- Company/platform logo, application switcher, user/account entry, tier state, platform-left-rail entries, and every descendant surface reached from those entries.
- Application name, logo, summary, module names, page tab labels, breadcrumbs, and back labels.
- Primary actions, secondary actions, dropdown actions, icon-only actions, hover-only labels, and disabled states.
- Update time, refresh behavior, statistics, metric helper text, risk/status counts, and badges.
- Search placeholders, filter labels/options, quick filters, sort controls, view switches, and pagination.
- Filter semantics: identify which controls are single-select, multi-select, tab-like, no-op `全部`, or true sorting before implementing.
- Table columns, row fields, row order, selected states, row-level actions, status text, status tone, priority labels, and amounts/units.
- Sidebar/card/board group names, grouping fields, counts, card metadata, and active states.
- Detail drawers, modals, tabs, KPI cards, timelines, material lists, audit logs, approvals, attachments, and linked records.
- Empty states, loading states, permission gates, validation messages, toasts, and confirmation flows.

Do not replace these with generic CRM/demo data when source data exists.

## Mapping Source Structure Into The Platform

- Map source company identity, application switching, and user/account controls into the host `TopNavigationPrimaryBar`; do not render a second company-level topbar inside the application.
- Map Max platform functions, business-application entries, and user-center backend descendants into the platform ownership domain. Do not convert them into application `globalActions`, modules, tabs, or page sections.
- A source topbar that actually represents selected-application identity belongs in the shared application row below the platform top layer; classify by scope, not by visual position alone.
- If the source has top navigation modules, map them into `topNavigationModel.js` module groups/tabs or workspace shortcut options rather than duplicating a page-local nav.
- If the source has app-wide functions, map them into `globalActions` for the first-level application row instead of putting them into content-area buttons.
- If selected module/tab state is already visible in the shared shell, remove duplicate in-page title strips or repeated descriptions.
- If source modules should act like app-wide functions, put them in the title row action area with icon plus hover label only when that matches the existing shell pattern.
- Keep page content focused on the active business workflow: update/action row, metrics, toolbar, primary list/custom content, batch actions, and drawer/modal flows.
- In the update/action row, put update time and refresh on the left, then right-align the source primary action, view dropdown, and secondary/more actions.
- If the source contains named workbench/dashboard modules, keep those modules source-preserving; implement the other record list pages with the platform list/sidebar/card structure rather than cloning the workbench composition.
- For non-list pages, preserve the source layout as a custom view first, then adapt spacing and shell integration.
- Detail drawers and drawer masks must use a body-level full viewport layer; do not offset the mask for the top navigation, sidebar, or embedded shell.

## Unknown Structure Mapping

Choose the closest platform pattern before inventing new structure:

- Source-document, approval, risk, contract, finance, legal, or workflow table -> use the contract-special list pattern.
- Organization tree, entity master data, department/unit hierarchy, or profile facts -> use the human-resources organization custom view pattern.
- Broad enterprise app with many modules and tab families -> use the human-resources module-group pattern.
- Dense record management with selectable rows -> use the structure-template list pattern plus batch bar.
- Grouped operational records by department/status/pool -> use the structure-template sidebar pattern.
- Status pipeline, pool, inventory, or kanban-like record clusters -> use the structure-template card pattern.
- Deep record detail, audit trail, materials, approval logs, or linked records -> use the full-viewport detail drawer pattern.
- Platform capability/config/audit surface -> use contract-special `能力监控` or `设置` patterns and keep integration status, owner, impact, and audit fields visible.

## Visual And Interaction Fidelity

- Match the existing platform's operational density: compact headers, restrained buttons, scan-friendly tables, and no decorative page cards.
- Reuse shadcn primitives, `.ui-secondary-button`, shared `Table`/table selection helpers, `ListBatchActionBar`, and existing lucide icons when they are already used locally.
- Follow `application-navigation.md` for first-level app right-side actions, secondary module/tab navigation, and content update/action row composition.
- Follow `application-interactions.md` for toolbar order, sort/filter semantics, route-scoped view modes, row-click handling, and shared batch-action behavior.
- Keep icon actions icon-only by default with accessible labels/tooltips; reveal text on hover only where the shell already uses that pattern.
- Use stable dimensions for rows, toolbars, action buttons, tables, and drawers so hover/open states do not shift layout.
- Use source-specific language. Do not rename actions or columns to cleaner generic words unless the project already uses those exact labels.

## Verification

Use the smallest focused checks first, then build:

- Route and navigation tests for the required top user bar, first-level application navigation, second-level module/tab navigation, and identical shell regions across Account/Platform/Shortcut/Direct launches.
- Tier/ownership checks for the Basic/Pro shared shell, Pro knowledge-only upgrade, Max platform left rail, and platform-owned descendant routes.
- Feature model tests for route resolution, filters/search, row identity, detail resolution, and batch selection.
- Static view contract tests when the repo already guards component structure.
- `pnpm --dir apps/web typecheck` when React/TypeScript boundaries are touched.
- `pnpm build` before completion for meaningful app changes.
- Browser/Playwright verification on the target route: visible title/logo/summary, no duplicate nav/title text, expected list/custom content, drawer/modal interaction, and no console runtime errors.

If full `pnpm test` has known unrelated baseline failures, run focused tests and call out the baseline instead of treating it as a new regression.

## Scoped Delivery

Apply this only when the user asks to commit or push an application change.

- Inspect the dirty worktree first. Stage only the explicit feature, shared primitive, and focused-test paths; verify with `git diff --cached --name-only` and `git diff --cached --check`.
- When the primary checkout is dirty, create a temporary clean worktree from the latest `origin/main`, transfer only the scoped diff, and verify the isolated result before committing. Do not push the dirty primary checkout.
- Fetch `origin/main` immediately before a direct `main` push. If `main` already contains an earlier merged subset of the work, do not force-push or replace that merge commit. Rebase only the remaining scoped commits onto current `origin/main`, then push `HEAD:main` only after it is a fast-forward.
- Confirm the remote target with `git ls-remote --heads origin main` after the push. Keep unrelated primary-worktree changes untouched throughout.
