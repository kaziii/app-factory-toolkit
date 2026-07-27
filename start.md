# 开始使用

这个文件夹可以直接作为 Codex 工作区使用，无需把内置 skill 安装到电脑的全局目录。

## 三步开始

1. 产品经理优先从 `inputs/_templates/pm-structure-table.md`（产品经理应用结构表）复制一份，保存为 `inputs/<application-id>-结构.md`，先填写应用、Module、Tab、页面和动作；复杂应用再用 `application-requirement-template.md`（业务应用需求模板）补充字段、接口和异常细节。ID 只使用小写字母、数字和连字符，例如 `contract-management`。
2. 在 Codex 中打开整个“平台业务应用生成工具”文件夹。
3. 发送：`读取 AGENTS.md，使用 inputs/<application-id>-结构.md 开始。`

Codex 的第一步会让你选择角色。出现 Codex 选择器时直接点击“产品经理”“设计师”“研发”或“工具维护者”；当前表面没有选择器时，回复对应编号或角色名称。确认后，它会直接使用内置的 `application-extension-template` skill 生成应用。

结构表适合快速确定业务骨架；`application-requirement-template.md` 适合在生成前或生成后补充字段、接口、状态和验收细节。两份文件可以同时提供，Codex 会把未确认内容保留为待确认，而不是自行编造。角色选择为“产品经理”且结构与 ID 确认后，产物目录还会包含可直接双击打开的 `产品经理预览.html`，用于确认应用、Module、Tab、页面和主要动作。

## 产物位置

每个应用生成到 `outputs/<application-id>/`，其中包含源码、运行说明、业务假设、验证结果和差距清单。产品经理角色还会获得 `产品经理预览.html`；它无需安装依赖即可打开，但正式应用仍按运行说明通过 Vite 验证。已有目录默认不会被覆盖；继续迭代时使用同一个 ID，并明确说明要修改的范围。

## 内置 skill

- `application-extension-template`：唯一入口。生成全新、独立、Basic、标准运营型 React/Vite 应用，并负责发布到演示环境。

一个应用只使用一个壳层 owner。所有应用都必须保留顶部用户栏、应用一级导航和 Module + Tab 二级导航。

## 自检

工具维护者更新规范或 skill 并重新打包后，运行：

```bash
node scripts/doctor.mjs
```

出现 `PASS` 才表示当前工具包结构、版本和文件完整性一致。业务应用自身仍需按其运行说明完成安装、构建和浏览器验证。
