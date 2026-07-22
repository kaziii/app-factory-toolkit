# 状态、交互与 Overlay 规范

> 规范版本：v1.3
> 适用基线：1920 × 1080 桌面视口
> 本分册职责：定义全局交互状态、键盘行为、可访问性、反馈、Detail Drawer、Form Dialog、应用全局面板和 Workflow Overlay。

## 1. 证据口径

状态以 shadcn/Radix 生产组件、应用共享原语、现有合同测试和已登记截图为证据。截图没有覆盖的 disabled、loading、error、permission、focus trap 和未保存变更状态只能标为 `inferred` 或 `gap`。本版不建立触摸和移动端手势规则。

## 2. 章节目录

1. 通用状态矩阵
2. 键盘和焦点
3. Loading、Empty、Error、Permission
4. Detail Drawer
5. Form Dialog
6. Application Global Panel
7. Workflow Overlay
8. 反馈、危险动作和数据一致性
9. 档位差异、实现映射和验收

## 3. 通用状态矩阵

| 状态 | 视觉 | 行为 | 可访问性 |
| --- | --- | --- | --- |
| default | 使用所属层 Text/Surface/Border | 可操作但不抢占注意力 | 语义、名称、value 完整 |
| hover | 8% 弱叠层或细边界 | 不改变元素尺寸和布局 | 不作为唯一提示 |
| focus-visible | 明确 ring/边界，避免厚重色块 | 键盘导航时出现 | 对比度达到 WCAG AA |
| active/selected | Accent 弱底、文本或细指示 | 与受控 state/route 一致 | aria-current/selected/pressed 匹配 |
| open | Trigger 和浮层状态同步 | Escape、外部点击按合同关闭 | aria-expanded、controls 可解析 |
| disabled | 弱化但仍可识别 | 不响应点击和快捷键 | disabled/aria-disabled 正确 |
| loading | 控件几何不变，显示进度 | 防止重复提交 | aria-busy，必要时 live region |
| success | 简短确认并更新数据 | 返回可继续操作状态 | 非颜色提示 |
| error | 就近错误与恢复动作 | 不丢失用户输入和上下文 | 错误与字段/区域关联 |

导航 active、Tabs selected、Checkbox checked、Menu open 和异步 loading 是不同状态，不得共用一个模糊布尔值。

## 4. 键盘和焦点

### 4.1 基础顺序

Tab 顺序遵循视觉和任务顺序：顶部栏 → 应用一级动作 → Module/Tab → 页面动作 → 查询 → 内容 → 分页。固定壳层不得通过正 tabindex 抢占顺序。

### 4.2 组件键盘合同

| 组件 | 必需键盘行为 |
| --- | --- |
| Button/Icon Button | Enter、Space 触发；focus-visible 可见 |
| Menu/Popover | Trigger 打开；方向键移动；Enter/Space 选择；Escape 关闭 |
| Tabs | 左右方向键、Home、End；选中与 tabpanel 关联 |
| Checkbox | Space 切换；部分选中可被读出 |
| Table Row | 行不是默认 button；只有明确 row-detail 合同时 Enter 打开 |
| Drawer/Dialog | 打开后焦点进入；焦点陷阱；Escape 按合同关闭；关闭后返回 Trigger |

### 4.3 焦点恢复

关闭 Popover、Drawer、Dialog 或 Workflow 后，焦点返回触发该状态的控件。若原控件已因数据更新消失，返回最近的稳定上级动作或页面标题，不得落到 `body`。

## 5. Loading、Empty、Error、Permission

### 5.1 Loading

- 首次加载：在内容结构内使用稳定骨架，不重排固定壳层。
- 局部刷新：保留现有数据，更新时间/刷新控件显示忙碌状态。
- 提交：保持按钮宽度，禁用重复提交，说明当前动作。
- 长操作：提供进度或阶段说明，不使用无限动画替代状态。

### 5.2 Empty

| 类型 | 文案与动作 |
| --- | --- |
| 初始无数据 | 说明当前业务暂无记录，可提供有权限的创建动作 |
| 查询无结果 | 说明筛选/搜索无匹配，提供清空或修改条件 |
| 权限为空 | 说明无访问权限或数据范围为空，不显示误导性创建动作 |
| 功能未配置 | 说明依赖配置和负责入口，不能伪装成加载失败 |

Empty 占据内容区而非整个应用视口；顶部壳、页面上下文和可恢复查询条件保持可见。

### 5.3 Error

错误必须区分网络、权限、校验、冲突、服务端和 Embedded 加载失败。提供重试、返回、保留草稿或联系 owner 中真正可执行的动作。错误不能只用 Toast；影响整个内容区时需要持久错误面。

### 5.4 Permission

菜单、按钮、字段和数据范围均由权限事实决定。隐藏用于不可发现能力，disabled 用于解释当前条件不满足；危险或敏感动作必须在服务端再次校验。直接链接和刷新不能绕过档位与权限。

## 6. Detail Drawer

### 6.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `OVERLAY.DETAIL_DRAWER` |
| 目的 / 所有者 | 保留列表上下文查看和处理记录详情；Overlay / shared application UI + feature content |
| Anatomy | Overlay、Drawer、Header、Title/Subtitle、Actions、可选 Tabs、Body、Sections |
| 尺寸 / 定位 / 滚动 | 右侧 body portal；1280px、最大 `100vw - 64px`、全高；Body 独立滚动 |
| 字体 / 色彩 / 间距 | 标题 20/28、正文 14/20；应用 Token；12px padding/gap |
| 圆角 / 阴影 / z-index / motion | 外圆角 0、无浮动卡阴影；z-index 130+；右侧进入并尊重 reduced-motion |
| 动作 | 主/次详情动作、Tab、关闭和业务处理 |
| 状态 / 键盘 / 可访问性 | open/loading/error/unsaved；焦点陷阱、Escape、Tabs 键盘、焦点恢复、aria-modal |
| 档位差异 | 三档一致；Max 治理不改变业务详情结构 |
| 实现组件 | `ApplicationDetailDrawer`、Tabs、`SystemButton` |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | 焦点陷阱/恢复和未保存保护尚未统一 |
| 验收 | 1920 × 1080 检查 1280px、遮罩、单滚动、键盘、焦点和关闭保护 |

### 6.2 目的、所有者和 Anatomy

- 目的：在保留列表与查询上下文的情况下查看和处理记录详情。
- 所有者：Overlay；业务应用提供数据、Tabs、内容和动作。
- Anatomy：Overlay、Drawer、Header、Title/Subtitle、Actions、可选 Tabs、Scrollable Body、Sections。

### 6.3 尺寸、定位和滚动

| 项目 | 规范 |
| --- | --- |
| 定位 | body portal，右对齐，full viewport |
| 默认宽度 | 1280px |
| 最大宽度 | `calc(100vw - 64px)` |
| 高度 | 100% |
| z-index | 130 或统一 Overlay plane 更高层级 |
| padding / gap | 12px |
| 外圆角 | 0 |
| Header | 最小 32px，底部 12px padding + 分隔线 |
| Body | 独立纵向滚动，Sections 间距 12px |

Header 标题使用 20/28px、700；Subtitle 只放简短身份摘要，完整业务字段进入内容区。Header actions 使用 32px 控件，首个主动作使用 Accent，其余使用 Secondary。

### 6.4 Tabs 和状态

Tabs 是条件元素；空数组时不渲染 tablist 或空轨道。打开时设置 `aria-modal`/dialog 语义；遮罩点击是否关闭由业务风险决定；编辑中或有未保存变更时先确认。

### 6.5 当前差距

现有 Drawer 已支持遮罩、Escape 和 Tabs 键盘，但焦点陷阱、关闭后焦点恢复、未保存变更保护在不同业务应用中尚未统一，证据状态为 `gap`。

## 7. Form Dialog

### 7.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `OVERLAY.FORM_DIALOG` |
| 目的 / 所有者 | 承载新建、编辑和短流程表单；Overlay / shared application UI + feature form |
| Anatomy | Overlay、Header、Title/Description、Fields、Validation、Footer Actions |
| 尺寸 / 定位 / 滚动 | 居中 body portal；最大 720px；长表单 Body 内部滚动 |
| 字体 / 色彩 / 间距 | 标题 20/28、字段 14/20、辅助 12/16；应用 Token；12/16px 间距 |
| 圆角 / 阴影 / z-index / motion | 20px、标准模态阴影、z-index 130+；淡入缩放且 reduced-motion 可取消 |
| 动作 | Cancel、Submit、Close 和表单业务动作 |
| 状态 / 键盘 / 可访问性 | default/dirty/validating/loading/error/success；焦点陷阱、字段关联、Escape、焦点恢复 |
| 档位差异 | Basic/Pro/Max 完全一致 |
| 实现组件 | `ApplicationFormDialog`、Radix Dialog、Schema fields、`SystemButton` |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | 未保存保护跨应用一致性尚未完成 |
| 验收 | 1920 × 1080 检查最大 720px、字段/错误关系、提交防重和焦点恢复 |

### 7.2 Anatomy 与几何

| 项目 | 规范 |
| --- | --- |
| 定位 | 居中 body portal |
| 最大宽度 | 720px，且不超过视口减 32px |
| 圆角 | 20px |
| Header | 20/28px 标题；说明仅在真实存在时显示 |
| Body | 表单字段、校验和业务提示 |
| Footer | 稳定动作区，基准高 64px |

### 7.3 表单行为

- 新建、编辑、发起使用 Dialog；需要跨步骤、长内容或审批轨迹时升级为 Workflow。
- Label、required、帮助文本和错误关系明确；错误出现不改变字段顺序。
- Cancel 关闭前处理未保存变更；Submit loading 期间防止重复提交。
- 成功后更新列表、指标和更新时间，焦点返回稳定上下文。
- 服务端错误保留输入，不把业务校验全部变成 Toast。

## 8. Application Global Panel

### 8.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `OVERLAY.GLOBAL_PANEL` |
| 目的 / 所有者 | 在应用一级导航内展示总览、风险、消息、待办；Application Overlay / feature owner |
| Anatomy | Trigger、Panel Header、Metrics、Lists/Sections、Actions |
| 尺寸 / 定位 / 滚动 | 锚定一级动作；宽 520–580px；最大高 680px；Panel 内部滚动 |
| 字体 / 色彩 / 间距 | 应用 Meta/Body/Heading；应用 Token；8/12/16px 间距 |
| 圆角 / 阴影 / z-index / motion | 20px、标准大浮层阴影、Popover 层级；120–200ms 打开关闭 |
| 动作 | Panel 切换、列表进入、业务快捷动作和关闭 |
| 状态 / 键盘 / 可访问性 | default/open/loading/empty/error；Trigger aria-expanded、菜单键盘、Escape、焦点恢复 |
| 档位差异 | 三档应用结构一致；平台功能不得进入本 Panel |
| 实现组件 | `ApplicationGlobalActionPanel`、Popover、Metric/List 子组件 |
| 证据状态 | `overall=confirmed; geometry=confirmed; behavior=confirmed` |
| 当前差距 | 核心 Panel 已确认；业务内容按应用证据单独负责 |
| 验收 | 1920 × 1080 检查 520–580px、单 Panel、route 清理、键盘和滚动 |

### 8.2 目的和边界

应用运行总览、风险预警、消息和待办可以在一级导航锚定受控 Panel；设置不与 Panel state 混用。平台功能和 Max 后代页面不得塞入应用 Panel。

### 8.3 几何和状态

| 项目 | 规范 |
| --- | --- |
| 宽度 | `clamp(520px, 42vw, 580px)` |
| 最大宽度 | `calc(100vw - 32px)` |
| 最大高度 | `min(680px, calc(100vh - 120px))` |
| 圆角 | 20px |
| 滚动 | Panel 内部纵向滚动 |
| Metrics | 四等列，8px gap，卡片最小高 86px |

Panel Trigger 保持受控；同一时刻只展开一个应用全局 Panel；切换 route、应用、Module、关闭导航或按 Escape 时清理 open state。

## 9. Workflow Overlay

### 9.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `OVERLAY.WORKFLOW` |
| 目的 / 所有者 | 承载审批、多步骤、批处理确认和审计流程；Overlay / 业务流程 owner |
| Anatomy | Steps、Current State、Business Content、Audit Context、Stable Footer、Close/Back |
| 尺寸 / 定位 / 滚动 | 由获批流程来源决定；body portal 或独立 route；流程主体为单滚动 owner |
| 字体 / 色彩 / 间距 | 复用应用 Foundations；业务状态色必须有文本/图标；12px 基础节奏 |
| 圆角 / 阴影 / z-index / motion | 由 Dialog/Drawer 宿主决定；统一 Overlay z-index；步骤切换尊重 reduced-motion |
| 动作 | 草稿、提交、撤回、驳回、确认、返回和关闭 |
| 状态 / 键盘 / 可访问性 | draft/loading/conflict/error/success/unsaved；完整键盘、焦点、步骤和错误宣告 |
| 档位差异 | 三档业务流程完整度一致；Max 仅增加治理和审计入口 |
| 实现组件 | 具体业务 Workflow + shared Dialog/Drawer/SystemButton primitives |
| 证据状态 | `overall=inferred; geometry=inferred; behavior=inferred` |
| 当前差距 | 通用几何和完整行为没有统一获批视觉，需逐业务 Review |
| 验收 | 1920 × 1080 检查单滚动、步骤/审计、未保存保护、直链恢复和键盘 |

Workflow 用于审批、发起、批处理确认、跨步骤编辑或需要审计轨迹的操作。其尺寸由流程内容决定，但必须遵守：

1. 清晰的步骤、当前状态、责任人和后续动作。
2. 单一主滚动 owner，Footer 动作稳定可达。
3. 保存草稿、提交、撤回、驳回等动作具有业务确认边界。
4. 关闭/返回处理未保存数据，刷新和直接链接可恢复必要上下文。
5. 流程输出记录来源、时间、执行者和审计标识。

由于当前没有覆盖所有流程形态的获批视觉基线，通用 Workflow 几何保持 `inferred`；具体业务必须在来源评审后转为 `confirmed`。

## 10. 反馈、危险动作和数据一致性

### 10.1 反馈层级

| 场景 | 反馈 |
| --- | --- |
| 即时轻量成功 | Toast + 数据更新 |
| 字段校验 | 字段就近错误 |
| 区域加载失败 | 内容区错误面 + Retry |
| 全页不可用 | 应用壳内错误页，提供返回和重试 |
| 删除/高风险提交 | Dialog 确认，说明对象与影响 |

### 10.2 数据一致性

成功动作必须同步受影响的记录、指标、分页、选择和更新时间。失败动作不得清空用户选择或输入。乐观更新必须能在失败时回滚并解释结果。

## 11. 档位差异和实现映射

Basic、Pro、Max 使用同一状态集合、键盘合同和 Overlay。Pro 知识增强结果必须标明来源、确认边界和可执行动作；Max 平台治理不会降低业务应用 Overlay 的字段、权限或审计要求。

实现组件：`ApplicationDetailDrawer`、`ApplicationFormDialog`、Radix Dialog/Dropdown/Popover/Tabs、`ApplicationGlobalActionPanel`、应用设置 Sheet、`SystemButton`。

## 12. 验收

在 1920 × 1080 分别验证正常、键盘、加载、空、错误、权限和危险动作场景：

1. default/hover/focus/active/disabled 不改变固定几何。
2. Popover/Menu/Tabs/Checkbox/Dialog/Drawer 的键盘合同和 aria 状态正确。
3. Drawer 为 1280px、Dialog 最大 720px、Global Panel 为 520–580px；仅内部内容滚动。
4. 打开 Overlay 后焦点进入，关闭后焦点恢复；背景不可误操作。
5. 异步成功或失败后，记录、指标、分页、选择和更新时间保持一致。
6. 未有获批视觉证据的状态明确标为 `inferred` 或 `gap`，不宣称 100% 还原。
