# 平台业务应用生成工具入口

本文件是本工具包中 Codex 的唯一工作入口。先执行角色门禁，再判断任务上下文，最后只加载一个负责应用壳层的本地 skill。不要要求使用者把 `skills/` 安装到全局目录。

## 1. 强制状态机

每个新任务严格按以下状态推进：

```text
role_unknown -> request_role_choice -> role_known -> inspect_request -> choose_one_skill -> execute -> verify [-> publish]
```

### 角色未知：选择角色

若当前对话尚未明确记录使用者角色，第一步必须只确认角色，不得附加业务分析、方案或下一步。

若当前 Codex 会话提供 `request_user_input`，必须调用一次单选确认：

```text
request_user_input({
  questions: [{
    id: "role",
    header: "使用角色",
    question: "请选择你当前使用此工具的角色。",
    options: [
      { label: "产品经理", description: "定义业务结构并确认 HTML 预览。" },
      { label: "设计师", description: "核对结构、证据与视觉规范。" },
      { label: "研发", description: "实施目标仓库、组件和数据接口。" },
      { label: "工具维护者", description: "维护规范、skill 和打包验证。" }
    ]
  }]
})
```

若当前表面未提供或不可用 `request_user_input`，第一条回复必须只包含下面的编号文本选择，不得附加解释、寒暄、方案或下一步：

> 请选择你当前使用此工具的角色：`1. 产品经理`、`2. 设计师`、`3. 研发`、`4. 工具维护者`。回复编号或角色名称。

无效、空白或“其他”回答不得按任务内容猜测角色，必须重新呈现同一选择。

在角色回答或确认前：

- 不得读取 `inputs/` 中的业务材料或分析业务需求；
- 不得选择、加载或执行任何 skill；
- 不得创建、修改或写入任何文件，也不得启动生成、安装、构建或测试；
- 不得用任务措辞猜测角色。

同一任务内角色已经明确时不重复询问；新任务或上下文无法确认角色时重新询问。

### 角色已知：调整沟通和交付

| 角色       | 默认工作方式                                                                     |
| ---------- | -------------------------------------------------------------------------------- |
| 产品经理   | 使用业务语言核对最小必要信息，隐藏无关代码细节，交付可运行应用、可直接打开的 `产品经理预览.html`、假设和差距清单。 |
| 设计师     | 优先核对结构、证据状态、Spec ID 和视觉验收，不把推断结果写成 `confirmed`。       |
| 研发       | 明确目标仓库、路由、组件 owner、数据接口、修改边界和验证命令。                   |
| 工具维护者 | 维护规范、两个 skill、版本和打包校验；默认不生成业务应用。                       |

角色只影响沟通方式，不直接决定使用哪个 skill。

## 2. 输入检查

角色确认后，读取用户点名的 `inputs/<application-id>.md` 或对话材料。只有在影响 skill 路由或无法实现核心流程时才追问，并一次只收集最少的缺失信息。

产品经理优先使用 `inputs/<application-id>-结构.md` 梳理应用结构；复杂需求可同时提供 `inputs/<application-id>.md` 完整需求合同。先以结构表确定 Module、Tab、页面和动作，再只追问影响路由或核心流程的缺口。产品经理的结构、稳定 ID 和输出路径均确认后，额外交付可双击打开的 `产品经理预览.html` 用于需求确认。

`application-id` 必须是单一路径段，格式为 `^[a-z0-9][a-z0-9-]{0,63}$`；禁止 `..`、斜杠、反斜杠、空白和绝对路径。读取输入或写入产物前，必须使用 `lstat` / `realpath` 确认 `inputs` 与 `outputs` 根是工具包内的真实目录、目标不是符号链接，并确认解析后的路径仍包含在对应根目录内。任一检查失败立即停止，不得跟随链接或改写管理区。

至少确认：

- 是接入现有平台仓库，还是生成全新的 standalone React/Vite 应用；
- 档位是 Basic、Pro 还是 Max；
- 是否存在 HTML、Figma、截图、旧系统或既有源码等迁移证据；
- 是否要求来源保真或高度定制；
- 稳定的 `application-id`、模块、Tab、页面、数据和验收范围。

业务空白不得擅自伪造为已确认事实。使用 `confirmed`、`target`、`inferred`、`gap`、`deferred` 标记证据状态。

## 3. 自动 skill 路由

每个目标应用必须选择一个且仅一个 shell owner。读取选中 skill 的 `SKILL.md` 全文，并按其中的引用规则继续读取必要资源；不要同时加载另一套壳层实现。

| 任务上下文                                                                                  | 唯一执行入口                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 全新 standalone React/Vite、明确为 Basic、标准运营型应用、目标是快速或 quick 生成可运行产物 | `skills/application-extension-template/SKILL.md` |
| 现有平台或 platform-integrated 接入                                                         | `skills/application-extension/SKILL.md`          |
| Pro / Max 任一档位                                                                          | `skills/application-extension/SKILL.md`          |
| HTML、Figma、截图、旧系统、既有源码迁移，或要求来源保真、高度定制/custom                    | `skills/application-extension/SKILL.md`          |

若信息不足以唯一选择，只追问会改变上述路由的最小问题。不得因为角色是产品经理就默认选择 template，也不得把 Pro 或 Max 降级成 Basic。

> 陌衡企信部署形态收敛：当目标是发布到陌衡企信演示环境时，只使用 Basic 档位与
> `application-extension-template` 路由；Pro / Max / 迁移路由在该形态下不触发。
> 生成页面的数据需求须对照 `assets/publish/api-catalog.json`：命中的端点记为真实接口，
> 未命中的记入 manifest `expectedApis[]`（作为给后端的接口需求清单随应用展示）。

壳层所有权规则：

- `application-extension-template` 只拥有全新 standalone Basic 的完整壳层。
- `application-extension` 负责复用现有平台壳层，或生成来源保真、Pro、Max、迁移和高度定制应用。
- 禁止在同一应用中复制 template 壳层后再生成第二套顶部用户栏、一级导航或 Module + Tab。

## 4. 执行与输出合同

每个新应用写入 `outputs/<application-id>/`。再次校验安全 ID 和路径 containment 后才能创建目标。目标目录已存在时默认不覆盖：继续迭代必须先读取现状并保留用户改动；新应用应使用新的稳定 ID。不得修改 `docs/`、`skills/`、`inputs/_模板/` 或根入口来绕过业务实现。

当已确认角色为产品经理，且已确认稳定 `application-id`、业务结构和安全输出路径时，除正式应用源码外还必须生成：

```text
outputs/<application-id>/产品经理预览.html
```

从工具包 `assets/product-manager-preview.html` 复制模板，只替换 `window.__PRODUCT_MANAGER_PREVIEW__` 中已有的结构数据：应用、Module、Tab、页面、字段、动作、流程、权限、状态和待确认项。保留未知内容为“待确认”，不得编造业务数据。随后运行：

```bash
node scripts/verify-product-manager-preview.mjs outputs/<application-id>/产品经理预览.html
```

该预览可直接通过 `file://` 打开，仅用于产品确认；它不是第二套业务壳层，不替代正式 React/Vite 应用，也不能替代正式应用的构建、运行或浏览器验收。设计师、研发和工具维护者不因角色自动生成这个文件。

所有业务应用必须包含：

1. 顶部平台用户栏；
2. 应用一级导航；
3. Module + Tab 应用二级导航，单模块或单页也不得省略；
4. 与页面类型匹配的数据更新/页面操作、查询操作和内容区域；
5. 需求声明的 Drawer、Dialog、Workflow、权限、异常和空状态。

桌面验证基线为 `1920 x 1080` CSS pixels。移动端、紧凑密度和大屏密度均为 `deferred`，不得从 Basic / Pro / Max 档位推导。

完成前至少交付：

- 可运行源码与启动说明；
- 业务假设和未决问题；
- 构建、测试和关键交互结果；
- 1920 x 1080 结构与视觉验证说明；
- 按五种证据状态整理的差距清单。

## 5. 工具维护者流程

工具维护者默认不生成应用。先确认要更新的 canonical 规范或 skill，再同步版本、Spec ID 和证据台账，并由源仓库的打包器重建本目录。重建后运行：

```bash
node scripts/doctor.mjs
```

不要只修改桌面成品而不回写 canonical 来源。`doctor` 失败时先修复报告的缺失、版本或完整性问题，再交付工具包。

## 6. 发布到陌衡企信演示环境（publish 阶段）

`verify` 完成后，仅当同时满足以下条件才进入 `publish`：角色=产品经理、目标
`outputs/<application-id>` 已通过本地检查（`产品经理预览.html` 结构确认，或有 Node 时
`pnpm check` 通过）、且产品经理**明确要求发布**。不满足任一条件时不得推送，也不得
主动替产品经理决定发布。

进入 publish 后，读取并严格执行 `assets/publish/PUSH.md`（唯一执行依据）：
验证码获取与本地保存、payload.json 组装规则、curl / Invoke-RestMethod 命令模板、
成功后必须交付的三件套（临时链接+有效期 / 版本记录入口 / 接口需求清单）、失败对照表。

安全红线：验证码由平台管理员按人发放（12 位，长期有效，推送与版本记录查询共用）；
401/429 时如实报错停止，禁止更换字符重试；payload 不得包含 `policy`/`policyId`/
`strength` 等策略覆盖字段；发布产物是演示应用，不承诺生产可用。
