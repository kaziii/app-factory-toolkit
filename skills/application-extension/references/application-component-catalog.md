# Business Application Component Catalog

Use this catalog after `application-component-contracts.md` when generating or merging a business application in a target platform repository containing `docs/平台建设UI规范.md` and the shared shell. It captures the platform's production component choices without copying component source into each feature.

## Availability Gate

Before importing a catalog entry, confirm its source path exists in the target checkout. `ApplicationRecordList` is the current target visual baseline but may be ahead of an older checkout. If it is unavailable, fall back to `ListTableShell` with a feature adapter; do not create a feature-local substitute that claims to be shared.

## Page Composition

Use this sequence for a standard record-management page:

`ApplicationPageScope -> ApplicationPageHeader -> ApplicationMetricStrip -> ApplicationQueryToolbar -> ApplicationRecordList -> ApplicationDetailDrawer + ApplicationRecordDetailBody`

Use `ApplicationFormDialog + ApplicationSchemaFieldGrid` for create/edit flows. Custom workbenches, organization trees, analysis surfaces, and source-specific detail layouts may keep their own inner composition while retaining the shared scope, header, navigation, and overlay boundaries.

## Selection Table

| Component | Source | Use it for | Keep feature-owned |
| --- | --- | --- | --- |
| `ApplicationPageScope` | `apps/web/src/shared/ui/application/ApplicationPagePrimitives.jsx` | application token scope and `data-ui-layer="application"` | feature layout class and `--application-local-*` overrides |
| `ApplicationPageHeader` | same file | 48px update/action row; update time, refresh, primary action, view mode, more actions, optional supplement | source labels and action handlers |
| `ApplicationMetricStrip` | same file | up to six page metrics | metric values, helpers, and click behavior |
| `ApplicationQueryToolbar` + filter/search primitives | same file | fixed sort/filter/search order | filter model, visible fields, and query behavior |
| `ApplicationRecordList` | `apps/web/src/shared/ui/application/ApplicationRecordList.jsx` | ordinary selectable record table with human-resources visual baseline | columns, rows, source labels, row actions, selection state, detail handler |
| `ListTableShell` | `apps/web/src/shared/ui/ListTableShell.jsx` | custom row markup or specialized table adapter | custom cells and documented class slots; never pagination/select-all/row-click plumbing |
| `ApplicationRecordDetailBody` | `apps/web/src/shared/ui/application/ApplicationRecordDetailBody.jsx` | standard KPI, info, node/progress, timeline, and summary-card detail content | source data and panel composition |
| `ApplicationDetailDrawer` | `apps/web/src/shared/ui/application/ApplicationPagePrimitives.jsx` | body-portal detail overlay and close behavior | title, actions, tabs, and body data |
| `ApplicationSchemaFieldGrid` | `apps/web/src/shared/ui/application/ApplicationSchemaFieldGrid.jsx` | schema-like text/select/textarea form fields | field definitions, values, validation, and submit behavior |
| `ApplicationFormDialog` | `apps/web/src/shared/ui/application/ApplicationPagePrimitives.jsx` | create/edit dialog carrier | form state and submit/cancel handling |
| `SystemButton` | `apps/web/src/shared/ui/SystemButton.jsx` | primary, secondary, quiet, icon, row, and batch actions | label, handler, disabled reason; always set `layer="application"` |

## Canonical Record List

Use `ApplicationRecordList` with `columns`, `rows`, `rowKey`, `rowDetailKey`, `onRowDetail`, and optional `selection`, `batchActions`, `renderCell`, `renderRowActions`, `pageSizeOptions`, `fillHeight`, and `tableMinWidth`. A rendered row-action column becomes sticky automatically.

The component owns the list baseline:

- transparent outer card; white table container with 16px radius and 12px inset
- 12px top table radius, 36px neutral table head, 68px data rows, 42px selection column, and 64px pagination
- primary title/meta cells, semantic status cells, text row actions, current-page selection, batch bar, pagination, and row-click guard
- table columns size to content; use `tableMinWidth` for dense, horizontally scrollable source tables and keep a sticky action column when the source needs it
- neutral `#f9fafb` row hover; do not tint an ordinary row with the application accent

Do not wrap it in another table card or reproduce its header/cell/pagination CSS in the feature. Pass data and documented slots instead.

## Detail And Form Boundaries

- Use `ApplicationRecordDetailBody` only when its anatomy matches the source. It is not a mandate to flatten a source-specific process, workbench, or analysis view.
- For new detail pages, keep identifier, state, and organization metadata in KPI or information content. Retain an existing drawer subtitle only for compatibility with a stronger source contract.
- Use `ApplicationSchemaFieldGrid` when the form is naturally field-schema driven. Use feature-owned form markup for specialized editors, but keep the shared dialog carrier and application token scope.
- Portal-mounted drawers, dialogs, dropdowns, and popovers need `data-ui-layer="application"`; add `data-application-theme` when a scoped local theme must cross the portal.

## Token And Layout Contract

- Use public `--application-*` tokens. The standard foundation is canvas `#f5f5f5`, surface `#ffffff`, text `#292929`, muted `#909197`, border `#e8e8e8`, and accent `#2652f1`.
- Use only `--application-local-*` overrides on `ApplicationPageScope` or `data-application-theme` for intentional per-application variation.
- Keep the standard list grid at `48px 84px 32px minmax(0, 1fr)` with 12px page padding/gap. Controls are 32px high; application control radius is 16px.
- Keep page-specific business styles in their feature owner. Do not restore broad global CSS or duplicate shared list/drawer skins.

## Verification

When the catalog is used, update the consuming feature's contract test and run the applicable shared checks:

```bash
node --test \
  apps/web/src/shared/ui/application/applicationPagePrimitivesContract.test.mjs \
  apps/web/src/shared/ui/application/applicationRecordList.test.mjs \
  apps/web/src/shared/ui/listTableShellContract.test.mjs
pnpm --dir apps/web css:ownership
pnpm --dir apps/web css:order
pnpm --dir apps/web fsd:guard
pnpm --dir apps/web typecheck
pnpm build
```

If `ApplicationRecordList` is unavailable in the target checkout, omit its test from the command and document the `ListTableShell` fallback in the feature handoff.
