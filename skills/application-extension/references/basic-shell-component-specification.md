# Basic application shell: portable component specification

This is a self-contained, desktop-only specification for generating a Basic operational application when no existing platform code is available. It describes the actual visual and interaction values extracted from the current product, but a generated application must not import, copy from, or depend on the source repository. Treat every number, color, resource path, and state rule below as the implementation contract. This version is controlled at a `1920 x 1080` CSS viewport; mobile layouts, breakpoints, and touch interactions are deferred.

Read this file before `basic-shell-visual-reference.md`: this file tells an implementation what to build; the visual reference tells it what the completed states look like.

## 1. Scope and execution modes

Use this specification in either of these modes:

| Mode | Required implementation approach |
| --- | --- |
| Standalone generation | Create the shared shell described here as local application components. The result must run after this skill directory is copied away from the current repository. Do not import a component, stylesheet, or asset path from another host repository. |
| Existing platform integration | Reuse the host's shared navigation/page primitives only when they already implement this contract. Register data and route state; do not create a page-local copy of the shell. |

The Basic application hierarchy is always:

```text
Platform top user bar
  -> first-level application identity and global actions
  -> second-level module switcher and tabs
  -> page update/action row
  -> metric strip
  -> query toolbar
  -> list, sidebar split list, or card board
  -> detail drawer / form dialog / global panel / settings drawer
```

The top three rows are required even for a one-module, one-page application. A single module uses a static module anchor and one visible selected tab; it does not remove the second navigation row. This is the portable Basic product contract. The current host still has a legacy shortcut branch that hides the third row and produces a `124 px` shell; do not reproduce that compatibility branch in a newly generated application.

## 2. Baseline tokens

### 2.1 Desktop canvas and type

| Item | Value | Rule |
| --- | --- | --- |
| Desktop baseline | controlled viewport `1920 x 1080 px` | Implement and verify this version at this exact CSS viewport. Do not derive mobile or density variants from the product tier. |
| Shell canvas | `#F8F8F8` | First-level application navigation and second-level module/tab navigation. Keep this separate from the business page canvas. |
| Application canvas | `#F5F5F5` | Main operational page background below the shared navigation. |
| Surface / elevated surface | `#FFFFFF` | Tables, dialogs, drawers, popovers, cards. |
| Primary text | `#292929` | Titles, values, selected navigation. |
| Secondary text | `#909197` | Labels, timestamps, helper text. |
| Strong table text | `#2D303B` | Table body and row titles. |
| Table header text | `#5E6069` | Table header labels. |
| Default border | `#E8E8E8` | Page separators and standard fields. |
| Accent / info | `#2652F1` | Primary actions, selected state, focus. |
| Success | `#1FC16B` | Positive status and down-trend helper. |
| Warning | `#FF9E00` | Update clock and warning state. |
| Danger | `#F23030` | Destructive status; account logout uses `#FF323B`. |
| Font stack | `PingFang SC`, `PingFang TC`, `Hiragino Sans GB`, `Microsoft YaHei`, sans-serif | Do not substitute a display or serif font. |
| Letter spacing | `0` | Do not apply negative tracking. |

### 2.2 Type scale

| Token | Font size / line height | Weight | Use |
| --- | --- | --- | --- |
| Meta | `12 / 16 px` | 400 unless noted | helper text, dates, field labels, status text |
| Body | `14 / 20 px` | 400 | controls, table cells, action labels |
| Title | `16 / 24 px` | 700 | update timestamp, application title, section title |
| Heading | `20 / 28 px` | 700 | detail drawer title, page title |
| Metric | `32 / 32 px` | 600 | metric values only |
| Small overlay label | `11 / 16 px` | 600 to 650 | global action panel labels, module kicker |

### 2.3 Spacing, radii, elevation, and motion

| Token | Value | Use |
| --- | --- | --- |
| Space 1 | `4 px` | text pair gap, compact internal gap |
| Space 2 | `8 px` | button/action gap, filter gap |
| Space 3 | `12 px` | page padding, popover padding, panel gap |
| Space 4 | `16 px` | standard horizontal button padding, drawer/panel padding |
| Space 5 | `24 px` | major content separation only |
| Control radius | `16 px` | 32 px controls, pills, compact buttons |
| Panel radius | `12 px` | menus, table header corners, board cards |
| Large card radius | `16 px` | table container, neutral large card |
| Dialog / app-switcher outer radius | `20 px` | form dialog, app-switcher popover |
| Interactive transition | `150 ms ease` | background, color, border, transform |
| Standard large overlay shadow | `0 18px 52px rgba(15, 23, 42, .14)` | topbar app switcher and account popover |
| Dropdown shadow | `0 12px 32px rgba(41, 41, 41, .12)` | filter/action dropdowns |

All buttons and menu entries must preserve keyboard focus. Use a visible `2 px` accent focus outline with `2 px` offset for standard system buttons. Disabled controls remain visible, use approximately 38% text opacity, and use `not-allowed` pointer feedback. The live top navigation currently suppresses outlines; the visible outline and focus restoration in this portable contract are deliberate accessibility enhancements, not claims about the legacy host behavior.

## 3. Required portable component tree

An independently generated application must create these component boundaries. Names may vary in the target language/framework, but responsibility must remain separate.

```text
BasicApplicationShell
|- PlatformTopUserBar
|  |- BrandLockup
|  |- ApplicationSwitcherTrigger -> ApplicationSwitcherPopover
|  `- AccountTrigger -> AccountPopover
|- ApplicationIdentityNavigation
|  |- ApplicationIdentity
|  `- ApplicationGlobalActions -> ApplicationGlobalActionPanel / SettingsDrawer
|- ModuleTabNavigation
|  |- ModuleAnchor or ModuleSwitcherPanel
|  `- PageTabs
|- ApplicationPageFrame
|  |- PageUpdateActionRow
|  |- MetricStrip
|  |- QueryToolbar
|  `- RecordSurface
`- ApplicationOverlayLayer
   |- DetailDrawer
   `- FormDialog
```

Do not collapse all of this into a single page component. Route state owns the selected application, module, and tab. Overlay state owns only one active overlay per trigger family and closes stale local overlays when navigation changes.

## 4. Platform top user bar

### 4.1 Layout and brand

| Element | Exact specification |
| --- | --- |
| Top user bar | Full viewport width; `52 px` height; three-column layout: brand, flexible empty middle, account cluster. Align items center. `12 px` horizontal padding, `24 px` column gap, white at 85% opacity, `blur(20px)` backdrop, inset bottom divider `0 -.5px 0 rgba(8, 11, 24, .15)`. |
| Brand lockup box | `120 x 32 px`, left aligned, no inner padding, `8 px` optional gap to an adjacent tier tag. Do not reproduce the company name as arbitrary text when the bundled SVG is available. |
| Brand resource | `assets/basic-shell/brand-lockup.svg`; render contained at exactly `120 x 32 px`; empty alt text when the surrounding control already supplies the brand label. |
| Account cluster | Right aligned, `36 px` high, inline flex, `10 px` gap. The order is application switcher, then avatar. |
| Shell behavior | Remains mounted while application, module, tab, list mode, dialog, or drawer changes. It is not part of page scrolling. |

### 4.2 Application switcher trigger and popover

| Element | Default | Hover / focus / open | Interaction |
| --- | --- | --- | --- |
| Trigger | `28 x 28 px`, radius `14 px`, no border, `rgba(41,41,41,.06)` background, `#676767` icon color | background `rgba(41,41,41,.12)`, text/icon `#292929`, translate Y `-1 px` | `AppWindow` icon, `18 px`, stroke width `2`; click/Enter/Space toggles app switcher; Escape closes and restores focus. |
| Outer popover | width `440 px`, max width `calc(100vw - 24px)`, padding `16 px`, `1 px #CFCFCF` border, radius `20 px`, white 85% background, large overlay shadow | unchanged | Anchor below/near trigger with `10 px` offset; close on card selection, Escape, or outside click. |
| Inner app card | width `408 px`, radius `20 px`, `#F4F4F4` background, no shadow | unchanged | Contains app grid only. |
| App grid | 3 columns of `120 px`, `12 px` gap, `12 px` padding | unchanged | Order follows application catalog and shows at most the first `5` available applications, matching the current host switcher. |
| App entry | `120 x 94 px`, center column, `12 px` padding, `10 px` gap, `1 px transparent` border, radius `12 px`, white background | normal hover border `#BBBBBB`; selected border `#2652F1` | Click selects that application, updates its route, marks it selected, then closes the popover. |
| App icon/logo | `40 x 40 px`, contained, radius `10 px` | unchanged | Use catalog resource first, text fallback only when no resource exists. |
| App label | max width `96 px`, min height `20 px`, `14 / 20 px`, 400, `#000`; center, at most two lines | unchanged | Long names clamp after two lines. |

### 4.3 Account trigger and account popover

| Element | Exact specification |
| --- | --- |
| Avatar trigger | `32 x 32 px`, fully circular, transparent button with no visible pill backing. Avatar image fills `32 px`. The current host's avatar-only fallback makes the inner background/text transparent while the outer avatar retains its gradient; for a standalone app with no image, use a visible blue-to-cyan gradient `#0071E3 -> #42C8F5` with white `13 px`/760 initials as a portable resilience fallback. |
| Trigger behavior | Click/Enter/Space toggles account popover. Escape/outside click closes it. Accessible name includes current user and role. |
| Account popover | width `440 px`, max width `calc(100vw - 24px)`, `16 px` padding, `12 px` vertical gap, radius `16 px`, white at 85%, `blur(16px) saturate(1.2)`, large overlay shadow. |
| Profile row | Full width, horizontal flex, vertical center, `12 px` gap. |
| Profile avatar | `48 x 48 px`, radius `24 px`, fallback `#DFDFDF`; fallback text `#292929`, `16 px`, 500. Use `assets/basic-shell/user-avatar.png` for the stock reference avatar. |
| Identity | Name `16 / 24 px`, 500, `#292929`; contact `12 / 16 px`, 400, `rgba(41,41,41,.45)`; vertical `4 px` gap. |
| Profile actions | `32 px` high, `6 px 12 px` padding, `1 px rgba(41,41,41,.15)` border, radius `16 px`, transparent, `#2D303B`, `14 / 20 px`. Gap `8 px`; hover adds `rgba(41,41,41,.06)` background. Logout text stays `#FF323B`. |
| Optional platform entries | Only for platform-level account scope: two columns, `10 px` gap; each min height `72 px`, `12 px` padding, radius `14 px`, icon well `34 x 34 px` / radius `12 px`. Use `Database`, `SlidersHorizontal`, `AppWindow`, and `ShieldCheck` for the four host entry families; icon `17 px`, stroke `1.9`. The icon well may use the entry's accent gradient and compact shadow. Hover is neutral 6%; active uses accent 8% and accent text. Do not insert business-app actions into this block. |

## 5. First-level application identity navigation

### 5.1 Row geometry and application identity

| Element | Exact specification |
| --- | --- |
| First-level row | Full width, `72 px` high, flex layout with left identity and right actions, `12 px` horizontal padding, `12 px` inter-region gap, shell canvas `#F8F8F8`, bottom `.5 px` divider `rgba(8,11,24,.15)`. |
| Optional back action | Place before application identity only when the route has a real parent. `ArrowLeft` icon `18 px`; control `32 px` high, `0 14 px` padding, radius `16 px`. It navigates to the parent and does not replace browser history blindly. |
| Application logo | `48 x 48 px`, `object-fit: contain`, radius `8 px`; source images remain visually uncropped. Use `assets/basic-shell/hr-application-logo.png` for the stock human-resources sample. |
| Fallback module icon | `48 x 48 px` wrapper, radius `12 px`; icon is `36 px`, `#2563EB`, stroke `1.9`. |
| Application identity CSS gap | `4 px` between the `48 px` logo box and title-copy group; title-to-tier is `8 px`; title-to-summary uses `2 px` to `4 px` according to the copy wrapper. The transparent margins inside a contained PNG may create more visible breathing room, but do not increase the CSS gap. |
| App title | `16 / 24 px`, 700, `#292929`. |
| Tier badge | `20 px` height, `0 7 px` padding, radius `999 px`, `11 / 16 px`, 760. Basic uses `rgba(41,41,41,.06)` background, `rgba(41,41,41,.12)` border, `#5F6672` text. |
| Summary | `12 / 16 px`, 400, `rgba(41,41,41,.45)`, one line. The live source uses nowrap without ellipsis; the portable template adds overflow clipping and ellipsis to prevent collision in a fixed shell. |

### 5.2 Global app actions

| Element | Default | Hover/focus | Selected/open | Interaction |
| --- | --- | --- | --- | --- |
| Action cluster | right aligned; actions `8 px` apart | n/a | n/a | Actions are application-wide, never page-local toolbar duplicates. |
| Action group | `32 px` high; child gap `4 px`; right padding `4 px`; right divider `1 px rgba(41,41,41,.12)` | n/a | n/a | Adjacent groups use `4 px` left margin, `8 px` left padding and left divider. |
| Icon-only action | `32 x 32 px`, radius `16 px`, transparent, `rgba(41,41,41,.68)` icon/text | `rgba(41,41,41,.06)` background and `#292929` foreground | `rgba(38,82,241,.12)` background and `#2652F1` foreground | Use: `MessageSquareText` for messages, `FileCheck2` for todo, `LayoutGrid` for overview, `ShieldAlert` for risk, `Settings` for settings. Icon `18 px`; tooltip on hover/focus. |
| Tooltip | Top `8 px` below trigger, height `28 px`, `0 10 px` padding, radius `8 px`, `rgba(23,26,31,.92)`, white `12 / 18 px` 500, shadow `0 8px 20px rgba(15,23,42,.16)` | opacity/translate transition `120 ms` | Hide while an action panel is already open | Tooltip has no click behavior. |
| Settings/fullscreen | `32 x 32 px`, radius `16 px`, `rgba(65,65,65,.12)` backing, `#323232`, `20 px` icon / `1.9` stroke | `rgba(65,65,65,.18)`, `#171A1F` | same | Settings opens settings drawer; fullscreen uses `aria-pressed`. |
| Upgrade CTA | `32 px` high, radius pill, `0 12 px` padding, `6 px` icon/text gap, `13 / 18 px` 760 | brighter gradient and `0 8px 18px rgba(45,30,12,.18)` shadow | focus has soft amber 3 px ring | Basic uses a dark brown/charcoal horizontal gradient: `rgb(32,32,33) -> rgb(66,48,26) -> rgb(52,52,71)`, text `#E9E5D3`, 1 px `rgba(224,201,112,.4)` border. |

Global actions open one anchored panel at a time. Changing application/module/tab, choosing a card, or pressing Escape closes an existing app panel. Use accessible labels rather than relying on icon shape alone.

## 6. Second-level module and tab navigation

### 6.1 Row and static module anchor

| Element | Exact specification |
| --- | --- |
| Second-level row | Full width, `48 px` high, flex center, `20 px` gap, `8 px 12 px` padding, shell canvas `#F8F8F8`, bottom `.5 px` divider `rgba(8,11,24,.15)`. |
| Static module anchor | min width `168 px`, `40 px` high, `4 px 8 px 4 px 4 px` padding, transparent, no border/shadow; no pointer events when there is one module. |
| Module icon tile | `32 x 32 px`, radius `10 px`, `#171717` background, white icon `18 px`. |
| Module label | `16 / 20 px`, 760, `#1F2937`; optional kicker below is `11 / 13 px`, 650, `#8B949E`; vertical internal gap `1 px`. |
| Expandable module trigger | Same `min-width: 168 px`, `40 px` height, `4 px 8 px 4 px 4 px` padding and `12 px` radius as the static anchor; transparent backing. It contains the black module icon tile, module label/kicker and a right-aligned `ChevronsUpDown` icon `14 px`. | neutral 4% background | open state may keep neutral 4% background | Use this source-faithful labeled trigger whenever more than one module exists. Do not replace it with an icon-only floating button. |

### 6.2 Module switcher panel

| Element | Exact specification |
| --- | --- |
| Panel | Fixed to left content edge below shell; top `172 px`, bottom `0`, width `392 px`, max width remaining viewport, height `calc(100vh - 172px)`, `12 px` padding, white background, no radius/shadow, right `1 px rgba(226,232,240,.92)` divider, vertical scroll. |
| Panel placement | If a persistent platform rail exists, shift left origin by rail width; otherwise left origin is `0`. It is a side sheet, not a small dropdown. |
| Item list | grid with `2 px` gap. |
| Module item | min height `40 px`, two columns (label + check), `8 px 12 px` padding, radius `12 px`, transparent background, `#323232`, `14 / 22 px`, 400. |
| Hover/focus | `rgba(57,57,57,.06)` background, foreground unchanged. |
| Active | `rgba(57,57,57,.12)` background, `#3464F3` text, 700 weight, `14 px` blue check icon at right. |
| Interaction | Click changes active module and its first/remembered tab, updates route and closes switcher. The current host blurs the active element after selection; the portable implementation instead returns focus to the trigger as an explicit accessibility enhancement. Escape/outside click closes without navigation. |

### 6.3 Page tabs

| Element | Default | Hover | Active | Interaction |
| --- | --- | --- | --- | --- |
| Tab list | `48 px` high, inline flex, `8 px` gap, horizontal scroll with hidden scrollbar | n/a | n/a | Do not wrap into a second line. |
| Tab | `32 px` high, `6 px 12 px` padding, radius `16 px`, transparent, `rgba(41,41,41,.85)`, `14 / 20 px`, 400 | text `#292929`, 700 | radius becomes `0`; text `#292929`, 700; centered `80 x 2 px` underline at `-8 px` bottom | Use tab semantics: Arrow keys move focus; Enter/Space activates; chosen tab updates route. |

## 7. Standard operational page frame

Use this exact vertical order for ordinary record-list pages. The normal page uses `12 px` outer padding and `12 px` inter-row gap. These outer grid values are feature-layout ownership, not behavior supplied by `ApplicationPageScope`, which only owns application colors and type. Sidebar split mode controls its own outer shell and does not wrap a second padded card around the rail.

| Row | Size | Structure |
| --- | --- | --- |
| Update/action row | min `48 px` | Clock/time left, refresh beside time, primary and secondary actions right. Bottom `12 px` padding and a `1 px #E8E8E8` divider. |
| Metric strip | min `84 px` | Up to six equal columns, no cards between values, `12 px` gap, bottom `12 px` padding and a `1 px #E8E8E8` divider. |
| Query toolbar | min `32 px` | Sort, divider, quick filters on left; search and advanced filter on right. |
| Record surface | fills remaining page height | Table list, sidebar split list, or card board. |

### 7.1 Update/action row

| Element | Exact specification |
| --- | --- |
| Update clock | `32 x 32 px`, radius `16 px`, `rgba(255,158,0,.12)` background, `#FF9E00` `Clock3` icon at `18 px`. |
| Update copy | Label `#909197`, `12 / 16 px`; timestamp `#292929`, `16 / 24 px`, 700. Label-to-time `4 px`; time-to-refresh `8 px`. |
| Refresh | `32 x 32 px`, radius `16 px`, transparent shared button; `RefreshCw` icon `16 px`; refresh handler updates visible time/data state. |
| Primary action | `32 px` high, `6 px 16 px` padding, radius `16 px`, `#2652F1` background, white `14 / 20 px`, 500. Hover uses 86% accent mixed with white. |
| Secondary / view selector | `32 px` high, `6 px 16 px` padding, radius `16 px`, white background, `1 px #E8E8E8` border, `#292929` text, `14 / 20 px`, 500. Standard secondary control hover mixes `6%` primary text into the white surface. View selector includes `16 px` `ChevronDown`. The `4%` neutral hover is reserved for explicitly documented list/card surfaces, not the shared secondary button. |
| More action | `32 x 32 px`, icon-only, same neutral secondary control family. |
| Action menu | `220 px` width, `6 px` padding, radius `12 px`, white, dropdown shadow. Each option min `34 px`, `7 px 10 px` padding, `14 / 20 px`. |

### 7.2 Metric strip

| Element | Exact specification |
| --- | --- |
| Grid | six equal columns; maximum six metrics; `12 px` gap; transparent background. |
| Metric label/helper | `#909197`, `12 / 16 px`. |
| Metric value | `#292929`, `32 / 32 px`, 600, no wrapping. |
| Trend colors | upward/neutral helper `#29292985`; downward/positive helper `#1FC16B`. |
| Interaction | Static by default. A metric becomes a textless button/cursor pointer only when it actually filters or drills down. |

### 7.3 Query toolbar and filters

| Element | Exact specification |
| --- | --- |
| Toolbar | min height `32 px`, flex `space-between`, `12 px` major gap. Left group flexes, uses `8 px` gaps; a divider is `1 x 20 px`, `#E8E8E8`. |
| Compact controls | `32 px` high, `0 16 px` padding, radius `16 px`, body `14 / 20 px`. |
| Search | fixed/flex basis `300 px`, `32 px` high, radius `16 px`, default `rgba(41,41,41,.06)` fill; `Search` icon `16 px`, text/placeholder `14 / 20 px`. |
| Search hover | Accent border `#2652F1`, accent 8% background. |
| Search focus | Accent border, white background; preserve a visible accent focus indicator. |
| Filter menu | width `220 px`, `6 px` padding, radius `12 px`, white, dropdown shadow; item min `34 px`, `7 px 10 px` padding, `14 / 20 px`. |
| Filter states | Sort is single-select radio. Ordinary quick filters are multi-select checkboxes and keep their menu open when toggled. Checked/open trigger uses accent 8% background and `#2652F1` text. Advanced filter uses `Filter` icon `16 px`, selected count, grouped options, and a clear action. |

## 8. Record display modes

### 8.1 Table list (default)

| Element | Exact specification |
| --- | --- |
| Table container | Fills available height, white, `12 px` padding, radius `16 px`. |
| Table | At least available width; uses separate borders and zero border spacing; top corners `12 px`. |
| Header | height `36 px`, `0 12 px` padding, `#F5F5F6` background, `#5E6069`, `14 / 20 px`, 400; right divider `1 px rgba(8,11,24,.15)`. |
| Data row | height `68 px`, `12 px` cell padding, bottom divider `1 px rgba(8,11,24,.08)`, `#2D303B`, `14 / 20 px`, middle aligned. |
| Row hover | Cell background `#F9FAFB`. No blue hover fill. |
| Primary cell | grid with `4 px` gap; primary `#2D303B`, `14 / 20 px`, 400; secondary `#909197`, `12 / 16 px`; both truncate to one line. |
| Status | Shared `ApplicationRecordList` defaults to a compact pill badge when `kind: status` is configured. Use a dot only when the feature explicitly chooses the dot helper, as the HR reference table does: dot `8 x 8 px`, fully round, `8 px` text gap; green `#24A148`, amber `#D97706`, blue `#2652F1`. Do not silently convert every status to dots. |
| Row action links | unboxed text `#2652F1`, `12 / 16 px`; hover mixes accent 82% with black. |
| Selection column | fixed `42 px`; checkbox hit area `24 px`; checked uses `#2652F1` fill/border and white tick. |
| Sticky action column | When configured, sticky to right with white background, z-index above rows, left `1 px` shadow/divider; hover background remains `#F9FAFB`. |
| Row activation | Entire row may open detail except a descendant button, input, select, textarea, anchor, or label. |
| Pagination | height `64 px`, `0 12 px` padding, `12 px` gap, `#6B7280` `12 px` text. Controls min `28 x 28 px`, radius `8 px`, white, `1 px rgba(8,11,24,.08)` border, `#4B5563`. The page-size trigger shows `每页10条` plus `ChevronDown` `14 px`; its menu uses the standard `220 px` dropdown, shows available sizes, and marks the current option with `Check` `14 px`. Current page has `#2652F1` border/text and 760 weight. Prev/next icons `14 px`; disabled opacity `.4`. |

### 8.1.1 Selection and batch action row

| Element | Exact specification |
| --- | --- |
| Activation | Appears only when one or more visible records are selected. Header select-all reflects unchecked, mixed, and checked states. Selection must not trigger row detail. |
| Batch row | `48 px` high, full record-surface width, flex `space-between`, vertical center, `12 px` horizontal padding, white surface, top/bottom `1 px #E8E8E8` divider. It replaces no data row and does not float over pagination. |
| Summary | `14 / 20 px`, 500, `#292929`; selected count may use `#2652F1`. |
| Actions | Shared 32 px controls with `8 px` gap. Put destructive actions last and use danger text. `取消选择` clears the complete selection set. |

### 8.2 Sidebar split list

| Element | Exact specification |
| --- | --- |
| Ownership and overall split | This mode is feature-owned by the roster/sidebar view, not by the shared table adapter. Use `360 px minmax(0, 1fr)` grid, no gap. |
| Left rail | rows: update/action `48 px`, search `32 px`, group list fills remainder; `12 px` padding, `12 px` gaps, right `.5 px rgba(41,41,41,.15)` divider. |
| Rail search | fill available `256 px` region, `32 px` high, radius `16 px`, neutral 6% background; companion More button `32 px`. |
| Group card | min height `78 px`, `16 px 12 px` padding, `8 px` bottom spacing, radius `12 px`, white, transparent border. Label `#292929`, `16 / 24 px`, 500. |
| Group count | `2 px 8 px` padding, radius pill, accent 8% background, `#2652F1`, `12 / 16 px`, 700. |
| Compact group icons | `24 x 24 px`, radius `6 px`, neutral 6% background, `#5E6069` icon `14 px`. |
| Group description/meta | Description `#5E6069`, `12 / 18 px`; meta label `#909197`, `11 / 14 px`; value `#292929`, `12 / 16 px`, 600. |
| Group hover/active | Hover white + `rgba(41,41,41,.15)` border. Active background `#F3F6FE`, `#2F61EB` border, `aria-current=true`. |
| Right pane | same update/metric/toolbar/list rhythm as default mode; title uses `20 / 28 px`, 700; detail table baseline min width `1120 px`. |

### 8.3 Card board

| Element | Exact specification |
| --- | --- |
| Board | `12 px` padding; five equal columns, `12 px` gap; horizontal overflow allowed. |
| Column | header `36 px`, fill content, top radius `12 px`, content `#F7F8FA`, `8 px` gap and `8 px` padding. |
| Column header | `0 12 px` padding, white, `14 / 20 px`, 700. Use a visible status color band: green `#14A76C`, blue `#2F61EB`, cyan `#0E9FBD`, amber `#D97706`, red `#DC3545`. |
| Record card | min height `154 px`, grid `24 px + remaining`, `10 px` gap, `12 px` padding, radius `10 px`, white, `1 px rgba(8,11,24,.08)` border, shadow `0 1px 2px rgba(8,11,24,.04)`. Show at most the first two matching records in each reference column. Footer actions are `Eye`, `Pencil`, and `Plus`, each `14 px`. |
| Card text | title `#1F2937`, `14 / 20 px`, 700; secondary `#6F7480`, `12 / 16 px`; bell `16 px`, footer icons `14 px`. |
| Card tags/actions | tag height `22 px`, `0 8 px` padding, radius `11 px`, `#F4F5F7` background, `#5E6069` `12 / 16 px`. Icon action `24 x 24 px`, radius `12 px`, same neutral background. |
| Selected / hover | Selected: accent 32% border and `#F7FAFF` background. Hover may translate Y `-2 px`, use accent 38% border and `0 14px 30px rgba(38,82,241,.18)` shadow. The current host's `is-raised` class is a static first-card presentation state, not proof of drag-and-drop; do not add drag behavior unless the functional document requires it. |

## 9. Overlay surfaces

### 9.1 Detail drawer

| Element | Exact specification |
| --- | --- |
| Overlay | full viewport, z-index at least `130`; `rgba(41,41,41,.24)` dimming and `blur(8px)` in the portable visual. The current shared drawer closes unconditionally on scrim/Escape and has no focus trap. A generated standalone app must trap focus, return focus and may add an unsaved-change guard; those are portable safety enhancements. |
| Drawer | right aligned, default width `1280 px`, max width `calc(100vw - 64px)`, full viewport height, white, no outer radius, `12 px` padding, `12 px` internal gap. |
| Drawer header | min height `32 px`, space-between, `12 px` gap, `12 px` bottom padding, `1 px #E8E8E8` divider. |
| Drawer title | `20 / 28 px`, 700, `#292929`; optional subtitle `12 / 16 px`, `#909197`. Header actions use 32 px controls. |
| Drawer tabs | min `32 px`, `4 px` gap, horizontal overflow; tab `32 px`, `6 px 12 px`, radius `16 px`, `14 / 20 px`; hover neutral 6%; active accent 8% background, `#2652F1`, 700. |
| Drawer body | scrolls independently; grid of content sections with `12 px` gap. |
| Information card | 3-column grid where space allows; card border `1 px #E8E8E8`, radius `16 px`, white, `12 px` padding. Label `12 / 16 px` muted; value `14 / 20 px`, 600. |
| Detail panel | border `1 px #E8E8E8`, radius `16 px`, `12 px` padding, `8 px` internal gap. Panel `h3` is `14 / 20 px`, 700. Progress track `8 px` high, radius `16 px`, primary text 10% track, `#2652F1` fill. |
| Detail composition | Information fields use a 3-column grid. Process material may use a 2-column `minmax(0,1fr)` node/timeline layout with `12 px` column gap. Nested node and timeline rows use `8 px` internal spacing, compact bordered items, and chronological ordering. Repeated material cards use a 3-column card grid where width permits. |

### 9.2 Form dialog

| Element | Exact specification |
| --- | --- |
| Mask | full viewport, black at `10%` plus `blur(4px)`, matching the shared dialog overlay. |
| Dialog | centered, width `100%` up to `720 px`, white, radius `20 px`. Never exceed viewport minus `32 px`. |
| Dialog header | title is `16 / 16 px`, 500, `#292929`. Description is optional only; omit it entirely when the functional source has no helper copy. Close uses an icon button with an accessible label. |
| Form body | grid with `12 px` gap; use two fields per row when the field density supports it. Labels approximately `14 / 19.25 px`, 500; fields visually follow standard 32 px control family; textarea expands vertically. |
| Footer | fixed `64 px` height, vertically centered, right-aligned action group, top `1 px #E8E8E8` divider, `8 px` action gap. Cancel is secondary, submit is primary. |
| Interaction | The current shared source does not provide pending or dirty guards. The portable implementation must prevent duplicate posting while pending, focus the first field, trap focus and return focus; an unsaved-change guard is required when the target actually persists user input. Mark these as standalone safety behavior, not source parity. |

### 9.3 Application global action panel

| Element | Exact specification |
| --- | --- |
| Popover | width `clamp(520px, 42vw, 580px)`, max `calc(100vw - 32px)`, zero outer padding, radius `16 px`, clipped content; max height `min(680px, calc(100vh - 120px))`, vertical scroll. Anchor it to its first-level global action. |
| Header | `16 px` padding, `16 px` gap, bottom `1 px #E8E8E8` divider. Eyebrow `11 / 16 px`, 600 muted; title `18 / 24 px`, 700; description `12 / 18 px` muted. |
| Status chip | min height `24 px`, `0 8 px` padding, radius `6 px`, `11 / 16 px`, 650; accent 8% background and accent 24% border. Risk uses danger palette. |
| Metrics | 4 equal columns, `8 px` gap, `12 px 16 px` padding. Metric card min `86 px`, `10 px` padding, `4 px` internal gap, `1 px #E8E8E8` border, radius `12 px`, neutral 4% surface. Value `20 / 24 px`, 700. |
| Content grid | `1.2fr .8fr` columns, `12 px` gap, `4 px 16 px 16 px` padding. Section heading `13 / 18 px`, 650; list rows use 4 to 8 px gaps and compact bordered cards. |
| Interaction | One panel open at a time. In the current source the popover anchor wraps the global-action group and content rows are informational `article` elements without item click behavior. Route/module change, Escape or outside click closes it. A portable target may anchor more precisely to the activating button and close after an actionable item is selected only when that item has a real command. |

### 9.4 Settings drawer

| Element | Exact specification |
| --- | --- |
| Sheet | fixed beneath shell; top `172 px`, right `0`, bottom `0`, left content boundary, white, no dim overlay, no radius/shadow, `16 px` padding. |
| Header | min `32 px`, horizontally distributed, `10 px` gap. Title `20 / 32 px`, 700; description `14 / 20 px` muted; close `20 x 20 px`, circular, icon `16 px`, neutral hover. |
| Settings tabs | min `34 px` high, `24 px` gap, `14 / 20 px`; active and hover are 700 `#292929`; active underline `56 x 2 px` at bottom `-2 px`. |
| Behavior | Settings is an application-level side state, not a separate page header. Close on X/Escape. The current host resets to the first settings tab every time the sheet opens; use that behavior for source fidelity unless the business document explicitly requests remembered state. |

## 10. Resource manifest and exact calls

All paths below are relative to the root of this skill. They are bundled with the skill so a generated standalone application can copy them into its own static asset directory. Do not refer to the original repository paths at runtime.

| Resource path | Type / native size | Use | Exact rendering rule |
| --- | --- | --- | --- |
| `assets/basic-shell/brand-lockup.svg` | SVG vector | Platform company lockup | `120 x 32 px`, `object-fit: contain`; use in the top user bar only. |
| `assets/basic-shell/hr-application-logo.png` | PNG, `648 x 628 px` RGBA | Stock Basic application identity and switcher sample | Contain inside `48 x 48 px` identity box or `40 x 40 px` app-switcher entry; never crop with `cover`. |
| `assets/basic-shell/user-avatar.png` | PNG, `96 x 96 px` RGBA | Stock user avatar | `32 x 32 px` trigger; `48 x 48 px` account profile. Fully circular crop. |
| `assets/basic-shell/application-asset-management.png` | PNG, `144 x 144 px` | App switcher stock card | Contain inside `40 x 40 px`. |
| `assets/basic-shell/application-contract-special.png` | PNG, `144 x 144 px` | App switcher stock card | Contain inside `40 x 40 px`. |
| `assets/basic-shell/application-finance-management.png` | PNG, `124 x 124 px` RGBA | App switcher stock card | Contain inside `40 x 40 px`. |
| `assets/basic-shell/application-major-decision.png` | PNG, `629 x 628 px` RGBA | App switcher stock card | Contain inside `40 x 40 px`. |
| `assets/basic-shell/manifest.json` | JSON integrity manifest | Resource verification | Lists every bundled runtime asset's SHA-256, native dimensions and render rule. Run `node scripts/verify-basic-shell-assets.mjs` before copying. |

When the target product provides its own approved logo/avatar assets, swap only the resource source while retaining the specified dimensions and `object-fit` rule. Do not take screenshots as runtime UI images.

## 11. Bundled visual-state resources

Use the exact matching image below for visual acceptance after implementing the named state. These files are reference images only and must not be embedded in the generated user interface.

| State | Resource path | Must be compared for |
| --- | --- | --- |
| Default table list | `assets/screenshots/basic-shell-list-table.png` | complete 52/72/48 shell, update row, metrics, filters, table, pagination |
| Sidebar list | `assets/screenshots/basic-shell-sidebar-list.png` | 360 px rail, selected group, content/table alignment |
| Card board | `assets/screenshots/basic-shell-card-board.png` | five status columns, card density, selected/hover treatment |
| Detail drawer | `assets/screenshots/basic-shell-detail-drawer.png` | dim layer, drawer proportions, tabs, information grid, panels |
| Form dialog | `assets/screenshots/basic-shell-form-dialog.png` | centered form, 20 px radius, 64 px footer, field grid |
| Global action panel | `assets/screenshots/basic-shell-global-action-panel.png` | anchored 520–580 px panel, 4 metrics, compact lists |
| Settings drawer | `assets/screenshots/basic-shell-settings-drawer.png` | overlay-free application settings sheet below 172 px shell |
| Application switcher | `assets/screenshots/basic-shell-application-switcher.png` | 440 px popover, 408 px inner card, three-column grid |
| Account popover | `assets/screenshots/basic-shell-account-popover.png` | avatar profile row and two 32 px outlined actions |
| Module switcher | `assets/screenshots/basic-shell-module-switcher.png` | fixed 392 px left panel and active module state |

## 12. Standalone acceptance checklist

Before handing off a standalone generated application, verify every item:

1. The shell height is exactly `172 px`: `52 + 72 + 48 px`.
2. Brand, app switcher, avatar, application identity, global actions, module anchor/switcher, and active tab are each rendered exactly once.
3. The app switcher and account popover use bundled resource paths that exist in the generated app's static asset directory.
4. Choosing an app, module, or tab updates real application state and closes stale popovers/panels.
5. A list page uses the four-row rhythm: update/action, metrics, query, record surface.
6. Table, sidebar, and card modes preserve their specific layout, density, and hover rules; do not treat them as cosmetic variants of the same generic card grid.
7. Detail drawer, form dialog, global action panel, settings drawer, and module switcher support Escape, focus return, and outside-close behavior where specified.
8. The completed state has been checked at a `1920 x 1080` CSS viewport against the matching bundled screenshot for structure and visible state. Correct shell geometry before changing business-page content; do not run pixel-diff acceptance unless the screenshot has matching controlled metadata.

## 13. Source traceability (not a runtime dependency)

The values above were extracted from the live product's shared owners. This table is for maintaining this skill; it is not part of a generated application's dependency graph. A standalone generator must use the values already written in sections 2–12 and the bundled resources, without opening or importing any source path below.

| Source section | Canonical owner | Evidence covered |
| --- | --- | --- |
| Shell heights and desktop canvas | `apps/web/styles/00-base.css` and `docs/平台建设UI规范.md` | `52 px` top bar, `72 px` application row, `48 px` module row, `172 px` total; `1920 x 1080 px` controlled product baseline, with mobile deferred. |
| Top user bar, app switcher, account popover | `apps/web/styles/02-navigation.css` and `TopNavigationPrimaryBar.jsx` | Brand geometry, trigger order, icons, popover/card grid, avatar, account actions, open/close behavior. |
| Application identity/actions and module/tabs | `apps/web/styles/02-navigation.css` and `TopNavigationSecondaryNav.jsx` | `#F8F8F8` shell canvas, identity spacing, tier badge, global actions, tooltips, module switcher, tabs and utility actions. |
| Application public tokens and buttons | `apps/web/index.css`, `SystemButton.module.css`, and `components/ui/button.tsx` | `#F5F5F5` page canvas, type scale, colors, spacing, radii, 32 px controls, 16 px inline padding, 14/20 px/500 button text, 6% secondary hover and disabled states. |
| Update row, metrics, filters, drawer and form | `ApplicationPagePrimitives.jsx` and `ApplicationPagePrimitives.module.css` | Page row order, clock/refresh, metric strip, query controls, detail drawer, form dialog and 64 px footer. |
| Record table and pagination | `ApplicationRecordList.jsx` and `ApplicationRecordList.module.css` | Table density, headers, 68 px rows, hover, statuses, row actions, selection and pagination. |
| Batch selection row | `ListTableShell.jsx` and `apps/web/styles/21-list-batch-actions.css` | Conditional 48 px selected-action row, count, batch commands and clear selection. |
| Sidebar and board modes | `StructureTemplateRosterViews.jsx` and `StructureTemplateView.css` | 360 px feature-owned sidebar rail, group cards, five-column board, first-two-card limit and Eye/Pencil/Plus actions. |
| Detail information body | `ApplicationRecordDetailBody.jsx` and `ApplicationRecordDetailBody.module.css` | Three-column information grid, panels, progress, cards and timelines. |
| Global action panel | `ApplicationGlobalActionPanel.jsx` and `ApplicationGlobalActionPanel.module.css` | 16 px outer radius, 520–580 px width, metrics, compact lists and distribution bars. |
| Settings | `ApplicationSettingsDrawer.jsx`, `useWorkspaceSelection.js`, and `apps/web/styles/02-navigation.css` | Full content-area sheet below 172 px shell, no overlay/radius/shadow, settings tabs and reset-to-first-tab behavior. |

Portable-only differences are intentionally limited to: always retaining the 172 px three-row shell instead of the host shortcut compatibility branch; adding visible keyboard focus, focus trapping and focus return; adding robust image fallbacks and summary overflow; and optionally adding pending/dirty protection when real persistence exists. These differences must not be used to infer undocumented host behavior.
