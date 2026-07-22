# Application Navigation Standards

Use this reference when a generated application needs to fit the shared platform shell.

**Required Basic fidelity anchor:** Read `basic-shell-component-specification.md` before generating or reviewing a Basic application, then use `basic-shell-visual-reference.md` for state comparison. Together they supply portable navigation geometry, visual tokens, bundled resources, interaction behavior, list/overlay states, and acceptance images.

## Contents

- Host Surfaces
- Global Platform User And Application Switch Layer
- Product Tier Contract
- Max Platform Function Domain
- First-Level Application Row
- Built-In Global Actions And Icons
- Module And Tab Navigation
- Built-In Module Placeholder Pattern
- Content Update And Action Row
- Tests To Add Or Update

## Host Surfaces

Inspect these before adding or changing app shell behavior:

- `apps/web/src/widgets/navigation/model/topNavigationModel.js`: application metadata, `moduleGroups`, tabs, global actions, settings routes, shortcut metadata.
- `apps/web/src/app/model/appShellModel.js`: tier normalization, platform-navigation state, and Max platform-left-rail visibility.
- `apps/web/src/widgets/navigation/model/useWorkspaceSelection.js`: route-derived selected module, child module, global action, secondary nav items, and settings state.
- `apps/web/src/widgets/navigation/ui/TopNavigationSecondaryNav.jsx`: first-level application title row, right-side action cluster, module switcher, and secondary tabs.
- `apps/web/src/widgets/navigation/ui/TopNavigationPrimaryBar.jsx`: company identity, topbar application switcher, user/account entry, tier state, and account/user-center surfaces.
- `apps/web/src/widgets/sidebar/ui/Sidebar.jsx`: Max platform left rail with platform functions and business application entries.
- `apps/web/styles/02-navigation.css`: visual contract for app identity, action icons, upgrade controls, module switcher, and secondary tabs.

## Global Platform User And Application Switch Layer

The first visible row is a platform layer above the selected application. It is owned by `TopNavigationPrimaryBar`, not by `TopNavigationSecondaryNav` or page content.

Required anatomy:

- left: company logo/platform identity
- right: application switcher and user/account entry
- descendant surfaces: application selection, account/user center, and tier-authorized platform administration

Rules:

- Keep this layer present when switching applications, modules, pages, drawers, or view modes.
- Do not put the selected application's logo, module tabs, or page actions in this layer; those belong below it.
- When merging an HTML/Figma/source page, remove or adapt its company-level logo, application switcher, and user/account chrome so the host layer is not duplicated.
- Source app identity and module navigation may be preserved, but must map to the shared application row and secondary navigation.

## Product Tier Contract

The tier model is cumulative: `Max > Pro > Basic`. Higher tiers retain every lower-tier platform capability.

| Tier  | Top platform layer                         | Platform left rail | Capability change                                                                           |
| ----- | ------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------- |
| Basic | company logo + application switcher + user | hidden             | base access to business applications                                                        |
| Pro   | same structure as Basic                    | hidden             | knowledge capabilities upgrade; keep visual and page-structure changes restrained           |
| Max   | retains the Basic/Pro top layer            | visible            | add all platform functions, all business applications, and user-center backend capabilities |

Do not create a Pro-only navigation row, persistent rail, or alternate application hierarchy. Capability flags and knowledge-service behavior may change, but the shell landmarks stay the same as Basic.

## Max Platform Function Domain

The red-frame source annotation identifies root platform ownership, not only a permanent pixel boundary. A child page may render in the main workspace outside the visible frame and still belong to Max platform governance.

- The top platform layer and the platform left rail are Max platform roots.
- Every route, page, panel, drawer, setting, and backend-management surface reached from those roots remains a Max platform-owned product capability.
- The platform left rail exposes all platform functions and all business applications; permission rules still control entry state and data access.
- User-center descendants, including account, organization/role/data-scope, security/session, entitlement, and platform preference surfaces, remain platform-owned.
- Business applications in the rail use `governedBy = max-platform` but retain `contentType = business-application`. After launch, their internal content still follows `Application -> Module -> Page -> Detail Drawer` and remains feature-owned.

Use these exact values:

| Item                                      | `contentType`          | `governedBy`   |
| ----------------------------------------- | ---------------------- | -------------- |
| Max platform function and its descendants | `platform-function`    | `max-platform` |
| business application exposed by Max       | `business-application` | `max-platform` |
| embedded target exposed by Max            | `embedded`             | `max-platform` |

Do not create `platform-governance` or another content type to represent ownership; governance belongs in `governedBy`.

Do not confuse these four surfaces:

| Surface                     | Owner             | Purpose                                                   |
| --------------------------- | ----------------- | --------------------------------------------------------- |
| platform left rail          | platform          | Max global functions and all business application entries |
| first-level application row | application shell | selected application identity and app-wide actions        |
| module switcher panel       | application shell | modules inside the selected application                   |
| page Sidebar Mode           | application page  | grouped business records and scoped detail content        |

## First-Level Application Row

The first application row sits below the global platform layer and belongs to the shared application shell, not the page content.

Left side:

- application logo or module icon, 48 x 48
- application title
- tier badge using `data-pro-tier`
- short application summary

Right side action order:

1. application global actions
2. upgrade action when the current tier allows it
3. back action when the app is launched from another app or shortcut
4. fullscreen action when available
5. settings action when settings is not already represented by a global action

Rules:

- Put standard app-wide functions in `globalActions`, not in the content toolbar.
- Use the standard action ids when possible: `dashboard`, `riskWarning`, `messages`, `todo`, `config`.
- Use the exported `applicationGlobalActionDefinitions` as the standard action source. The navigation model applies those definitions to each application; do not import or call its internal `buildApplicationStandardGlobalActions` helper from a feature.
- Render global actions as 32 x 32 icon-only ghost buttons with accessible labels and hover tooltips.
- Active global actions use the shared blue tint. Do not use heavy filled nav buttons.
- If `config` is a global action, do not also show the standalone settings icon.
- Keep upgrade CTA in the application row's right action cluster, not inside the account popover or page content.

## Built-In Global Actions And Icons

Use this exact default set for generated applications unless the source provides a stricter app-wide function list:

| actionId      | label      | route suffix  | lucide icon         | purpose                    |
| ------------- | ---------- | ------------- | ------------------- | -------------------------- |
| `dashboard`   | `运行总览` | `dashboard`   | `LayoutGrid`        | application-level overview |
| `riskWarning` | `风险预警` | `riskWarning` | `ShieldAlert`       | risk alert surface         |
| `messages`    | `消息`     | `messages`    | `MessageSquareText` | app-scoped messages        |
| `todo`        | `待办`     | `todo`        | `FileCheck2`        | app-scoped tasks/approvals |
| `config`      | `设置`     | `config`      | `Settings`          | app settings/configuration |

When adding or changing the standard set, edit the exported action definitions rather than creating a feature-local copy. The navigation model's internal helper maps these definitions to each application:

```js
export const applicationGlobalActionDefinitions = [
  { actionId: "messages", label: "消息", displayMode: "panel" },
  { actionId: "todo", label: "待办", displayMode: "panel" },
  { actionId: "dashboard", label: "运行总览", displayMode: "panel" },
  { actionId: "riskWarning", label: "风险预警", displayMode: "panel" },
  { actionId: "config", label: "设置", displayMode: "drawer" },
];
```

When editing or recreating the navigation UI, keep the icon map aligned with the shell:

```js
import {
  FileCheck2,
  LayoutGrid,
  MessageSquareText,
  Settings,
  ShieldAlert,
} from "lucide-react";

const standardGlobalActionIconMap = {
  dashboard: LayoutGrid,
  riskWarning: ShieldAlert,
  messages: MessageSquareText,
  todo: FileCheck2,
  config: Settings,
};
```

Generated app configs usually only need action ids, labels, and routes; the shared `TopNavigationSecondaryNav` supplies the icons. Do not store icon components in data unless the local code already expects that shape.

## Module And Tab Navigation

Modules and tabs must appear under the application row as shared secondary navigation.

Data model:

- Broad apps use `moduleGroups` on the application config.
- Each module group owns `id`, `label`, `routeKey`, and `tabs`.
- Each tab owns `id`, `label`, and `routeKey`.
- Single-module or legacy embedded apps may use `moduleLabels`, `moduleRoutes`, and optional `moduleTabs`, but new generated apps should prefer `moduleGroups`.

Presentation:

- The row below the app title is `secondary-module-row`.
- Put the module switcher on the left when the app has multiple modules.
- Render a static selected-module anchor on the left when the app has one module.
- Put tabs to the right in shadcn `Tabs` / `TabsList` / `TabsTrigger`.
- Keep at least one active tab visible when the app has one page.

Rules:

- New generated business applications must render this row for Account, Platform, Shortcut, and Direct launches. Do not set `hideSecondaryTabs` and do not generate a title-only application shell.
- Do not build page-local module tabs, breadcrumbs, or duplicated title strips when the shared secondary nav already shows the module/tab state.
- Keep module switching in `TopNavigationSecondaryNav` / `useWorkspaceSelection`; page components should consume route/section state and render content only.
- Module switcher dropdown is a fixed side panel aligned to the app shell offset, not a small floating menu.
- Close module switcher/dropdowns on selection and route change so hover/open labels do not linger.

## Built-In Module Placeholder Pattern

When the source gives module names but not detailed tab specs, generate module groups from the names so the shared secondary navigation is structurally correct from the first pass.

Use visible module names as the left-side module switcher labels. Use stable generated route keys when no source key exists:

```js
const defaultPlaceholderTabLabels = ["总览", "列表", "设置"];

function normalizeModuleKey(index) {
  return `module-${index + 1}`;
}

export function createPlaceholderModuleGroups({
  appId,
  appRouteKey,
  moduleNames,
  tabLabels = defaultPlaceholderTabLabels,
}) {
  return moduleNames.map((moduleName, moduleIndex) => {
    const moduleKey = normalizeModuleKey(moduleIndex);
    const moduleRouteKey = `${appRouteKey}:${moduleKey}`;

    return {
      id: `${appId}-${moduleKey}`,
      label: moduleName,
      routeKey: moduleRouteKey,
      tabs: tabLabels.map((tabLabel, tabIndex) => ({
        id: `${appId}-${moduleKey}-tab-${tabIndex + 1}`,
        label: tabIndex === 0 ? `${moduleName}总览` : tabLabel,
        routeKey:
          tabIndex === 0
            ? moduleRouteKey
            : `${moduleRouteKey}:tab-${tabIndex + 1}`,
      })),
    };
  });
}
```

Rules:

- Replace placeholder tab labels with source tabs as soon as source documentation exists.
- Keep placeholder labels visible and business-readable; do not use `Tab 1`, `Tab 2`, or developer-only route keys in the UI.
- Keep the first tab route equal to the module route.
- Set `defaultChildModuleId` to the first generated module id unless the source specifies another default.
- Do not render placeholder modules inside page content. The left-side module name belongs in the shared module switcher.
- If a module should not expose tabs yet, keep a single `${moduleName}总览` tab rather than leaving an empty secondary tab row.

## Content Update And Action Row

Every standard list/custom application page should start its content area with an update/action row below the shared navigation.

Left side:

- `数据更新时间` label
- current update time value
- refresh icon button

Right side action order:

1. primary action such as `新建`, `新增记录`, or the source's `primaryAction`
2. view-mode dropdown (`列表` / `侧栏` / `卡片`) when the page supports view modes
3. secondary action dropdown such as `更多`

Rules:

- Use a 48px row and keep it outside the toolbar/filter row.
- Keep the primary action as the only filled blue button.
- Render view mode and secondary/more controls as `.ui-secondary-button` with `ChevronDown` or `MoreHorizontal`.
- Do not put search, filters, sort, or batch actions in this row; those belong to the toolbar/list area.
- Sidebar mode uses the same update/action semantics in its sidebar header variant.
- If the source has no primary action, keep secondary actions but do not invent a fake `新建`.

## Tests To Add Or Update

Add focused tests when a generated app changes shell/navigation:

- Basic and Pro keep the same top-layer and shell landmarks and do not render the platform left rail
- Pro capability flags upgrade knowledge behavior without adding navigation structure
- Max renders platform-function and business-application groups in the platform left rail
- user-center backend and platform-entry descendant routes resolve to the platform ownership domain
- launching a business application from Max preserves its internal application/module/page/detail hierarchy
- app config exposes expected `globalActions`, module groups, and tabs
- `config` global action suppresses the standalone settings icon
- module groups/tabs resolve to secondary navigation items
- Account, Platform, Shortcut, and Direct routes retain the top user bar, first-level application navigation, and second-level module/tab navigation
- a single-module/single-page app renders a static module anchor and one active tab
- content header source contains update time, refresh, primary action, view dropdown, and more action in the expected order
