# Platform App Design Elements

Use these values unless the target feature already defines stricter tokens.

## UI Component Center Maintenance

When adding or promoting reusable UI in a target platform repository containing `docs/平台建设UI规范.md` and the shared shell, keep the technical center UI component registry current:

- shared primitives in `apps/web/src/shared/ui/` and stable cross-application interaction patterns must be added to `apps/web/src/features/ui-component-center/data/uiComponentCenterData.js`.
- organize registry items by component-library families such as `foundations`, `actions`, `navigation`, `cards`, `lists`, `forms`, `toolbars`, `overlays`, `feedback`, and `templates`, not by implementation layer alone.
- each registry item should include `kind`, `sourceDomain`, `sourcePath`, `importPath`, `stylePaths` when styles are owned elsewhere, `testPaths`, `usage`, `maintain`, `variants`, `states`, `anatomy`, `designRules`, `relatedComponents`, `tags`, and `previewType`.
- update `apps/web/src/features/ui-component-center/model/uiComponentCenterModel.test.mjs` when adding a new component family, changing registry invariants, or promoting a page pattern into the component library.
- do not build one-off showcase markup that bypasses the registry; the component center page must remain data-driven so future agents can update it without reading the whole UI page.

## Shell And Page Layout

### Platform Top Layer And Max Platform Left Rail

See `application-navigation.md` for tier behavior and ownership. This section defines the current desktop visual contract:

- platform top layer height: `var(--topbar-height)`, currently 52px
- topbar padding: 12px; full viewport width; one subtle bottom divider
- company logo image: 120 x 32px
- application-switch trigger: 28 x 28px, 18px icon
- user avatar trigger: 32 x 32px
- Basic and Pro use the same physical top-layer and page-shell structure; do not create a visually dominant Pro chrome variant for a knowledge-capability upgrade
- Max adds the persistent `platform left rail`; its current expanded width is `var(--sidebar-width)`, 220px by default
- the platform left rail contains global platform functions and business-application entries; it is not the application module switcher and is not the page-level `Sidebar Mode`
- application themes must not alter the company logo, platform switcher, user center, or platform-left-rail geometry

Application page canvas:

- root dashboard background: `#f5f5f5`
- page background: `#f8f8f8`
- shell owns full height: `calc(100vh - nav height)`
- operational page layout: grid
- standard list page rows: `48px 84px 32px minmax(0, 1fr)`
- page padding: 12px
- page gap: 12px
- sidebar mode layout: one full-height split view, no outer page padding/gap
- custom/non-list layout rows: `48px 84px minmax(0, 1fr)`

Avoid nested cards. Use cards only for repeated items, panels, or drawers.

## Secondary Navigation

See `application-navigation.md` for behavior and model placement. This section defines the visual contract.

Application module logo and title:

- logo: 48 x 48, object-fit contain, radius 8px
- title: 16px / 24px, weight 700, color `#292929`
- summary: 12px / 16px, color `rgba(41, 41, 41, .45)`
- divider: 1px x 20px, `rgba(8, 11, 24, .15)`

First-level app right actions:

- global action button: 32 x 32, radius 16px, icon 18 x 18, transparent idle
- global action hover: `rgba(41, 41, 41, 0.06)`, text `#292929`
- global action active: `rgba(38, 82, 241, 0.12)`, text `#2652f1`
- tooltip: top `100% + 8px`, height 28px, radius 8px, background `rgba(23, 26, 31, 0.92)`, 12px text
- global action group has a right divider before upgrade/back/fullscreen/settings actions
- upgrade CTA: height 32px, pill radius, 13px / 18px, dark gradient; show it only when a higher tier exists (Basic may upgrade, Pro may upgrade to Max, Max has no upgrade CTA)
- fullscreen/settings: 32 x 32 icon buttons

Secondary tabs:

- container height: `var(--application-subnav-height)`
- gap: 8px
- tab height: 32px
- tab padding: `6px 12px`
- tab radius: 16px when idle/hover
- tab font: 14px / 20px, weight 400 idle, 700 hover/active
- active background: `#f8f8f8`
- active underline: 80px x 2px, centered, bottom -8px, color `#292929`
- no heavy solid active fills; no blue focus boxes

Left-side module switching:

- use shared secondary nav module switcher/dropdown, not page-local tabs
- module trigger should be visually neutral when expanded: no default card background, border, or shadow
- trigger height: 40px when showing module label; icon well 32 x 32, radius 10px
- module switcher panel: fixed, top `var(--application-shell-height)`, width 392px, full remaining viewport height, white background, right border only, no rounded floating menu
- module switcher item: min-height 40px, radius 12px, 14px / 22px, active blue text
- selected module text should be 16px when requested for module labels

## Data Update And Action Row

See `application-navigation.md` for ordering. This row is the first row of page content, below the shared application navigation.

Header/update row:

- height: 48px
- bottom padding: 12px
- bottom border: 0.5px `rgba(41, 41, 41, 0.15)`
- left update group gap: 8px
- update icon: 32 x 32, radius 16px, background `rgba(255, 158, 0, 0.12)`, icon `#ff9e00`, SVG 18 x 18
- label: 12px / 16px, color `#909197`
- time value: 16px / 24px, weight 700, color `#292929`
- refresh button: 32 x 32, radius 16px, transparent; hover background `rgba(38, 82, 241, 0.08)`, hover color `#2652f1`

Primary action:

- use `SystemButton` with `layer="application"`
- height: 32px
- radius: 16px
- background `#2652f1`
- text white
- padding `6px 16px`
- no shadow

Secondary action/dropdown buttons:

- use `SystemButton` with `layer="application"` and `intent="secondary"`
- height: 32px
- radius: 16px
- include lucide icon where action is tool-like (`MoreHorizontal`, `ChevronDown`, `Filter`)
- dropdown side offset: 8px
- action order: primary action -> view mode dropdown -> more/secondary action dropdown
- more/action dropdown width: 176px, radius 12px, shadow `0 12px 32px rgba(8, 11, 24, 0.12)`

## Statistics

Summary grid:

- height: 84px
- columns: 6 equal columns
- gap: 12px
- bottom border: 0.5px `rgba(41, 41, 41, 0.15)`
- no card backgrounds, borders, radius, or shadows inside summary cards
- card padding bottom: 12px
- label: 12px / 16px, color `rgba(41, 41, 41, 0.45)`
- value: 32px / 32px, weight 600, color `#292929`
- helper: 12px / 16px, color `#292929`
- trend arrows: red up `#f23030`, green down `#1fc16b`

Show at most six metrics in the summary row.

## Toolbar, Filters, Search, View Switch

See `application-interactions.md` for behavioral rules. This section defines the visual contract.

Toolbar/query row:

- height: 32px
- display flex, align center, gap 8px
- sort dropdown first
- divider: 1px x 20px, `rgba(41, 41, 41, 0.15)`
- quick filter group flexes and clips overflow
- quick filter max width: 160px
- right actions: search + filter button

Search:

- width: 300px
- height: 32px
- radius: 16px
- border transparent
- background `rgba(41, 41, 41, 0.06)`
- hover border `rgb(18, 44, 237)`, background `rgba(18, 44, 237, 0.08)`
- focus background white, no visible blue ring
- text: 14px, color `#2d303b`
- placeholder: `#909197`

Filter dropdown:

- content width: 220px
- radius: 12px
- background white
- shadow `0 12px 32px rgba(8, 11, 24, 0.12)`
- padding 6px
- option min-height: 34px
- option padding: `7px 10px`
- option font: 14px / 20px
- checked background `rgba(38, 82, 241, 0.08)`, checked text `#2652f1`
- selected trigger state: keep the same 32px `.ui-secondary-button` dimensions; add active text only through the selected label/count, not a larger badge

View switch:

- include `列表`, `侧栏`, `卡片`
- store active view per route/page when the project already has route-scoped storage
- custom non-list pages can ignore the switch or keep list label inert only when no list modes exist
- title/action row trigger uses `.ui-secondary-button`, `ChevronDown`, and checked dropdown items; do not build a page-local segmented control unless the source already does

## List Mode

Shared table shell:

- use `ApplicationRecordList` for ordinary business record lists when it is available in the target checkout; it is the human-resources visual baseline and composes the shared table behavior
- use `ListTableShell` directly only for custom source rows or specialized feature adapters that cannot use `ApplicationRecordList`
- keep the feature's existing table/card/scroll/pagination class slots when migrating a specialized workflow page
- keep shadcn-style `data-slot` table semantics intact; source CSS may target `[data-slot='table-head']`, `[data-slot='table-cell']`, and `[data-slot='table-row']`
- non-selectable sidebar tables may reuse `ListTableShell` without `selection`; selectable list mode should pass the feature selection header/cell wrappers and batch bar wrapper
- do not change drawer/modal visuals while extracting the list shell; overlay rules remain a separate detail-drawer contract

List panel:

- background white
- radius: `12px 12px 0 0`
- one scroll owner inside table area
- data card background transparent, no border/shadow
- table container padding: 12px
- table container background white
- table container radius: 16px
- do not add a feature-local card/table skin around `ApplicationRecordList`; pass data, row actions, and documented class slots instead

Table:

- table radius: `12px 12px 0 0`
- header height: 36px
- header padding: `0 12px`
- header background `#f5f5f6`
- header text: 14px / 20px, weight 400, color `#5e6069`
- row cell height: 68px
- row padding: 12px
- row border-bottom: `1px solid rgba(8, 11, 24, 0.08)`
- row text: 14px / 20px, color `#2d303b`
- hover cell background: `#f9fafb`
- selection column width: 42px
- primary cell: title 14px / 20px, secondary 12px / 16px `#909197`
- row actions: text buttons 12px / 16px, color `#2f61eb`

Pagination:

- height: 64px
- padding: `0 12px`
- text: 12px, color `#6b7280`

Batch operations:

- use shared `ListBatchActionBar`
- hidden by default
- visible only when selected count > 0 via active class
- provide clear action
- actions should be domain-specific but concise, e.g. `批量调整`, `批量导出`, `批量通知`
- keep the batch bar inside the list panel, not as a global page overlay unless the existing feature has a fixed-bottom batch bar contract
- active bar is full list width, static, transparent, and above the table/card list content by default
- first batch action uses primary batch styling but remains restrained: white background, blue border/text, blue fill only on hover

## Sidebar Mode

`Sidebar Mode` is a business-page view mode inside the application content area. It must not replace, imitate, or inherit navigation ownership from the Max `platform left rail`.

Sidebar mode layout:

- grid columns: `360px minmax(0, 1fr)`
- full height
- no outer page padding
- left rail rows: `48px 32px minmax(0, 1fr)`
- left rail padding: 12px
- left rail gap: 12px
- divider: right border 0.5px `rgba(41, 41, 41, 0.15)`
- sidebar search width: 256px, height 32px, radius 16px

Left cards:

- min-height: 78px
- padding: `16px 12px`
- radius: 12px
- idle border transparent, background white
- hover border `rgba(41, 41, 41, 0.15)`
- active border `#2f61eb`, background `#f3f6fe`
- title: 16px / 24px, weight 500, color `#292929`
- subtitle: 12px / 16px, color `#909197`
- small icon action buttons: 24 x 24, radius 6px

Detail side:

- rows: `32px 84px 32px minmax(0, 1fr)`
- padding: 12px
- title: 20px / 28px, weight 700
- table panel radius: 12px, border `rgba(8, 11, 24, 0.08)`, shadow `0 8px 24px rgba(8, 11, 24, 0.05)`

## Card Mode

Board:

- padding: 12px
- columns: 5 equal columns
- gap: 12px
- overflow auto

Column:

- header height: 36px
- radius: `12px 12px 0 0`
- column body background `#f7f8fa`
- body gap: 8px, padding 8px
- tone colors:
  - blue `#2f61eb`
  - green `#14a76c`
  - cyan `#0e9fbd`
  - amber `#d97706`
  - red `#dc3545`

Card:

- min-height: 154px
- grid columns: `24px minmax(0, 1fr)`
- gap: 10px
- padding: 12px
- border `rgba(8, 11, 24, 0.08)`
- radius: 10px
- background white
- selected border `rgba(38, 82, 241, 0.32)`, background `#f7faff`
- raised card translateY(-2px), shadow `0 14px 30px rgba(38, 82, 241, 0.18)`
- title: 14px / 20px, weight 700, color `#1f2937`
- meta/body: 12px / 16px, color `#6f7480`
- icon buttons: 24 x 24, radius 12px

## Detail Drawer

Layer:

- fixed full viewport, inset 0, z-index 130
- overlay covers full viewport and must have no border radius
- overlay background `rgba(15, 23, 42, 0.24)`
- overlay blur: 8px
- drawer sits above overlay and slides from the right

Drawer:

- width: 1280px
- max-width: `calc(100vw - 64px)`
- height: 100%
- padding: 12px
- gap: 12px
- border: 0
- radius: 0
- background white
- shadow none
- transform transition: 220ms ease

Drawer header:

- layout: flex, align center, justify between, gap 12px
- title group: min-width 0, grid, gap 2px
- min-height: 32px
- bottom divider: 1px `--application-border`, with 12px bottom padding
- title: 20px / 28px, weight 700, color `#111827`
- no title subtitle: record code/category/status/organization metadata must move into KPI or info-grid content
- action group: inline-flex, align center, justify flex-end, gap 8px, on the same row as the title group
- mini button: 32px height, radius 16px, 14px / 20px, padding `6px 16px`
- primary mini: white background, `#2652f1` border/text, blue fill only on hover
- close button: 32 x 32, radius 8px, transparent; hover `rgba(15, 23, 42, 0.06)`

Drawer content:

- body stack: display grid, grid-auto-rows max-content, align-content start, gap 12px
- KPI grid: 4 equal columns, gap 12px
- KPI/info card: radius 12px, neutral background, no border, padding 12px
- tabs: height at least 32px, pill, gap 4px, active blue tint and 700 weight
- info grid: 3 equal columns, gap 10px
- section heading row: margin 0; vertical spacing comes from the body stack
- two-column body: `1.05fr 0.95fr`, gap 12px
- three-card bottom grid: 3 equal columns, gap 12px
- panel radius: 12px, neutral background, border 0, padding 12px
- material/process rows: white or elevated background, border 0, radius 12px, regular body weight

## Non-List Custom Pages

If a source page is not a list, keep its structure in a custom view first. Source workbench/dashboard modules are custom views; ordinary record list pages are not.

- organization tree: left list + right details
- analysis report: left topic list + report body
- card grid: repeated business cards
- budget/tree table: source-preserving hierarchy rows

Use the same page header and summary row unless the source layout explicitly replaces them.

For mixed source files, preserve the named workbench modules according to the source file, but implement the remaining list pages with the standard page rows, update row, metrics, toolbar, selectable list/sidebar/card modes, batch action bar, pagination, and full-viewport detail drawer.
