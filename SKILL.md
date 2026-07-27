---
name: app-factory-toolkit
description: Use when a user provides a business functional structure document and needs a standalone Basic operational React/Vite application generated per the platform UI specification, with a what-you-see-is-what-you-push local HTML preview (no Node.js required) and publish to the demo environment.
---

# App Factory Toolkit

本文件是 WorkBuddy 技能规范要求的根目录入口。本技能包的完整工作流程如下：

1. 先读取 [AGENTS.md](AGENTS.md)，严格执行其中的角色门禁与状态机（role_unknown -> request_role_choice -> role_known -> inspect_request -> choose_one_skill -> execute -> verify [-> publish]）。
2. 所有生成任务的唯一执行入口是 [skills/application-extension-template/SKILL.md](skills/application-extension-template/SKILL.md)：读取其全文，并按其中的引用规则继续读取必要资源。
3. 每个应用生成到 `outputs/<application-id>/`；发布阶段按 template skill 的 publish 章节与 `references/publish/PUSH.md` 执行。

约束速览（详见 AGENTS.md 与 template SKILL.md）：

- 仅生成全新、独立、standalone Basic 运营型应用；现有平台接入、Pro / Max、HTML/Figma/旧系统迁移不在范围内，如实告知，不得静默降级。
- 同步 UI 规范版本 `v1.3`；桌面验证基线 `1920 x 1080` CSS pixels；移动端、紧凑与大屏密度均为 `deferred`。
- 默认假设使用者机器没有 Node.js/pnpm：生成、`本地预览.html`（所见即所推，双击即开）与发布全链路零 Node 依赖；`pnpm check` 仅在环境恰好可用时作为增强。
- 每个目标应用只允许一个 shell owner，必须保留顶部用户栏、应用一级导航和 Module + Tab 二级导航。
