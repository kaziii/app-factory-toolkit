# Template application contract

Use this reference when applying the code-first Basic shell template to a fresh React/Vite target. It is self-contained: its target must not depend on a host platform repository, local aliases, or original asset paths.

## Controlled Validation Scope

The controlled viewport is `1920 x 1080` CSS pixels. Mobile, compact-density, and large-screen validation are deferred.

The screenshots under `assets/reference-states/` are references for required structure and named states only. Treat a screenshot as a pixel-comparison baseline only when its source version, CSS viewport, DPR, route, fixture, state, browser, and font metadata are all registered. If any metadata is missing, do not run or claim pixel-baseline acceptance from that image.

## 1. Copy contract

For a new application, copy the complete `assets/react-basic-shell/` folder to an empty target directory, run `pnpm install --frozen-lockfile`, then `pnpm check`. The package, pnpm lockfile, runtime verifier, README, HTML, Vite config, React entry and stock mount are already present. `pnpm check` builds the app, starts a short-lived local preview, verifies the home page, `/basic-shell/manifest.json`, and every manifest-declared resource, then closes the preview. Replace `src/basicShellData.js` from the user's functional structure document; no host repository is needed.

Use pnpm only. Do not create or retain `package-lock.json`, do not use npm or yarn, and do not open `index.html` through `file://`: Vite must transform `/src/main.jsx` through `pnpm dev` or `pnpm preview`.

For an existing React/Vite target, use the fragment mapping below.

Copy the bundled tree using these destination relationships. Preserve filenames exactly.

| Bundled source | Target destination | Purpose |
| --- | --- | --- |
| `assets/react-basic-shell/src/BasicApplicationShell.jsx` | `src/features/basic-shell/BasicApplicationShell.jsx` or equivalent feature-owned UI directory | Stateful shell component. |
| `assets/react-basic-shell/src/basic-application-shell.css` | beside the shell component | Imported by the shell exactly once. |
| `assets/react-basic-shell/src/basicShellData.js` | beside the shell component | Local definition/data contract; replace stock business data. |
| `assets/react-basic-shell/public/basic-shell/*` | `public/basic-shell/*` | Runtime assets called through stable `/basic-shell/...` URLs. |

Install `lucide-react` in a new target before compiling. The template otherwise needs only React hooks and CSS.

## 2. Runtime entry

Mount `BasicApplicationShell` once at the route owning the business application. Supply a local definition object. It may initially reuse `defaultApplicationDefinition`, then replace its content with data extracted from the user's functional document.

The template owns this fixed structure:

```text
BasicApplicationShell
|- Platform top user bar
|- Application identity and global actions
|- Module/page navigation
|- Update/action row
|- Metrics
|- Query toolbar
|- Table / sidebar / board view
`- Module switcher / settings / app panel / detail drawer / form dialog
```

Do not place a second page header or second navigation layer above the template. Add business-specific content inside the record/detail/form data boundaries or as a named content extension below the page frame.

## 3. Functional-document mapping

Map a normal business functional document to the local definition in this order.

| Functional-document material | Definition surface | Default if omitted |
| --- | --- | --- |
| Business application name, description, logo | `application` and matching `applications` entry | Name from document; bundled HR logo only as temporary stock resource. |
| User/session document | `currentUser` | Use generic current-user label and bundled avatar. |
| Application/module/page hierarchy | `modules[].tabs` | One module and one active tab; do not remove the module/tab row. |
| App-wide notices, todo, overview, risk | `globalPanels` | Keep the four standard actions and neutral empty states. |
| Header timestamp/action/view modes | `page.updatedAt`, `page.createLabel` | Current time label, `新建记录`, and all three display modes. |
| Per-tab page data | `pagesByTab[tabId]` overlays `page` | Add one object per functional page. Its title, metrics, filters, columns, rows, groups, board columns, form fields, and detail schema replace the base values when that tab is active. |
| Statistics | `page.metrics` or `pagesByTab[tabId].metrics` | Up to six columns; preserve metric strip even with sparse data. |
| Search/filter/sort document | `page.sortOptions`, structured `page.filters`, `page.searchPlaceholder` | Sort is single-select; each filter uses `{ key, label, rowKey, options }` and is truly multi-select; search scans row values. |
| Record fields | `page.columns`, `page.rows` | Use structured columns: `{ key, label, kind: 'primary' | 'status' | 'text', toneKey? }`. Preserve primary/secondary/status/action data shape. |
| Grouped records | `page.groups` | Omit sidebar mode only if function genuinely has no group concept; preserve the view-mode control. |
| Kanban/status workflow | `page.boardColumns` | Define each status group as `{ id, label, color, statuses: [] }`; cards group only from the given `statuses` array. |
| Create/edit fields | `page.formFields` | Use text/select/textarea fields, two-column layout, `required`, `options`, and full-width textareas. |
| Detail form/process material | `page.detail` | Define `tabs`, optional `tabContent`, `facts`, `infoFields`, and `sections[].panels[].items`; each fact/item can use a static `value` or a dynamic `rowKey`. |
| Batch actions | `page.batchActions` plus `onBatchAction` | Appears only after selection; clear selection remains available. |

## 4. Asset contract

The template calls these stable runtime URLs. They work after `public/basic-shell/` is copied verbatim.

| Runtime URL | Native asset | Rendered size |
| --- | --- | --- |
| `/basic-shell/brand-lockup.svg` | Company lockup SVG | `120 x 32 px` in top bar |
| `/basic-shell/user-avatar.png` | 96 px RGBA avatar | `32 x 32 px` trigger; `48 x 48 px` popover |
| `/basic-shell/hr-application-logo.png` | 648 x 628 RGBA app logo | `48 x 48 px` app identity; `40 x 40 px` switcher |
| `/basic-shell/application-finance-management.png` | 124 x 124 RGBA app logo | `40 x 40 px` switcher |
| `/basic-shell/application-asset-management.png` | 144 x 144 RGB app logo | `40 x 40 px` switcher |
| `/basic-shell/application-contract-special.png` | 144 x 144 RGB app logo | `40 x 40 px` switcher |
| `/basic-shell/application-major-decision.png` | 629 x 628 RGBA app logo | `40 x 40 px` switcher |

`/basic-shell/manifest.json` records the SHA-256, native dimensions and required render rule for every asset. Before generation run `node scripts/verify-basic-shell-assets.mjs` from the skill root. After copying, verify the same manifest is present in the target and that all seven assets return HTTP 200.

Use `object-fit: contain` for every app/brand image except user avatar, which is circular `cover`.

## 5. Core visual locks already in CSS

Do not change these unless a new approved visual system replaces Basic:

| Surface | Fixed values |
| --- | --- |
| Shell | `52 px` top user bar, `72 px` app row, `48 px` module/tabs, `172 px` total. |
| Canvas and type | `#F8F8F8` shell rows; `#F5F5F5` business canvas; `#292929` primary text; `#909197` muted text; PingFang/Hiragino/Microsoft YaHei stack. |
| Accent | `#2652F1`; primary controls `32 px` high, `16 px` radius, `16 px` inline padding. |
| Page rhythm | `48 px` update/action row, `84 px` metric strip, `32 px` toolbar, then fill record surface; normal gaps/padding `12 px`. |
| Record list | table container `16 px` radius; header `36 px`; row `68 px`; neutral hover `#F9FAFB`; pagination `64 px`. |
| Overlays | form/app-switcher `20 px` radius; detail drawer default `1280 px` max `100vw - 64 px`; module switcher `392 px`; form footer `64 px`. |

## 6. Behavioral locks already in component code

- Application card selection closes the app switcher, updates the visible app identity, and calls `onApplicationChange`.
- Module selection picks the module's first tab, closes module switcher, and clears transient panels.
- Tab selection changes active page state.
- Global actions open one anchored panel at a time; navigation and Escape close stale ones.
- Search filters displayed rows; quick filters are real multi-select sets; sort options reorder records. Table, sidebar, and board modes switch through real local state. Active tab resolves its page from `pagesByTab` before rendering content.
- Row checkboxes and select-all drive a conditional 48 px batch action bar. Page-size selection changes visible rows and pagination controls change pages.
- Row click opens a detail drawer except for interactive descendants.
- Create opens a form; submit/cancel close it. Settings opens a drawer below the `172 px` shell.
- Popovers, panels, drawers, and dialogs use Escape and/or outside close. Modal surfaces trap focus and return it to the initiating control. Form submission has a pending guard; dirty persistent forms ask before close. Keep focus-visible styling intact.

## 7. Visual comparison resources

Read only the image matching the state being implemented. The ten PNGs in `assets/reference-states/` are visual evidence, not runtime images:

- `basic-shell-list-table.png`
- `basic-shell-sidebar-list.png`
- `basic-shell-card-board.png`
- `basic-shell-detail-drawer.png`
- `basic-shell-form-dialog.png`
- `basic-shell-global-action-panel.png`
- `basic-shell-settings-drawer.png`
- `basic-shell-application-switcher.png`
- `basic-shell-account-popover.png`
- `basic-shell-module-switcher.png`
