---
name: application-extension
description: Use when generating or updating source-faithful React operational business applications from the Basic/Pro/Max platform system, either inside a target platform repository containing `docs/平台建设UI规范.md` and the shared shell or as a standalone app using bundled visual resources and portable shell/component specifications.
---

# Application extension

Use this skill to produce React page files that fit the platform's application template. It supports two execution contexts: `platform-integrated` (reuse the existing host shell) and `standalone` (build the same shell from this skill's written specification and bundled resources). The expected output is not a marketing page; it is an operational SaaS application screen with a strict full hierarchy:

Use `$application-extension-template` only as the code-first baseline for a standalone Basic application that starts from a complete React/CSS shell rather than a written specification. Keep existing-platform integration, Pro or Max work, source migration, and highly customized applications in `$application-extension`. Do not put both shell implementations into one target application.

`Top User Bar -> First-Level Application Navigation -> Second-Level Module And Tab Navigation -> Page -> Detail Drawer`

In `platform-integrated` mode the first layer is owned by the host platform; in `standalone` mode it is implemented locally from the portable shell specification. The business application's internal hierarchy remains `Application -> Module -> Page -> Detail Drawer` in every tier.

## Platform UI specification sync

- Product specification: `docs/平台建设UI规范.md`
- Synced specification version: `v1.3`
- Synced on: `2026-07-15`
- Controlled desktop viewport: `1920 x 1080` CSS pixels. Mobile layouts, breakpoints, touch gestures, compact density, and large-screen density are deferred and must not be inferred from the Basic/Pro/Max tier.
- Required shell stack in every tier: `PLATFORM.TOP_USER_BAR`, `APPLICATION.PRIMARY_NAV`, and `APPLICATION.SECONDARY_NAV`. Max adds `PLATFORM.MAX_RAIL`; it does not replace or become the application's primary navigation.
- Stable page and overlay IDs: `PAGE.UPDATE_ACTION`, `PAGE.METRIC_STRIP`, `PAGE.QUERY_TOOLBAR`, `PAGE.CONTENT_SURFACE`, `OVERLAY.DETAIL_DRAWER`, `OVERLAY.FORM_DIALOG`, `OVERLAY.GLOBAL_PANEL`, and `OVERLAY.WORKFLOW`.
- Evidence status vocabulary: `confirmed`, `target`, `inferred`, `gap`, `deferred`.

The repository product specification is authoritative. When its version is newer than this synced version, or its version cannot be determined, read it first and report the mismatch before generating or updating an application. This skill is an execution mirror and must not override a newer product rule. In a standalone context where the repository specification is unavailable, use this synced contract and state that limitation in the handoff.

## Workflow

1. Classify the work mode and execution context before editing:
   - Use `platform-integrated` only when the target is a platform repository containing `docs/平台建设UI规范.md` and the shared shell.
   - Use `standalone` when generating into a new/other repository, a demo, a separate Vite app, or any environment where the current host components are unavailable. In this mode, create the shared components described in `references/basic-shell-component-specification.md`; never import the platform source tree.
   - If the user did not specify the mode, ask whether this is `生成` (create a new application/module/page from requirements) or `合并` (merge source material into an existing platform application).
   - For `生成`, ask whether the user has detailed documentation by application, module, tab, field, action, and interaction. If not, proceed with the platform references and state the assumptions.
   - For `合并`, ask which delivery scope applies: `基础接入` (shell fit and core page), `完整业务` (complete workflows and interactions), or `平台集成` (platform shortcuts, capability hooks, audit, and cross-module navigation). These are delivery scopes, not product tiers.
   - Ask for the product tier (`Basic`, `Pro`, or `Max`) only when it affects shell or capability behavior. Tiers are cumulative: `Max` includes `Pro`, and `Pro` includes `Basic`.
   - Do not ask again when the user has already made the mode, documentation level, delivery scope, and product tier clear.
2. In `platform-integrated` mode, locate the target project and current template surfaces before editing:
   - product UI contract: `docs/平台建设UI规范.md`
   - app route/shell: `apps/web/src/App.jsx`, `apps/web/src/lib/routes.js`, `apps/web/src/app/model/appShellModel.js`
   - platform top layer: `apps/web/src/widgets/navigation/ui/TopNavigation.jsx`, `TopNavigationPrimaryBar.jsx`, and `TopNavigationSecondaryNav.jsx`
   - platform application catalog: `apps/web/src/data/applications/applicationGroups.js`
   - Max platform left rail: `apps/web/src/widgets/sidebar/ui/Sidebar.jsx`
   - module navigation: `apps/web/src/widgets/navigation/model/topNavigationModel.js`
   - page template owner: `apps/web/src/features/<feature>/` or `apps/web/src/views/apps/`
   - style owner: feature-owned CSS, not broad global CSS, unless the shell owns the rule
3. Read the relevant reference files:
   - `references/basic-shell-component-specification.md` before generating or changing any Basic business application in either execution context. It is the portable written source of truth for geometry, typography, colors, icons, radii, resources, behavior, overlays, and acceptance checks.
   - `references/platform-fidelity.md` first when the target is a platform repository containing `docs/平台建设UI规范.md` and the shared shell, or when migrating from HTML/Figma/source screenshots.
   - In `platform-integrated` mode, read `references/platform-top-layer.md` before generating a new business application or changing the host header, application switcher, account entry, application identity row, module switcher, or shared page tabs. This is the default shell ownership contract derived from the live platform components.
   - `references/basic-shell-visual-reference.md` before generating or merging any Basic business application. Use its bundled state images as the required desktop visual baseline; do not infer a replacement header from the page content.
   - `references/hierarchy.md` for file boundaries, data contracts, route/module structure.
   - `references/application-navigation.md` for product behavior of first-level application actions, mandatory second-level module/tab navigation, and content update/action rows. In `standalone` mode, use it only for behavior context; `basic-shell-component-specification.md` supplies the implementation values.
   - `references/application-interactions.md` for sorting, filters, search, view modes, row actions, page actions, batch bars, pagination, and drawer triggers.
   - `references/design-elements.md` for dimensions, spacing, typography, toolbar, statistics, list modes, and detail drawer rules.
   - `references/application-component-contracts.md` for required shared application components, public color/type/spacing tokens, manual override boundaries, and the uncertainty gate.
   - `references/application-component-catalog.md` before choosing a page, list, detail, or form implementation. It is the current platform component selection table and includes an availability gate for components that have not reached the target checkout yet.
   - `references/react-patterns.md` for component skeletons, state patterns, and verification.
4. Preserve the source before designing:
   - Inventory the source company logo, application switcher, user/account area, platform entries, and their descendant pages separately from application identity and business navigation.
   - Inventory every label, metric, filter, column, row field, status, action, drawer/modal section, navigation item, and interaction from the source.
   - Classify each source page before implementation: source workbench/dashboard/custom pages keep their source-specific layout; record list pages use the platform list/sidebar/card structure.
   - Map source navigation into the existing platform shell instead of recreating page-local top navigation.
   - Keep the source's visual structure and information density unless it conflicts with the platform shell or the user asks to simplify.
5. Preserve the application hierarchy:
   - Keep the host-owned top layer above the application: Basic shows company logo, application switcher, and user; Pro keeps the same physical page structure and only upgrades knowledge capabilities; Max keeps Pro and adds the platform left rail, all platform functions, all business applications, and user-center backend capabilities.
   - For every generated business application, configure or reuse all three `TopNavigation` regions from `references/platform-top-layer.md`: top user bar, first-level application identity/actions, and second-level module/tab navigation. In an existing shell, add metadata and routing to the shared components instead of producing page-local copies.
   - In `platform-integrated` mode, mount only the shared `TopNavigation` from `App.jsx`; never import `TopNavigationPrimaryBar` or `TopNavigationSecondaryNav` into a feature/page. Register the application in `applicationGroups.js` and `topNavigationModel.js`, then let `TopNavigation` derive its identity, actions, modules, and tabs from route state.
   - In `standalone` mode, implement the portable component tree from `basic-shell-component-specification.md`: `BasicApplicationShell`, `PlatformTopUserBar`, `ApplicationIdentityNavigation`, `ModuleTabNavigation`, `ApplicationPageFrame`, and the shared overlay layer. Keep those components independent of target platform repository paths and feed them through local catalog/route/state data.
   - Never omit the second-level navigation for a generated business application. A single-module app renders a static module anchor; a single-page app renders at least one active tab. Account, Platform, Shortcut, and Direct launches keep the same three regions.
   - Treat `Max > Pro > Basic` as cumulative capability inclusion. Do not add a new Pro navigation row, persistent rail, or strongly differentiated shell to represent a knowledge-only upgrade.
   - In Max, every route, drawer, or page descended from a platform top-layer or platform-left-rail entry belongs to the Max platform governance domain, even when its content renders in the main workspace. Keep `contentType` separate so business-application descendants retain business UI ownership.
   - Use only the product-spec ownership values: platform descendants use `contentType = platform-function`; business applications use `contentType = business-application`; Max-governed items use `governedBy = max-platform`. Never invent a `platform-governance` content type.
   - Keep platform functions out of application `globalActions`, `moduleGroups`, tabs, and page sections. A business application launched from the Max rail still uses the unchanged internal `Application -> Module -> Page -> Detail Drawer` contract.
   - Add or update application metadata, module groups, page tabs, route keys, page sections, and detail drawer data together.
   - Put app-level actions such as `运行总览`, `风险预警`, `消息`, `待办`, and `设置` in the shared application navigation action area, not inside the page content.
   - Use the built-in global action/icon defaults and placeholder module-group generator from `references/application-navigation.md` before inventing new navigation actions or page-local module tabs.
   - Present modules and tabs in the shared secondary navigation below the application title row; do not recreate module/tab navigation inside the content area.
   - Keep source workbenches and non-list layouts as custom source-preserving views when the project does not yet have a standard layout.
   - For the content area in `platform-integrated` mode, use `ApplicationPageScope`, `ApplicationPageHeader`, `ApplicationMetricStrip`, `ApplicationQueryToolbar`, `ApplicationFilterMenu`, `ApplicationAdvancedFilterMenu`, `ApplicationSearchField`, `ApplicationStatusBadge`, `ApplicationDetailDrawer`, and `ApplicationFormDialog` where their corresponding surfaces exist. Use `ApplicationRecordList` for an ordinary business record list when it is available in the target checkout; use `ApplicationRecordDetailBody` and `ApplicationSchemaFieldGrid` for standard detail/form sections when their source structure fits. Do not recreate these with page-local markup or raw controls.
   - For the content area in `standalone` mode, create equivalent local primitives following sections 7–9 of `basic-shell-component-specification.md`. Preserve their public responsibilities, dimensions, interactions, and state boundaries; do not use page-local improvised variants.
6. Implement list pages with all three modes when applicable:
   - list table
   - sidebar split view
   - card board
   - Do not copy source-file workbench composition into ordinary list pages; lists should keep the platform update row, metrics, toolbar, selectable table/card/sidebar modes, batch bar, pagination, and full-viewport detail drawer.
   - Put sorting first in the toolbar, quick filters after a divider, search and the advanced filter trigger on the right, and view-mode switching in the title/action row unless the source provides a stricter local contract.
   - In the content update row, keep the update time and refresh control on the left; place `新建`/primary action, view-mode dropdown, and secondary/more action buttons on the right.
   - Treat `sort` as a single-select filter, ordinary filters as multi-select sets, and view mode as route-scoped user preference when the project storage helpers are available.
   - Reuse `ApplicationRecordList` as the visual and data-list adapter for ordinary record pages. `ListTableShell` remains the behavior foundation and is used directly only for source-specific table markup or a specialized adapter. Reuse `SystemButton` with `layer="application"` for page, row, form, and batch actions.
   - Apply application-specific visual changes only through `--application-local-*` tokens on `ApplicationPageScope` or `data-application-theme`; never copy the same local color, spacing, or type rules into multiple features.
   - When a source, Figma, or request does not establish the required visual/interaction standard, or conflicts with the application component contract, ask the user one concise question before inventing a new component or a hard-coded value.
7. Verify with focused tests and build:
   - add/update model/navigation/view contract tests
   - run relevant `node --test ...` tests
   - in `platform-integrated` mode, run `pnpm --dir apps/web typecheck` when TypeScript types are touched and run `pnpm build` before claiming completion
   - in `standalone` mode, run the target project's available typecheck/build command before claiming completion
   - before copying standalone resources, run `node scripts/verify-basic-shell-assets.mjs`; after copying, retain `assets/basic-shell/manifest.json` (or place it beside the target static resources) and verify every hash and runtime path
   - use Playwright/browser check for at least one target route and one detail drawer when UI changes are meaningful
   - for Basic applications, capture one desktop screenshot at the target route and compare it to the matching state in `basic-shell-visual-reference.md`: always check the list-table baseline, then the relevant sidebar/card/detail/dialog/global-panel/settings/switcher/account/module-switcher state; verify the 52px + 72px + 48px shell stack before reviewing page content

## Output Contract

Generate files in the target project's existing style. In standalone mode, establish the component/data/style boundaries described in this skill rather than assuming the host repository's aliases or shared primitives exist:

- Data: section arrays, tab arrays, route maps, metrics, filters, columns, rows, detail objects.
- Model: route normalization, active section resolution, filter/search/sort, row identity, drawer detail resolution.
- UI: page layout, chrome/header, toolbar, list views, custom views, drawer, row actions, page actions, batch actions, empty/loading states.
- CSS: feature-owned class namespace and exact template dimensions from `references/design-elements.md`.
- Component system: shared application primitives, the component selection table, and `--application-*` tokens; source pages supply data and business content, not duplicate chrome.
- Default application shell: top user bar, first-level application navigation, and second-level module/tab navigation are required, shared data-driven components, not optional page decorations.
- Basic visual gate: in an existing platform reuse `TopNavigation`; in a standalone app build the portable BasicApplicationShell from the bundled component specification and resources. In both cases compare the completed route to the matching bundled Basic shell state before handoff.
- Tests: route resolution, module tab mapping, view hierarchy, and key UI contracts.
- Fidelity: source inventory, shell/navigation mapping, and any intentional omissions or simplifications called out explicitly.
- Platform ownership: target tier, top-layer mapping, Max platform-entry descendants, and the platform-versus-application boundary called out explicitly.

### Product-manager HTML confirmation preview

When this skill is invoked through the portable `平台业务应用生成工具`, the tool entry has confirmed the user role as 产品经理, and the safe `application-id` plus business structure are available, also generate `outputs/<application-id>/产品经理预览.html`. Copy the tool-root `assets/product-manager-preview.html`, then replace only `window.__PRODUCT_MANAGER_PREVIEW__` with confirmed structure data and explicit `待确认` values. Run `node scripts/verify-product-manager-preview.mjs outputs/<application-id>/产品经理预览.html` from the tool root before handoff.

The file is a directly openable `file://` product-confirmation preview, not a second shell or replacement for the formal React/Vite application. Do not create it for other roles, for an unconfirmed ID, or when the portable tool template/validator is unavailable. Do not alter the Basic / Pro / Max routing conditions for this delivery supplement.

Do not:

- create landing pages, hero pages, or decorative card-heavy screens for operational modules
- create page-specific top navigation variants
- import target platform repository source paths, reference original repository assets, or rely on host-only component aliases when generating a standalone application
- generate a title-only business application or use `hideSecondaryTabs` to remove the required second-level navigation
- duplicate the company logo, application switcher, user center, or Max platform left rail inside an application page
- turn a Pro knowledge-capability upgrade into a new page shell or prominent navigation structure
- put platform-entry descendant pages into an application's `globalActions`, modules, tabs, or page data
- flatten application modules into disconnected pages or invent generic replacement content when source content exists
- remove source fields, actions, filters, or drawer/modal sections without an explicit reason
- add new feature styles into broad global files when a feature style file exists
- edit `dist/`
- copy temporary browser/Codex preview attributes into source

## Reference Screenshots

For every Basic application, first read `references/basic-shell-component-specification.md`, then compare against the matching state in `references/basic-shell-visual-reference.md`. Use `references/platform-fidelity.md` to choose the closest page-content contract. The specification identifies which bundled logo/avatar/app assets may be copied into a generated standalone app; screenshots remain reference-only and must not be imported by the app.
