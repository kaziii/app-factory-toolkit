# Platform Top Layer

Use this reference whenever a generated or merged business application must appear in the platform shell. It captures the existing implementation, not a separate visual concept. Its default is a composed host shell plus application navigation; it is never a page-local header.

## Basic Visual Baseline

Before implementing or reviewing a Basic business application, read `basic-shell-component-specification.md` and then `basic-shell-visual-reference.md`. The former supplies portable dimensions, tokens, icon behavior, and bundled resources; the latter supplies the matching completed visual state. Use this file only for existing-platform component ownership; neither reference authorizes a feature-local replacement for `TopNavigation`.

## Source Of Truth

Read these files before changing the shell contract:

- `apps/web/src/widgets/navigation/ui/TopNavigation.jsx`: composition root. It derives application state with `useWorkspaceSelection` and renders the primary bar, overlays, and secondary navigation in order.
- `apps/web/src/widgets/navigation/ui/TopNavigationPrimaryBar.jsx`: company lockup, application switcher, avatar trigger, account popover, and tier-upgrade entry.
- `apps/web/src/widgets/navigation/ui/TopNavigationSecondaryNav.jsx`: selected-application identity, app global actions, module switcher, and page tabs.
- `apps/web/src/widgets/navigation/model/useWorkspaceSelection.js`: route-derived selected application/module/tab, local overlay reset, and module/tab navigation actions.
- `apps/web/src/widgets/navigation/model/topNavigationModel.js`: application metadata adapter, standard global actions, module group assembly, and account application entries.
- `apps/web/src/data/applications/applicationGroups.js`: source catalog for application card data: `name`, `icon`, optional `logoSrc`, `summary`, `viewKey`/`href`, `color`, and status/count.
- `apps/web/src/features/application-global-actions/model/applicationGlobalActionModel.js`: default app actions: `消息`, `待办`, `运行总览`, `风险预警`, `设置`.
- `apps/web/styles/02-navigation.css`: only the shared owner for these chrome rules. Business feature CSS must not repeat its selectors.

## Required Hierarchy

```text
TopNavigation
|- Top User Bar / TopNavigationPrimaryBar          host-owned
|  |- company lockup
|  |- application switcher trigger -> application switcher popover
|  `- avatar trigger -> account popover
|- TopNavigationOverlays                           host-owned, conditional
`- TopNavigationSecondaryNav                       application-owned content in shared chrome
   |- First-Level Application Navigation
   |  |- application logo, name, tier badge, summary
   |  `- application global actions / utility actions
   `- Second-Level Module And Tab Navigation
      |- module switcher when multiple module groups exist
      |- static module anchor when only one module exists
      `- shared tabs for the active module/page
```

The business application's own hierarchy starts only after this shell:

```text
Application -> Module -> Page -> Detail Drawer
```

Do not place the company brand, application switcher, account control, or application identity row inside page markup. The same rule applies to a source screenshot: map its visible elements to the shell owner above before reproducing business content.

## Primary Bar: Host Ownership

`TopNavigationPrimaryBar` renders a fixed host row. Its real elements are:

1. **Company lockup**: `assets/logo-primarynav-left.svg` inside `.brand-mark`. It is a platform asset, not `application.logoSrc`.
2. **Application switcher**: a compact `AppWindow` icon button (`aria-label="切换应用"`) in `.topbar-account-cluster`. It opens the application switcher popover.
3. **User entry**: an avatar-only trigger using the signed-in session/current account. Its accessible label includes the current user and role.

The target business-application contract keeps the company lockup, application switcher, and user entry in this row for Basic, Pro, and Max. The current implementation conditionally hides the switcher outside the Basic application path; treat that as an implementation gap and fix the shared host when the requested tier exposes it. Never create a second switcher in the application row.

### Application Switcher

The application switcher uses real application catalog entries rather than hand-authored shortcut cards:

```js
{
  id: 'asset-management',
  name: '资产管理平台',
  icon: '资',
  logoSrc: 'assets/...', // optional; fallback is icon text
  summary: '...',
  color: '#1f7a59',
  viewKey: 'asset-management',
  href: 'asset-management-platform.html' // optional
}
```

`TopNavigation` obtains `accountApplicationEntries` through `buildAccountApplicationEntries(applications, routeForApp)`. Selecting a card must close the popover and route through the shared route resolver. Mark the current application from the route; a selected card is not merely decorative.

The existing desktop visual contract is a 440px outer popover with a 408px neutral inner card, then a three-column grid of 120px by 94px white cards. Cards use a 40px contained icon/logo, centered application name, 12px grid padding/gap, neutral hover border, and the selected blue border. Reuse the shared components/styles; do not recreate this grid in a feature stylesheet.

### Account Popover

The account popover is also host-owned. Its base profile row contains:

- 48px avatar;
- current user name and phone/contact;
- `管理账号` action;
- `退出登录` action, connected to the host logout handler.

The source panel uses a 440px popover, 16px padding, 12px internal gap, and 32px outlined profile actions with 16px radii. The management action must be wired only when a real account-management route/handler exists; do not invent a business-app account page. In platform navigation mode, the same popover may additionally expose platform module entries. Those entries remain platform functions, never application `globalActions` or page tabs.

## Secondary Navigation: Shared Application Chrome

Render `TopNavigationSecondaryNav` only in an application shell. It is the application-level shared header below the host primary bar and has three ordered areas.

### 1. Application Identity

The left identity block is populated from the selected application/module model:

- 48px `logoSrc` image if provided, otherwise the selected module icon;
- application label;
- current tier badge;
- application summary/description.

For a new application, add the identity data to `applicationGroups.js` and the matching entry in `appModuleConfig` within `topNavigationModel.js`. `workspaceModuleFromApp` is the adapter that turns that data into the shell model. Do not hard-code a screenshot's application name, summary, logo, or tier in a new page component.

### 2. Application Global Actions

The right action cluster belongs to the selected application. Its default model comes from `buildApplicationStandardGlobalActions` and currently groups:

- `消息` and `待办`;
- `运行总览` and `风险预警`;
- `设置` as a drawer action.

These controls are compact, icon-first shared actions. Panels/drawers are controlled through `useWorkspaceSelection`; opening a module or changing route closes stale local overlays. Keep platform functions out of this list. If the source has an extra app-wide action, add it to the shared model and preserve its route/interaction, rather than adding a content-area shortcut.

### 3. Module Switcher And Page Tabs

Every generated business application renders this row. When it has multiple module groups, use the shared dropdown module switcher. When it has one module, render the selected module as a static anchor. Module data comes from `moduleGroups` or `apps` in `appModuleConfig`; selection updates the route through `selectWorkspaceChildModule`.

The active module's page tabs are shared Radix `Tabs` controls. The state is route-derived, and selection changes the hash route through `handleSecondaryNavChange`. Their order comes from source `moduleLabels`/`moduleRoutes`, `moduleGroups`, or module `tabs`; do not duplicate them in the content area.

For a simple application with one module and one page, keep the row with a static module anchor and one active tab. Do not generate a title-only shell and do not set `hideSecondaryTabs`. A default generation is incomplete until the top user bar, first-level application navigation, second-level module/tab navigation, model, route mapping, and active-tab behavior are all present.

## Default Generator Checklist

When generating a business application with no more-specific shell request:

1. Assume **Basic** only when the tier is not stated and tier behavior matters. Basic includes the host primary bar, application switcher, account popover, and application secondary navigation; it does not add the Max rail.
2. Reuse `TopNavigation`, not a new local header component. Pass the current `route`, `applications`, `userSession`, tier, and shared `onRoute`/logout handlers through the existing application shell.
3. Add catalog metadata (`name`, `icon` or `logoSrc`, `summary`, `color`, route source) and navigation metadata (`id`, module configuration, routes, optional settings module) together.
4. Define at least one module and one tab. Render the module as a switcher or static anchor and keep the active tab visible for every launch source, including Shortcut.
5. Put source-specific business content below the shared navigation. Do not replace its labels, actions, counts, or controls with generic sample data when source material exists.
6. Use the app switcher card, account popover, and shared secondary navigation as independently interactive surfaces: selected state, close-on-navigation behavior, accessible labels, and keyboard-capable shadcn/Radix primitives are required.
7. Keep styles at their owners: navigation chrome stays in `02-navigation.css`; page/business styles stay in the feature-owned file. A child page can apply application-local tokens but may not override the host layout, topbar, or shared navigation selectors.

## Verification

For a generated/merged application, verify at least:

- the host company lockup appears once and is not duplicated in application markup;
- the application switcher uses catalog data, marks the active application, and routes on selection;
- the account popover exposes the session identity and logout action;
- the selected application logo/name/summary and tier badge come from navigation metadata;
- the top user bar, first-level application navigation, and second-level module/tab navigation are all visible for Account, Platform, Shortcut, and Direct launches;
- a single-module/single-page application still renders a static module anchor and one active tab;
- module switch and page tabs update the shared route and leave no duplicate in-page navigation;
- Basic, Pro, and Max obey the existing cumulative shell rules.

Use the target route plus one module/tab switch in a browser check after meaningful UI changes. For source-level changes, run the focused navigation/model tests and the project build.
