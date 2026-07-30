---
name: application-extension-template
description: Use when a user provides a business functional structure document and needs a high-fidelity, standalone React/Vite operational application with a runnable Basic shell, bundled React components, CSS, icons, images, lists, overlays, and interactions instead of a specification-only implementation.
---

# Application Extension Template

Use this skill as the single entry for generating applications. It is template-first: it starts from an executable shell with fixed geometry, interactions, CSS, icons, and resources already included. Choose one shell owner per target application and do not introduce a second shell implementation.

## Platform UI Specification Sync

- Product specification: `docs/platform-ui-spec.md`（平台建设UI规范）
- Synced specification version: `v1.3`
- Synced on: `2026-07-15`
- Controlled viewport: `1920 x 1080` CSS pixels. Mobile, compact-density, and large-screen layouts are `deferred` and must not be inferred.
- Supported scope: standalone Basic applications only. This skill is the single default entry for all generation tasks; never ask the user to choose between templates or skills.
- Existing-platform integration, Pro or Max work, HTML/Figma/source migration, and highly customized applications are outside this skill's scope. Do not silently downgrade such requests to Basic; state the limitation.
- Stable Spec IDs: `PLATFORM.TOP_USER_BAR`, `PLATFORM.MAX_RAIL`, `APPLICATION.PRIMARY_NAV`, `APPLICATION.SECONDARY_NAV`, `PAGE.UPDATE_ACTION`, `PAGE.METRIC_STRIP`, `PAGE.QUERY_TOOLBAR`, `PAGE.CONTENT_SURFACE`, `OVERLAY.DETAIL_DRAWER`, `OVERLAY.FORM_DIALOG`, `OVERLAY.GLOBAL_PANEL`, and `OVERLAY.WORKFLOW`.
- Evidence statuses: `confirmed`, `target`, `inferred`, `gap`, and `deferred`.

The product specification is authoritative. If the target's specification is newer than `v1.3`, or it exists but cannot be read or its version cannot be determined, do not treat this template as current: read the target specification first and report the mismatch to the user before generating. When a standalone target has no product specification, use this synced contract and state that limitation in the handoff.

## Required Input

Accept a business functional structure document as the normal input. Extract application name, application summary, modules, tabs, primary actions, metrics, filters, record schema, display modes, details, forms, and business interactions from it. The document does not need to describe pixels or provide UI code.

When a business document omits a field, retain the template's structural behavior and use a neutral label/data placeholder. Do not omit the three navigation rows, a stateful list surface, or shared overlays because the input is brief.

## Workflow

1. Read `references/template-application-contract.md` before copying files. It is the source of truth for target paths, package dependency, resource paths, component boundaries, and the document-to-data mapping.
2. Choose one copy mode exactly as described in that reference:
   - for a new standalone application, copy the complete `assets/react-basic-shell/` directory. It already contains `package.json`, `pnpm-lock.yaml`, `README.md`, `index.html`, `vite.config.js`, React entry files, shell components, CSS, data, runtime verifier and `public/basic-shell/` resources;
   - for an existing React/Vite application, copy only the `src/` shell files into a feature-owned directory and copy `public/basic-shell/` without renaming assets;
   - install or retain `lucide-react` because the template uses named Lucide icons.
3. Import `BasicApplicationShell` once at the target application route. Feed it a local definition object derived from the user's functional document. Keep the template CSS imported exactly once.
4. Replace only business data and target-specific callbacks first: app identity, module/tab data, `pagesByTab` page objects, global-panel data, metrics, filters, structured columns, rows, groups, board columns, form fields, and detail schema. Preserve the component tree and its shared state ownership.
5. Implement source-specific pages below `BasicApplicationShell` only after the shell works. Reuse the page frame/list/overlay primitives in the template rather than adding a second top navigation, generic dashboard cards, or raw unstyled dialogs.
6. Verify the default list state and every requested alternate state at the controlled `1920 x 1080` CSS viewport. Use the matching downloaded reference asset (fetched per the Generation policy section; matched by its `desc`) only as a structure and named-state reference unless its source version, CSS viewport, DPR, route, fixture, state, browser, and font metadata all match the test; only then may it serve as a pixel-comparison baseline. States with no downloaded reference are verified against the written specs in `references/template-application-contract.md`. Verify app switcher, account popover, module switcher, list mode, detail drawer, form dialog, global panel, and settings drawer when the target exposes them.
7. Verify with the default assumption that the user's machine has NO Node.js and NO pnpm. The mandatory, always-available check is agent-performed static verification plus the `本地预览.html` render check described in the local-preview section below: the agent reads the generated files and confirms the payload JSON parses, the entry exists, every relative import resolves inside the file set, and the CSS is included. Only when Node is actually present on the machine may the optional enhanced path run: `node scripts/verify-basic-shell-assets.mjs` in this skill, then `pnpm install --frozen-lockfile` and `pnpm check` in the target (never substitute npm or yarn). Never make Node/pnpm a precondition for generation, preview, or publish, and never ask the user to install them.

## Non-Negotiable Template Rules

- Keep the shell stack at `52 px + 72 px + 48 px = 172 px`.
- Keep the top brand/user bar, application identity/action row, and module/tab row mounted once and outside page content. Exception: when the app is embedded into a host platform (e.g. published to the Moheng demo environment), pass `embedded` to `BasicApplicationShell` — it hides only the top brand/user bar because the host platform owns that layer; the remaining two rows stay mandatory.
- `src/App.jsx` must accept an `embedded` prop and forward it to `BasicApplicationShell` (the Moheng harness renders `<App embedded={true} />`; `本地预览.html` toggles it). Omitting the passthrough makes the app render a duplicate platform bar inside the host.
- For demo-environment targets, do not depend on `/basic-shell/...` asset URLs: the Moheng harness renders only js/jsx/css from the pushed files, so those images 404 online (and, deliberately, in `本地预览.html` too). Use `lucide-react` icons and inline SVG / data URIs for required graphics; any remaining `<img>` must tolerate load failure.
- When the generated app is confirmed only for the demo environment, trim the app-switcher `applications` list to the target application itself (or mark siblings non-selectable): selecting a fictional sibling app swaps the identity row while the modules stay, which reads as a data mismatch.
- Keep app/module/tab state route-aware or state-aware; selecting them must change actual selection and close stale menus/panels.
- Keep resources in `public/basic-shell/` and call them through their documented absolute `/basic-shell/...` URLs. Do not link back to another repository or temporary file.
- Keep the `BasicApplicationShell` component boundary. Page features may compose it but may not duplicate its chrome or override it through broad global selectors.
- Use the supplied CSS rather than replacing operational surfaces with generic rounded-card UI.
- Preserve keyboard activation, visible focus styling, Escape close, and outside-close behavior already represented by the template. Add trigger-focus restoration when extending the stock overlays with asynchronous or destructive flows.

## Local preview（本地预览，所见即所推，零 Node 依赖）

The ONLY local preview artifact is `outputs/<application-id>/本地预览.html`. It renders the real application — the exact same files that will be pushed — with the exact same in-browser pipeline the Moheng demo site uses (identical Babel presets, identical module loader, identical react/lucide runtime bundles). What the user sees locally IS what they will see after publish; producing a different artifact for confirmation than for publishing is forbidden.

Always generate it after the application files are written, for every role, with no Node/pnpm involved:

1. Assemble the push payload `files` object first (all `src/**` .jsx/.js/.css files, exactly as PUSH.md §4 will send them) and keep it as the single source of truth for this iteration.
2. Copy this skill's `assets/preview-runtime/` (react.js, lucide-react.cjs.js, babel.min.js) to `outputs/<application-id>/preview-runtime/`.
3. Copy `assets/local-preview-template.html` to `outputs/<application-id>/本地预览.html`, then replace the single line `window.__APP_PAYLOAD__ = null;` with `window.__APP_PAYLOAD__ = { appId, manifest, files, entry: "src/App.jsx", confirmItems };` where `files` is byte-identical to step 1 and `confirmItems` lists the open 待确认 items in business language.
4. Agent-verify without Node: the injected JSON parses, `entry` exists in `files`, every relative import inside `files` resolves within `files`, at least one `.css` file is present, and the three `preview-runtime/` files match the skill assets byte-for-byte.

Consistency red line: the `files` embedded in `本地预览.html` and the `files` later sent in `payload.json` must be byte-identical. Any change to the application after the preview was handed off invalidates the confirmation — rebuild `本地预览.html` and hand it off again before publishing.

The preview opens by double-click over `file://` — no server, no install. Its top toolbar defaults to 嵌入模式 (identical to how the Moheng host renders the app, top platform bar hidden) and offers 独立模式 (standalone form with the platform user bar) plus the 待确认项 list. It performs no asset compensation: resources the demo site will not render (e.g. `/basic-shell/...` URLs) also do not render locally, by design.

After generation succeeds, ALWAYS hand the preview back to the user as a clickable local link and wait for their confirmation — do not stop at "files written". The handoff message must contain:

1. the absolute `file://` URL of `本地预览.html` (e.g. `file:///D:/.../本地预览.html`, URL-encode spaces and non-ASCII path segments) plus the plain absolute path, telling the user to double-click or paste it into a browser;
2. one line explaining what to check (modules, tabs, pages, actions, 待确认 items — this is the real app render, not a wireframe);
3. the question "确认无误后回复「发布」即可推送到演示环境" — publishing must wait for this confirmation; never treat generation success itself as approval to publish.

## Template Assets

| Asset | Purpose |
| --- | --- |
| `assets/react-basic-shell/package.json`, `index.html`, `vite.config.js` | Complete standalone React/Vite project scaffold. |
| `assets/react-basic-shell/pnpm-lock.yaml`, `README.md`, `scripts/verify-demo.mjs` | Reproducible pnpm runtime contract, launch instructions and automatic build/preview diagnostics. |
| `assets/react-basic-shell/src/main.jsx`, `src/App.jsx` | Runnable entry and stock shell mount. |
| `assets/react-basic-shell/src/BasicApplicationShell.jsx` | Stateful React shell, navigation, list modes, drawers, dialogs, panels, and interactions. |
| `assets/react-basic-shell/src/basic-application-shell.css` | Exact desktop Basic visual geometry and component styles. |
| `assets/react-basic-shell/src/basicShellData.js` | Replaceable data contract and stock data. |
| `assets/react-basic-shell/src/services/dataSource.jsx` | Mock-first data layer: `useDataSource({ endpoint, mock })` renders mock immediately and swaps in real API data when the host bridge or same-origin fetch succeeds; `DataBadge` marks each data block as real/mock. Endpoints must come from `references/publish/api-catalog.json`. |
| `assets/react-basic-shell/public/basic-shell/` | Brand SVG, user avatar, and application logo resources referenced by the template. |
| `assets/react-basic-shell/public/basic-shell/manifest.json` | Resource hashes, native dimensions and render rules. |
| Reference-state screenshots (platform-fetched) | Not bundled with this skill. Downloaded per machine from the demo platform before generating (see Generation policy §3); visual comparison only — never import them into the application UI or the push payload. |
| `assets/local-preview-template.html` | 所见即所推 local preview shell: same in-browser compile/load pipeline as the Moheng demo harness, plus 嵌入/独立 mode toggle and 待确认项 list. Inject the push payload into `window.__APP_PAYLOAD__`. |
| `assets/preview-runtime/react.js`, `lucide-react.cjs.js`, `babel.min.js` | Vendor runtime bundles identical to the demo site's; copied beside `本地预览.html` so it opens over `file://` with zero installs. |

## Generation policy (fetched live before generating, stated up front)

When the target is the Moheng demo environment, the platform configures per machine how the app should be generated (size cap, data wiring, a server-authored UI directive, and the set of downloadable reference assets). Fetch it **once, right before generating**:

1. Read `deviceId` from `~/.moheng-appfactory/config` (Windows: `%USERPROFILE%\.moheng-appfactory\config`); if absent, generate one now following PUSH.md §2.1 (random `dev_` + UUID, never derived from hardware/account data, disclosed to the user in one line the first time) and merge it into the config.
2. Call `GET <演示站>/api/preview/policy` with header `X-Device-Id: <deviceId>` (demo-server address is built into PUSH.md §1 — never ask the user for it). The response's `limits` is the only block to consume: `{ maxFiles, realData, reviewRequired, ttlDays, generationBrief, updatedAt, ... }`.
3. Call `GET <演示站>/api/preview/assets` with the same `X-Device-Id` header. The response is `{ assets: [{ id, group, desc, url }], expiresInSeconds }` — a machine-specific list of reference-state screenshots for the Basic shell. Download every listed `url` immediately into a session temp directory (the URLs are short-lived signed links); keep the `desc` next to each file. During generation and state verification, use each downloaded image as the visual reference for the state its `desc` names. **The list is whatever the platform granted this machine — use what arrived, generate the rest from the written specs, and never speculate about, request, or mention assets that were not in the list.**
4. On any network failure or non-200: for the policy, fall back to the `limits` cached in the same config (written by PUSH.md §5.1 from the last push response), then to the documented default (`maxFiles: 30`, `realData: false`, empty `generationBrief`); for the assets, proceed with none — `references/template-application-contract.md` §4–§6 written specs fully define the shell structure and every named state, so generation continues without image references.
5. **State the effective policy in one line before generating**, e.g. 「本机当前生成上限 40 个源文件、数据用演示数据、参考资产 N 张（平台按验证码配置，刚从演示站拉取）。你也可以在 `%USERPROFILE%\.moheng-appfactory\config` 里查看。」 When running on fallback, say so instead (「演示站不可达，按本机缓存/默认档生成」).

`generationBrief` is a server-authored directive describing the expected **UI execution standard** for this machine (e.g. visual polish level, which page forms and overlays to favor, how closely to align with the downloaded reference assets, demo-data texture). **Apply it verbatim, on top of the functional document.** It does not limit business content: every module, tab, and capability the functional document requires is always generated in full. The configuration system behind it is platform-internal: do not enumerate tiers, name policies, or speculate about other machines' configurations in front of the user — if asked about the app's look or size, answer truthfully with this machine's fetched values and where they come from (the platform administrator configures generation per gate code/machine), without inventing detail beyond what the responses contained. An empty `generationBrief` means no extra directive — build normally from the functional document and template specs.

Size the build to fit `maxFiles`: keep every module/tab the functional document requires, and reduce cost by merging secondary tabs, sharing page frames, and cutting optional overlays before dropping any business capability. When the document genuinely cannot fit, generate the core modules and **tell the user exactly what was left out and why** — never silently drop functionality and never claim the app is complete when it is not.

`realData: false` means all data blocks render mock via `useDataSource` while still filling catalog-matched `endpoint`s and `expectedApis[]`. `realData: true` allows wiring endpoints the administrator has opened; everything else stays mock.

Rules that keep this honest:

- never raise the fetched or cached values, never write them into the app source or the push payload, and never claim a higher allowance than the platform granted;
- both fetches send only the random `deviceId` header — never send file contents, requirement text, or any hardware/account identifier with them; the deviceId disclosure duty of PUSH.md §2.1 applies to these fetches too (first-time creation is announced; if the user refuses the identifier, skip both fetches and use the cached/default values with no image references);
- downloaded reference assets are generation-time visual evidence only: keep them in the temp directory, never copy them into the application output, the push payload, or the preview HTML, and never share their signed URLs;
- a machine that has never pushed is not yet bound to a gate code, so both fetches return the platform default configuration — that is expected, not an error; the machine's real configuration applies from the first successful push onward;
- the server re-checks at push (`400 too many files for generation scope`); the local cap only avoids generating something that would be rejected.

## Publish to the Moheng demo environment (publish 阶段)

This skill owns the publish stage for the Moheng (陌衡企信) demo-environment deployment form. It works both when the toolkit directory is the workspace and when this skill is installed standalone as a plugin — the publish assets live inside this skill at `references/publish/`.

Enter the publish stage only when BOTH of the following hold; otherwise do not push and never decide to publish on the user's behalf:

1. the generated application directory passed the agent-performed checks and the user has received the `本地预览.html` `file://` handoff described in the local-preview section above (`pnpm check` is an optional extra when Node happens to exist, never a requirement);
2. the user explicitly asked to publish after seeing the preview ("推上去 / 发布 / 生成链接").

Before assembling the payload, ALWAYS run the push pre-check in PUSH.md §3: list the apps already published under this gate code (`GET <演示站>/api/preview/apps`), decide with the user whether this push **updates an existing app** (reuse its server-side `id`, `mode: "update"`, version +1, same link) or **creates a new one** (fresh `appId`, `mode: "create"`), and say so explicitly in the handoff. When intent is ambiguous, ask — never let an id collision silently overwrite a previously published app.

The only thing to request from the user is the 12-digit gate code (skipped when already stored in `~/.moheng-appfactory/config`). Do NOT ask the user for the demo-server address — it is built into `references/publish/PUSH.md` — and do NOT ask them to confirm their role: an explicit publish request is itself the authorization.

The push also carries a local `deviceId` so the server can tell apart different machines using the same gate code. Follow PUSH.md §2.1: it must be a freshly generated random UUID (never derived from MAC address, disk serial, hostname, username, or any hardware/account data), it must be disclosed to the user in one line the first time it is created, its value and purpose must be stated truthfully whenever asked, and it must be dropped on request. Never generate or send it silently.

Then read and strictly follow `references/publish/PUSH.md` — it is the single execution authority for: gate-code retrieval and local storage, `deviceId` generation and disclosure, `payload.json` assembly rules, the curl / `Invoke-RestMethod` command templates, the mandatory four-part deliverable after success (whether this push created a new app or updated an existing one to v<N> / temporary link + validity period / version-history entry / expected-API list), and the failure table.

During generation, compare every data requirement against `references/publish/api-catalog.json`: endpoints found in the catalog count as real interfaces; the rest go into manifest `expectedApis[]` as the backend interface-requirement list shown alongside the app.

Security red lines: the 12-digit gate code is issued per person by the platform administrator (long-lived; shared by push and version-history queries); on 401/429 report truthfully and stop — never retry with altered characters; the payload must not carry any field intended to relax server-side validation; the published artifact is a demo application with no production guarantee.

## Do Not

- use this template to modify a target platform repository containing `docs/平台建设UI规范.md` and the shared shell; that scenario is outside this toolkit's scope
- import source files, aliases, styles, or assets from an existing platform repository
- delete fields/actions/overlays from a source functional document solely to fit the stock data
- rename a bundled resource without changing every matching definition path
- use screenshot PNGs as visual background images or implementation assets
- treat the stock human-resources data as business content; it only proves structural data shapes
