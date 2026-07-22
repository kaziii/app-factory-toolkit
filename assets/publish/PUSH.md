# 发布到陌衡企信演示环境（publish 阶段执行手册）

本文件是 AGENTS.md `publish` 阶段的唯一执行依据。产品经理确认本地检查无误并**明确要求发布**后，
按以下步骤执行。全程使用系统自带工具（curl.exe / PowerShell），不要求安装 Node.js。

## 0. 前置条件（缺一即停）

- 角色已确认为产品经理；
- `outputs/<application-id>/` 已生成且通过本地检查（`产品经理预览.html` 结构确认，
  或有 Node 环境时 `pnpm check` 通过）；
- 产品经理明确说了要发布（"推上去 / 发布 / 生成链接"），不得自行进入本阶段。

## 1. 验证码

- 先查本地配置 `~/.moheng-appfactory/config`（Windows：`%USERPROFILE%\.moheng-appfactory\config`，
  JSON：`{ "code": "XXXXXXXXXXXX", "server": "<演示站地址>" }`）：有码则复用；
- 无码时向产品经理索要，并说明：**验证码由平台管理员发放，12 位，长期有效，
  推送与「版本记录」查询共用同一个码**；拿到后写入上述配置文件；
- 服务端返回 401（错码/已吊销）或 429（限速）时**如实报错并停止**，请产品经理联系管理员；
  禁止更换字符重试。

## 2. 组装推送载荷 payload.json

由 agent 逐文件读取 `outputs/<application-id>/` 并写出 `payload.json`（勿用脚本依赖 Node）：

```json
{
  "appId": "<application-id>",
  "manifest": {
    "label": "<应用中文名>",
    "desc": "<一句话定位>",
    "accent": "<品牌强调色，可选>",
    "entry": "src/App.jsx",
    "expectedApis": [ { "method": "GET", "path": "/api/bff/...", "note": "<用途>" } ]
  },
  "files": { "src/App.jsx": "<文件内容>", "src/...": "..." }
}
```

规则：

- `files` 收录 `src/**` 全部源文件（.jsx/.js/.css）；`public/basic-shell/` 图片资源暂不上传
  （演示环境渲染端用占位图；图标走 lucide）；引用了 `/basic-shell/...` 图片的 `<img>` 需能
  容忍加载失败（模板已满足）；
- 入口 `src/App.jsx` 必须默认导出应用组件，并把收到的 `embedded` prop 透传给
  `BasicApplicationShell`（嵌入平台时隐藏顶部平台用户栏，见模板 embedded 说明）；
- `expectedApis` 来自生成阶段对 `assets/publish/api-catalog.json` 的比对结果：清单里没有的
  数据需求全部记入（这份清单会随应用展示，作为给后端的接口需求）；
- **禁止**在 payload 中出现 `policy` / `policyId` / `strength` 等字段 —— 服务端会拒收并记安全事件。

## 3. 推送命令

Windows（cmd / PowerShell 均可，Win10 1803+ 自带 curl.exe）：

```bat
curl.exe -sS -X POST "<演示站>/api/preview/apps" ^
  -H "x-gate-code: <12位验证码>" ^
  -H "content-type: application/json" ^
  --data-binary "@payload.json"
```

PowerShell 备选：

```powershell
Invoke-RestMethod -Method Post -Uri "<演示站>/api/preview/apps" `
  -Headers @{ 'x-gate-code' = '<12位验证码>' } `
  -ContentType 'application/json' -InFile payload.json
```

macOS / Linux 用 curl 同参数。`<演示站>` 取本地配置的 `server` 字段（由管理员随验证码一并告知）。

成功响应：

```json
{ "id": "...", "version": 2, "status": "active", "url": "/preview/<id>", "expiresAt": "..." }
```

- 同一应用重复推送版本号自动 +1，入口卡片与链接始终展示最新版本；
- `status` 为 `pending` 时提示：策略要求人工审核，管理员放行后上架。

## 4. 交付给产品经理

推送成功后输出（全部三项，缺一不可）：

1. **临时链接** `<演示站>/preview/<id>` 与有效期（默认 7 天，到期自动下架）；
   提示需用演示环境账号登录后访问，应用同时出现在左侧栏「应用入口」区；
2. **版本记录入口**：技术中心 → 设计资产 → 版本记录，输入同一个 12 位验证码可查看
   全部提交记录（应用/版本/时间/状态/链接）；
3. **接口需求清单**（manifest.expectedApis 内容），说明可转给后端评估。

## 5. 失败对照表

| 响应 | 含义 | 处置 |
|---|---|---|
| 400 `field not allowed` | 载荷带了策略覆盖字段 | 删除该字段重新组包 |
| 400 `illegal file path` / `entry file missing` | 文件路径越界或入口缺失 | 修正 outputs 结构 |
| 400 `too many files for generation scope` | 超出策略档位文件数上限 | 精简文件或请管理员调策略 |
| 401 | 验证码错误或已吊销 | 停止，请产品经理联系管理员 |
| 409 `appId owned by another code` | 应用 id 被他人占用 | 换一个 application-id |
| 413 | 载荷超体积上限 | 精简源码/演示数据 |
| 429 | 配额满或限速 | 提示配额（同码在线应用数上限）或稍后再试 |
| 503 | 门控服务不可用 | 停止，请管理员检查 app-gate |
