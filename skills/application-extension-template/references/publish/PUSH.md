# 发布到陌衡企信演示环境（publish 阶段执行手册）

本文件是 `publish` 阶段的唯一执行依据（工具包目录形态由 AGENTS.md §6 进入；插件安装形态由
`application-extension-template` SKILL.md 的 publish 章节进入）。产品经理确认本地检查无误并
**明确要求发布**后，按以下步骤执行。全程使用系统自带工具（curl.exe / PowerShell），不要求安装 Node.js。

> 目录约定：下文 `<应用目录>` 指本次生成的应用源码目录 —— 工具包目录形态为
> `outputs/<application-id>/`；插件安装形态为当前工作区中生成该应用的目录。

## 0. 前置条件（缺一即停）

- `<应用目录>` 已生成且通过本地检查（使用者已收到并确认 `本地预览.html` —— 它渲染的
  就是本次要推送的 `files`；有 Node 环境时 `pnpm check` 仅为可选增强）；
- 使用者明确说了要发布（"推上去 / 发布 / 生成链接"），不得自行进入本阶段。

不需要额外确认使用者角色——明确要求发布本身就是授权；也**不要向使用者索要演示站地址**，
地址已内置（见下）。整个联动使用者只需提供一样东西：12 位验证码。

## 1. 演示站地址（内置，勿询问使用者）

演示站地址内置为 `http://192.168.130.41:92`。仅当本地配置文件里存在 `server` 字段时
用其覆盖（管理员场景），否则一律用内置地址，不得向使用者询问。

## 2. 验证码

- 先查本地配置 `~/.moheng-appfactory/config`（Windows：`%USERPROFILE%\.moheng-appfactory\config`，
  JSON：`{ "code": "XXXXXXXXXXXX", "deviceId": "dev_..." }`，`server` 字段可选）：有码则复用，
  **不再向使用者要任何信息**；
- 无码时向使用者索要，并说明：**验证码由平台管理员发放，12 位，长期有效，
  推送与「版本记录」查询共用同一个码**；拿到后写入上述配置文件（合并写入，保留已有字段）；
- 服务端返回 401（错码/已吊销）或 429（限速）时**如实报错并停止**，请使用者联系管理员；
  禁止更换字符重试。

## 2.1 本机标识 deviceId（随推送发送，必须先告知）

推送时附带一个本机标识 `deviceId`，供服务端区分同一验证码下的不同机器（多机推送排查、
异常推送定位）。**它必须被告知，不得静默生成或静默发送。**

- 取值：读本地配置 `~/.moheng-appfactory/config` 的 `deviceId`；没有则现场生成
  `dev_` + 无连字符随机 UUID（PowerShell：`"dev_" + [guid]::NewGuid().ToString('N')`；
  bash：`echo "dev_$(uuidgen | tr -d '-' | tr 'A-Z' 'a-z')"`），合并写回配置（保留 `code`/`server`）；
- **只允许随机生成**：禁止从 MAC 地址、磁盘序列号、主机名、用户名、系统路径或任何硬件/账户
  信息派生，也禁止采集这些信息本身。它是一次性随机串，与本机软硬件和使用者身份无关；
- 首次生成时在推送说明里用一句话告知使用者，例如：
  > 本次推送会附带本机标识 `dev_xxxxxxxx`（随机生成、不含任何硬件或个人信息，已存于
  > `%USERPROFILE%\.moheng-appfactory\config`），服务端用它区分同一验证码下的不同机器。
- 使用者询问时**如实说明它的值、位置和用途**，不得否认、不得用模糊话术回避；使用者要求
  不发送或要求删除时，照办——删掉配置里的 `deviceId` 字段并去掉请求头照常推送，不得反复劝说。

## 3. 推送预检：先分清「更新已有应用」还是「新增应用」（必做，禁止跳过）

拿到验证码后、组包之前，必须先拉取该码名下已有应用清单：

```bat
curl.exe -sS "<演示站>/api/preview/apps" -H "x-gate-code: <12位验证码>"
```

返回 `{ "issuedTo": "...", "apps": [{ "id", "label", "latestVersion", "status", "updatedAt", "expiresAt" }] }`。据此确定本次意图与 `mode`：

- 使用者要**更新**某个已有应用（"改一下上次那个 / 更新 XX"）：payload 的 `appId` 必须取清单中该应用的 `id`（即使本地目录名不同也以清单为准），`mode` 填 `"update"`；推送前告知使用者「将把“<label>”从 v<N> 更新到 v<N+1>，链接与入口卡片不变」。
- 使用者要**新增**应用：`appId` 不得与清单中任何 `id` 相同（重名时换一个 application-id），`mode` 填 `"create"`；告知将新上架一个应用（占用一个在线应用配额名额）。
- **意图不明**（例如清单里已有同名/同 id 应用，但使用者只说了"发布"）：停下来问一句——「演示环境已有“<label>”（当前 v<N>）。本次是**更新它**，还是**作为新应用上架**？」按回答定 `mode`，不得替使用者猜。
- 清单接口 401/429/503 按 §7 失败表处置；网络异常时不得盲推，如实说明后停止。

服务端会按 `mode` 强校验：`create` 撞已有 id → 409，`update` 找不到应用 → 404。收到这两个错误说明预检判断有误——回到本节重新确认，禁止删掉 `mode` 字段绕过校验。

## 4. 组装推送载荷 payload.json

由 agent 逐文件读取 `<应用目录>` 并写出 `payload.json`（勿用脚本依赖 Node）：

```json
{
  "appId": "<application-id>",
  "mode": "create | update（按 §3 预检结论填，必填）",
  "manifest": {
    "label": "<应用中文名>",
    "desc": "<一句话定位>",
    "accent": "<品牌强调色，可选>",
    "icon": "<入口卡片图标，可选，取值见下>",
    "entry": "src/App.jsx",
    "expectedApis": [ { "method": "GET", "path": "/api/bff/...", "note": "<用途>" } ]
  },
  "files": { "src/App.jsx": "<文件内容>", "src/...": "..." }
}
```

规则：

- `files` 收录 `src/**` 全部源文件（.jsx/.js/.css），且必须与 `本地预览.html` 注入的
  `window.__APP_PAYLOAD__.files` **逐字节一致**（所见即所推红线：预览确认的就是这一份；
  若组包时发现不一致，回去重建预览并重新确认，禁止直接推送）；`public/basic-shell/` 图片
  资源不上传 —— 演示站渲染端只处理 js/jsx/css，图标走 lucide，必要图形用内联 SVG/data URI；
  引用了 `/basic-shell/...` 图片的 `<img>` 需能容忍加载失败（模板已满足）；
- 入口 `src/App.jsx` 必须默认导出应用组件，并把收到的 `embedded` prop 透传给
  `BasicApplicationShell`（嵌入平台时隐藏顶部平台用户栏，见模板 embedded 说明）；
- `expectedApis` 来自生成阶段对本目录 `api-catalog.json` 的比对结果：清单里没有的
  数据需求全部记入（这份清单会随应用展示，作为给后端的接口需求）；
- **禁止**在 payload 中夹带任何试图放宽服务端校验的字段 —— 服务端会拒收并记安全事件；
- **图标**：`manifest.icon` 从白名单选（未填或未命中回退默认烧瓶图标）：
  `boxes` 资产 / `clipboard-list` 台账 / `file-text` 文档 / `bar-chart` 报表 /
  `building` 楼宇 / `landmark` 土地 / `wallet` 财务 / `shield-check` 监督 /
  `truck` 车辆 / `users` 人员 / `calendar-check` 日程 / `folder-kanban` 项目；
- **数据结合**：需要真实数据的数据块统一走模板成品件 `src/services/dataSource.jsx`
  （`useDataSource({ endpoint, mock })` + `<DataBadge source/>` 角标）。endpoint 必须命中
  本目录 `api-catalog.json`；能否真调由服务端决定（默认演示数据 —— 真实请求会被宿主拒绝
  并保持演示数据），需要开真实数据请联系平台管理员为该端点开通。

## 5. 推送命令

Windows（cmd / PowerShell 均可，Win10 1803+ 自带 curl.exe）：

```bat
curl.exe -sS -X POST "<演示站>/api/preview/apps" ^
  -H "x-gate-code: <12位验证码>" ^
  -H "x-device-id: <deviceId>" ^
  -H "content-type: application/json" ^
  --data-binary "@payload.json"
```

PowerShell 备选：

```powershell
Invoke-RestMethod -Method Post -Uri "<演示站>/api/preview/apps" `
  -Headers @{ 'x-gate-code' = '<12位验证码>'; 'x-device-id' = '<deviceId>' } `
  -ContentType 'application/json' -InFile payload.json
```

macOS / Linux 用 curl 同参数。`<演示站>` 取 §1 的内置地址（本地配置存在 `server` 字段时才覆盖）。

成功响应：

```json
{
  "id": "...", "version": 2, "status": "active",
  "url": "/preview/<id>", "expiresAt": "...",
  "limits": { "maxFiles": 40, "realData": false, "reviewRequired": false, "updatedAt": "2026-07-27" }
}
```

- `mode: "update"` 时版本号自动 +1，入口卡片与链接始终展示最新版本；`mode: "create"` 时 `version` 恒为 1；
- `status` 为 `pending` 时提示：本机需人工审核，管理员放行后上架。

## 5.1 回写生成上限（服务端下发，本地缓存）

响应里的 `limits` 是服务端针对「本验证码 + 本机 deviceId」配置的生成上限。收到后原样合并写入
`~/.moheng-appfactory/config` 的 `limits` 字段（保留 `code`/`deviceId`/`server`），供下次生成时本地读取：

```json
{ "code": "...", "deviceId": "dev_...", "limits": { "maxFiles": 40, "realData": false, "updatedAt": "2026-07-27" } }
```

规则：

- **只写不改**：原样落盘，禁止调高任何数值，也禁止在没收到 `limits` 时自己编一个；
- 响应没有 `limits` 字段时保留上一次的缓存值，缓存也没有就按默认档（见 SKILL.md「Generation limits」节）；
- 在 §6 交付里用一句话告知使用者本次下发的上限（例如「本机生成上限已更新为 40 个源文件」），
  使用者随时可以打开该配置文件自行查看；**不得隐瞒或含糊带过**。

## 6. 交付给产品经理

推送成功后输出（全部四项，缺一不可）：

0. **本次动作**：明确说是「新上架应用 v1」还是「更新“<label>”至 v<N>（覆盖旧版展示，历史版本留档可查）」；
1. **临时链接** `<演示站>/preview/<id>` 与有效期（默认 7 天，到期自动下架）；
   提示需用演示环境账号登录后访问，应用同时出现在左侧栏「应用入口」区；
2. **版本记录入口**：技术中心 → 设计资产 → 版本记录，输入同一个 12 位验证码可查看
   全部提交记录（应用/版本/时间/状态/链接）；
3. **接口需求清单**（manifest.expectedApis 内容），说明可转给后端评估。

响应带 `limits` 时另加一句：本机生成上限已更新为 <maxFiles> 个源文件（下次生成生效，
存于 `%USERPROFILE%\.moheng-appfactory\config`，由平台管理员按验证码配置）。

## 7. 失败对照表

| 响应 | 含义 | 处置 |
|---|---|---|
| 400 `field not allowed` | 载荷带了试图放宽校验的字段 | 删除该字段重新组包 |
| 400 `invalid mode` | `mode` 不是 create/update | 回 §3 预检，按结论填写 |
| 400 `illegal file path` / `entry file missing` | 文件路径越界或入口缺失 | 修正 outputs 结构 |
| 400 `too many files for generation scope` | 超出服务端文件数上限 | 精简文件，或请管理员为该验证码放宽上限 |
| 401 | 验证码错误或已吊销 | 停止，请产品经理联系管理员 |
| 404 `app not found for update` | 想更新但 appId 在演示环境不存在 | 回 §3 清单核对正确 id，或确认改为新增 |
| 409 `appId already exists` | 想新增但 id 撞了自己名下已有应用 | 换 application-id，或与使用者确认其实是更新 |
| 409 `appId owned by another code` | 应用 id 被他人占用 | 换一个 application-id |
| 413 | 载荷超体积上限 | 精简源码/演示数据 |
| 429 | 配额满或限速 | 提示配额（同码在线应用数上限）或稍后再试 |
| 503 | 门控服务不可用 | 停止，请管理员检查 app-gate |
