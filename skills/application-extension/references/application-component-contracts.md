# Shared Application Content Components

Use this reference for all generated or merged application content in a target platform repository containing `docs/平台建设UI规范.md` and the shared shell. It makes the visible application chrome a shared product contract while preserving each application's business content, data model, module navigation, and custom workbench layouts.

## Reuse Boundary

The application shell is already shared. Do not create page-local replacements for:

- first-level application identity, logo, global actions, module switcher, and settings: `TopNavigationSecondaryNav`
- module and tab switching: the navigation model and shared secondary navigation
- update/action row: `ApplicationPageHeader`
- statistics: `ApplicationMetricStrip` (maximum six items)
- query controls: `ApplicationQueryToolbar`, `ApplicationFilterMenu`, `ApplicationAdvancedFilterMenu`, `ApplicationSearchField`
- page and row action buttons: `SystemButton` with `layer="application"`
- state labels: `ApplicationStatusBadge`
- ordinary business record lists: `ApplicationRecordList` when it is available in the target checkout
- list behavior foundation and specialized table adapters: `ListTableShell`, `ListSelectionCheckbox`, `ListBatchActionBar`
- full-viewport detail: `ApplicationDetailDrawer`
- standard record detail body: `ApplicationRecordDetailBody` when the source fits its metric/info/panel/card anatomy
- new/edit form: `ApplicationFormDialog`
- standard schema-driven form fields: `ApplicationSchemaFieldGrid` when the source fits text/select/textarea fields

Wrap application content with `ApplicationPageScope`. For custom organization, workbench, board, or analysis surfaces, retain the source layout inside the shared header, statistics, query, action, and detail boundaries.

## Canonical Record List

Choose the list abstraction before adding table markup:

| Situation | Use | Feature owns |
| --- | --- | --- |
| Standard record page with common columns, status, actions, selection, pagination, and row detail | `ApplicationRecordList` | columns, rows, field mapping, source labels, actions, and optional class slots |
| Source-specific table needs custom row markup or a nonstandard adapter | `ListTableShell` directly | row markup, custom cells, and the specialized adapter |
| `ApplicationRecordList` is absent from the target checkout | `ListTableShell` adapter | the same data mapping; do not create a parallel shared list copy |

`ListTableShell` owns current-page slicing, select-all keys, batch-bar placement, pagination, and the row-click guard. `ApplicationRecordList` adds the human-resources business-list visual baseline: a white 16px container with 12px inset, 36px table head, 68px rows, 42px selection column, neutral row hover, primary/meta cells, status cells, row actions, and a 64px pagination footer. Read `application-component-catalog.md` for the current paths and public props.

## Public Tokens

All shared application components consume `--application-*` tokens. Their default values are defined once in `apps/web/index.css`; change that source to update every application. Do not hard-code these values in feature CSS.

Color roles:

- `canvas`, `surface`, `elevated`, `text`, `muted`, `border`
- `accent`, `on-accent`, `hover`, `selected`, `focus`, `disabled`
- `success`, `warning`, `danger`, `info`

Current application foundation: canvas `#F5F5F5`, surface/elevated `#FFFFFF`, main accent `#2652F1`, primary text `#292929`, muted text `#909197`, and border `#E8E8E8`. Status colors are success `#1FC16B`, warning `#FF9E00`, and danger `#F23030`. Use the semantic names above in component code rather than these literals.

## Control States

`SystemButton` owns common application-control states. Reuse it before adding feature-local button state CSS.

- Keep `primary` and `destructive` hover semantics distinct. Do not add a generic root `[aria-pressed='true']` rule that overrides every intent.
- For `secondary`, `quiet`, and `icon` controls, use a neutral hover: a low-opacity text/surface mix, not an accent tint.
- For a persistent selected binary state, set `aria-pressed="true"` and use accent text with a 10% transparent accent background and an 18% accent/border outline. Do not use a solid primary fill for a secondary selected state.
- Use the same selected treatment for checked menu options through Radix `data-state="checked"`. Use `aria-pressed` on a trigger only when the trigger itself represents a binary active state; a label/count alone is not selected state.
- Keep every control's dimensions stable across idle, hover, open, and selected states. Do not add feature-local `button[aria-pressed]`, `.cm-*`, or `.mdg-*` color overrides to compensate for a shared-control state.

The public `--application-*` tokens are aliases and may resolve through `--application-default-*` values and scoped local overrides. Static contract tests must assert both the default token value and the public alias relationship; do not require a fixed literal declaration on an alias.

Current dimensional scale:

- spacing: `space-1` 4px, `space-2` 8px, `space-3` 12px, `space-4` 16px, `space-5` 24px
- typography: `--application-font-family` resolves to the current platform sans stack (`PingFang SC`, `PingFang TC`, `Hiragino Sans GB`, `Microsoft YaHei`, sans-serif); meta 12/16, body 14/20, title 16/24, heading 20/28, metric 32/32
- buttons, sort, filter, search-adjacent controls, and dropdown triggers: 32px high with 16px radius
- control radius: 16px; panel radius: 12px
- update/action row: 48px; metric strip: 84px; query toolbar and compact controls: 32px; detail drawer: 1280px maximum width

For an intentional, single-application adjustment, set the matching `--application-local-*` token on `ApplicationPageScope` or `data-application-theme`. Examples include `--application-local-accent`, `--application-local-space-3`, `--application-local-font-size-body`, and `--application-local-drawer-width`. Never use a direct color, spacing, font-size, or radius to make an isolated application look different.

## Portal Context

`ApplicationPageScope` does not cross a Radix portal mounted under `document.body`. Give application-owned dropdown, popover, menu, dialog, and drawer portal content `data-ui-layer="application"`; also pass `data-application-theme` when a scoped application override must apply there. Do not add page-local fallback colors, radius, or shadows to compensate for a missing portal marker.

## Composition And Interaction

The standard record-management content order is:

`ApplicationPageHeader -> ApplicationMetricStrip -> ApplicationQueryToolbar -> ApplicationRecordList / ListTableShell adapter / custom source view -> ListBatchActionBar -> ApplicationDetailDrawer or ApplicationFormDialog`

- Header: update time and refresh on the left; primary action, a real view switch when more than one view exists, then more actions on the right.
- Query toolbar: sort first, one divider, quick filters, then search and advanced filter on the right. Sort is single-select; normal filters are multi-select when their business model allows it; search is controlled and filters the current records.
- Status labels use semantic tones only: `info`, `success`, `warning`, `danger`, or `neutral`.
- A detail drawer owns its body-level backdrop and close behavior. Never leave a second page-local mask behind it.
- A detail drawer header renders only the main title with a bottom divider; auxiliary record metadata belongs in KPI/info content, not under the title.
- Detail drawer information cards, material rows, and process rows use neutral backgrounds without borders. Keep status labels regular-weight neutral text unless represented by `ApplicationStatusBadge`.
- A form dialog owns submit/cancel semantics. Business fields and validation remain feature-owned.
- Bulk bars stay in normal list flow. They do not become floating glass cards.

## Uncertainty Gate

Ask the user one concise question before implementing when any of these is unknown or contradictory:

- whether the request is a new standard or a source-specific exception
- which source behavior wins when a screenshot, Figma, and existing application disagree
- a required interaction/state has no source or product rule
- a needed visual token is not represented by the public application token set

Do not create a page-local component, direct visual value, or new application-wide token before resolving that ambiguity.

## Verification

For a shared content-system change, add or update a focused contract test covering the shared primitive and every representative application migration. When a canonical record list is involved, include its component contract test and at least one consuming application contract. Run relevant feature tests, `pnpm --dir apps/web css:ownership` when ownership is touched, `pnpm --dir apps/web css:order` when ordering is touched, and `pnpm build`. Verify one target list route and one detail drawer in the in-app browser when it is available.
