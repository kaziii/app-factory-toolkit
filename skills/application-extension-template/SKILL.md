---
name: application-extension-template
description: Use when a user provides a business functional structure document and needs a high-fidelity, standalone React/Vite operational application with a runnable Basic shell, bundled React components, CSS, icons, images, lists, overlays, and interactions instead of a specification-only implementation.
---

# Application Extension Template

Use this skill as the code-first companion to `$application-extension`.

- `$application-extension`: specification-first. It tells an agent the precise geometry, tokens, interaction rules, and resource calls to build from scratch.
- `$application-extension-template`: template-first. It starts from an executable shell with the same fixed geometry, interactions, CSS, icons, and resources already included.

Use the same functional structure document with either skill to compare the resulting fidelity. Do not combine their shell implementations in one target: choose one shell owner.

## Platform UI Specification Sync

- Product specification: `docs/平台建设UI规范.md`
- Synced specification version: `v1.3`
- Synced on: `2026-07-15`
- Controlled viewport: `1920 x 1080` CSS pixels. Mobile, compact-density, and large-screen layouts are `deferred` and must not be inferred.
- Supported scope: standalone Basic applications only.
- Route existing-platform integration, Pro or Max work, HTML/Figma/source migration, and highly customized applications to `$application-extension`.
- Stable Spec IDs: `PLATFORM.TOP_USER_BAR`, `PLATFORM.MAX_RAIL`, `APPLICATION.PRIMARY_NAV`, `APPLICATION.SECONDARY_NAV`, `PAGE.UPDATE_ACTION`, `PAGE.METRIC_STRIP`, `PAGE.QUERY_TOOLBAR`, `PAGE.CONTENT_SURFACE`, `OVERLAY.DETAIL_DRAWER`, `OVERLAY.FORM_DIALOG`, `OVERLAY.GLOBAL_PANEL`, and `OVERLAY.WORKFLOW`.
- Evidence statuses: `confirmed`, `target`, `inferred`, `gap`, and `deferred`.

The product specification is authoritative. If the target's specification is newer than `v1.3`, or it exists but cannot be read or its version cannot be determined, do not treat this template as current: route to `$application-extension` to read the specification and report the mismatch before generating. When a standalone target has no product specification, use this synced contract and state that limitation in the handoff.

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
6. Verify the default list state and every requested alternate state at the controlled `1920 x 1080` CSS viewport. Use the matching image under `assets/reference-states/` only as a structure and named-state reference unless its source version, CSS viewport, DPR, route, fixture, state, browser, and font metadata all match the test; only then may it serve as a pixel-comparison baseline. Verify app switcher, account popover, module switcher, list mode, detail drawer, form dialog, global panel, and settings drawer when the target exposes them.
7. Run `node scripts/verify-basic-shell-assets.mjs` in this skill before copying. For a new standalone target, use pnpm only: run `pnpm install --frozen-lockfile`, then `pnpm check`; never substitute npm or yarn and never accept `file://` opening of `index.html` as a runtime check. `pnpm check` builds the target, starts a short-lived preview, checks the home route, `/basic-shell/manifest.json`, and every resource declared by that manifest, then shuts the preview down. Run the target project's browser check at the controlled `1920 x 1080` CSS viewport. Confirm `public/basic-shell/manifest.json` and every bundled `/basic-shell/...` URL resolve before handoff.

## Non-Negotiable Template Rules

- Keep the shell stack at `52 px + 72 px + 48 px = 172 px`.
- Keep the top brand/user bar, application identity/action row, and module/tab row mounted once and outside page content. Exception: when the app is embedded into a host platform (e.g. published to the Moheng demo environment), pass `embedded` to `BasicApplicationShell` — it hides only the top brand/user bar because the host platform owns that layer; the remaining two rows stay mandatory.
- Keep app/module/tab state route-aware or state-aware; selecting them must change actual selection and close stale menus/panels.
- Keep resources in `public/basic-shell/` and call them through their documented absolute `/basic-shell/...` URLs. Do not link back to another repository or temporary file.
- Keep the `BasicApplicationShell` component boundary. Page features may compose it but may not duplicate its chrome or override it through broad global selectors.
- Use the supplied CSS rather than replacing operational surfaces with generic rounded-card UI.
- Preserve keyboard activation, visible focus styling, Escape close, and outside-close behavior already represented by the template. Add trigger-focus restoration when extending the stock overlays with asynchronous or destructive flows.

## Product-manager HTML confirmation preview

When this skill is invoked through the portable `平台业务应用生成工具`, the tool entry has confirmed the user role as 产品经理, and the safe `application-id` plus business structure are available, also generate `outputs/<application-id>/产品经理预览.html`. Copy the tool-root `assets/product-manager-preview.html`, then replace only `window.__PRODUCT_MANAGER_PREVIEW__` with confirmed structure data and explicit `待确认` values. Run `node scripts/verify-product-manager-preview.mjs outputs/<application-id>/产品经理预览.html` from the tool root before handoff.

This directly openable `file://` preview is a product-confirmation supplement. It does not replace the standalone React/Vite application, `pnpm check`, the single Basic shell owner, or any Basic / Pro / Max routing rule. Do not create it for other roles, for an unconfirmed ID, or when the portable tool template/validator is unavailable.

## Template Assets

| Asset | Purpose |
| --- | --- |
| `assets/react-basic-shell/package.json`, `index.html`, `vite.config.js` | Complete standalone React/Vite project scaffold. |
| `assets/react-basic-shell/pnpm-lock.yaml`, `README.md`, `scripts/verify-demo.mjs` | Reproducible pnpm runtime contract, launch instructions and automatic build/preview diagnostics. |
| `assets/react-basic-shell/src/main.jsx`, `src/App.jsx` | Runnable entry and stock shell mount. |
| `assets/react-basic-shell/src/BasicApplicationShell.jsx` | Stateful React shell, navigation, list modes, drawers, dialogs, panels, and interactions. |
| `assets/react-basic-shell/src/basic-application-shell.css` | Exact desktop Basic visual geometry and component styles. |
| `assets/react-basic-shell/src/basicShellData.js` | Replaceable data contract and stock data. |
| `assets/react-basic-shell/public/basic-shell/` | Brand SVG, user avatar, and application logo resources referenced by the template. |
| `assets/react-basic-shell/public/basic-shell/manifest.json` | Resource hashes, native dimensions and render rules. |
| `assets/reference-states/` | Ten reference screenshots for visual comparison only; never import them into the application UI. |

## Do Not

- use this template to modify a target platform repository containing `docs/平台建设UI规范.md` and the shared shell; use `$application-extension` in platform-integrated mode instead
- import source files, aliases, styles, or assets from an existing platform repository
- delete fields/actions/overlays from a source functional document solely to fit the stock data
- rename a bundled resource without changing every matching definition path
- use screenshot PNGs as visual background images or implementation assets
- treat the stock human-resources data as business content; it only proves structural data shapes
