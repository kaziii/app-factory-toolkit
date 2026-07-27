# 平台建设 UI 规范

> 版本：v1.3
> 日期：2026-07-15
> 范围：平台 PC 端、平台功能、业务应用
> 桌面基线：1920 × 1080
> 状态：持续维护

## 1. 文档治理

本文档是“平台建设 UI 规范”的唯一产品总纲，规定产品档位、系统所有权、固定层级、核心元素、页面模式、证据口径和验收门禁。详细视觉值、交互状态和组件契约按专题分册维护，避免总纲变成无法持续更新的单体长文档。

| 知识层 | 唯一职责 | 事实源 |
| --- | --- | --- |
| 产品总纲 | 档位、所有权、结构、术语、元素索引、验收 | 本文档 |
| 专题规范 | Tokens、壳层、页面、状态、视觉证据 | `docs/design-system/` |
| 执行知识 | Codex 如何生成和验证业务应用 | `application-extension-template` skill（`skills/application-extension-template/`） |
| 组件目录 | 当前生产组件、Props、状态、Token、来源和测试 | `apps/web/src/features/ui-component-center/` |
| 实现事实 | 当前路由、样式、组件、测试及已知差距 | 仓库源码与测试 |

专题分册：

- [Foundations](design-system/01-foundations.md)
- [壳层与导航](design-system/02-shell-navigation.md)
- [应用页面模式](design-system/03-application-page-patterns.md)
- [状态与交互](design-system/04-states-interactions.md)
- [证据与验收](design-system/05-evidence-acceptance.md)

维护顺序固定为：产品决策更新总纲，稳定规则进入专题分册，生产组件映射到 Spec ID，执行规则同步到 skill，最后由测试和截图验收。当前代码与目标不一致时登记为实现差距，不得用现状反向修改产品口径。

### 1.1 证据状态

| 状态 | 含义 | 使用规则 |
| --- | --- | --- |
| `confirmed` | 已有获批文字、截图或稳定实现共同支持 | 可作为正式设计与生成基线 |
| `target` | 产品已确认但当前实现尚未完成 | 进入实现待办，不冒充现状 |
| `inferred` | 依据相邻规则推导，尚无完整视觉证据 | 必须等待产品确认后转正 |
| `gap` | 目标与当前实现存在可定位冲突 | 同时记录目标、现状和修复入口 |
| `deferred` | 已明确延期或不在当前版本范围 | 不得阻塞当前桌面版本交付 |

同一规则必须记录来源路径、来源版本、适用档位、视口、交互状态和最后确认日期。截图可见范围以外的 hover、disabled、empty、permission 或移动端状态不得标为 `confirmed`。

## 2. 术语与双轴模型

产品档位轴包含 Basic、Pro、Max，表达累计能力；视口轴包含桌面、移动、紧凑、大屏，表达设备或密度。两轴互相独立，不互相推导：Pro 不是“精简版”，Max 不是“大屏版”。本版只建立 1920 × 1080 桌面基准，不定义移动端结构、断点或验收；紧凑和大屏密度也不由产品档位推导。

| 术语 | 正式定义 | 禁止混用 |
| --- | --- | --- |
| 顶部用户栏 | 公司身份、应用切换、用户入口的全局平台层 | 业务应用标题栏 |
| 应用一级导航 | 横向的应用 Identity + Actions | 应用侧边栏 |
| 应用二级导航 | Module 切换器或静态 Module + 当前 Module Tabs | 页面标题重复区 |
| Max 平台左栏 | Max 独有的平台功能和完整应用目录 | Module 切换器、页面侧栏视图 |
| 页面操作 | 更新时间、刷新、新建、视图和更多动作 | 排序、筛选、搜索 |
| 查询操作 | 排序、快速筛选、搜索、高级筛选 | 新建、编辑、流程动作 |
| Overlay | Drawer、Dialog、全局面板、流程载体 | 常驻纵向页面层 |

源码兼容键 `proPlus` 只映射产品名 Max，不在产品文档中作为对外档位名。

## 3. 所有权与固定层级

全站使用四个所有权平面：Platform、Application Shell、Page、Overlay。筛选工具栏是 Page 内的功能区，不是独立所有权层；Overlay 脱离常驻纵向流。

```text
Platform Shell
├─ Top User Bar                                      52px，全宽固定
└─ Shell Body
   ├─ Max Platform Rail                              仅 Max，220px
   └─ Application Workspace
      ├─ Application Primary Navigation              72px
      ├─ Module + Tab Secondary Navigation           48px
      └─ Page Viewport
         ├─ Data Update + Page Actions               48px
         ├─ Metric Strip                             84px，可选
         ├─ Sort / Filter / Search Toolbar           32px，可选
         └─ Content Surface                          minmax(0, 1fr)
Overlay Plane
└─ Detail Drawer / Form Dialog / Global Panel / Workflow
```

三段业务应用壳总高固定为 `52 + 72 + 48 = 172px`。页面内容从 `y=172px` 开始，采用 12px 外边距和 12px 主间距。顶部三段由共享壳拥有，业务页面不得复制公司 Logo、应用切换、应用身份、Module 或 Tab。

滚动所有权：顶部三段固定；Max 左栏从顶部栏下方独立纵向滚动；Module 面板独立滚动；页面内容区是常态主滚动容器；Drawer body 可在遮罩层内独立滚动。一个页面区域不得出现两个竞争的纵向滚动 owner。

## 4. Basic / Pro / Max

```text
Max 能力集 > Pro 能力集 > Basic 能力集
```

| 维度 | Basic | Pro | Max |
| --- | --- | --- | --- |
| 顶部用户栏 | 公司、应用切换、用户 | 与 Basic 相同 | 与 Basic/Pro 相同 |
| 应用壳 | 52 + 72 + 48 | DOM、尺寸、宽度完全相同 | 主区继续使用同一应用壳 |
| 知识能力 | 基础 | 只增强知识能力 | 完整包含 Pro |
| 平台左栏 | 无 | 无 | 有，默认 220px |
| 应用入口 | 顶部应用切换 | 与 Basic 相同 | 顶部切换 + 左栏完整应用目录 |
| 用户能力 | 个人入口 | 与 Basic 相同 | 个人入口 + 用户中心治理能力 |
| 强视觉差异 | 无 | 不允许新增结构表达 | 仅平台左栏改变全局框架 |

硬约束：

1. Pro 不新增导航行、持久左栏、页面宽度规则或第二套应用壳。
2. Max 平台左栏不会替换应用一级、二级导航。
3. 三档都必须保留顶部应用切换器、应用一级导航和 Module + Tab。
4. 单模块显示静态 Module；单页面至少显示一个选中 Tab。
5. Platform、Account、Shortcut、Direct 启动均保持完整三段壳层。
6. 档位不代表业务交付完整度；字段、流程、权限、异常和测试完整度由 PRD 与发布标准决定。

## 5. 核心元素索引

| Spec ID | 元素与所有者 | 必选性 | 桌面几何 | 滚动 owner | overall | geometry | behavior | 实现映射与分册 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PLATFORM.TOP_USER_BAR` | 顶部用户栏 / Platform | 三档必选 | 高 52px，全宽固定 | 无 | `gap` | `confirmed` | `gap` | `TopNavigationPrimaryBar`；壳层分册 |
| `PLATFORM.MAX_RAIL` | Max 平台左栏 / Platform | 仅 Max | 220px，范围 180–260px，折叠 52px | 左栏 | `gap` | `confirmed` | `gap` | `Sidebar`；壳层分册 |
| `APPLICATION.PRIMARY_NAV` | 应用身份与动作 / Application Shell | 业务应用必选 | 高 72px，Logo 48px | 无 | `confirmed` | `confirmed` | `confirmed` | `TopNavigationSecondaryNav`；壳层分册 |
| `APPLICATION.SECONDARY_NAV` | Module + Tab / Application Shell | 必选，单页不省略 | 高 48px；Module 最小 168×40；Tab 高 32px | Tabs 横向、Module 面板纵向 | `gap` | `confirmed` | `gap` | `TopNavigationSecondaryNav`；壳层分册 |
| `PAGE.UPDATE_ACTION` | 更新时间与页面动作 / Page | 标准操作页必选 | 最小高 48px | 无 | `confirmed` | `confirmed` | `confirmed` | `ApplicationPageHeader`；页面分册 |
| `PAGE.METRIC_STRIP` | 页面指标 / Page | 有指标时使用 | 最小高 84px，最多六项 | 无 | `confirmed` | `confirmed` | `confirmed` | `ApplicationMetricStrip`；页面分册 |
| `PAGE.QUERY_TOOLBAR` | 排序筛选搜索 / Page | 有查询时使用 | 最小高 32px；搜索 300×32px | 菜单内部 | `confirmed` | `confirmed` | `confirmed` | `ApplicationQueryToolbar`；页面分册 |
| `PAGE.CONTENT_SURFACE` | 列表、侧栏、卡片、定制内容 / Page | 页面必选 | `minmax(0, 1fr)`，12px padding/gap | 内容区 | `gap` | `confirmed` | `gap` | 标准表格已确认，共享 Frame 和存量视图仍有差距；页面分册 |
| `OVERLAY.DETAIL_DRAWER` | 详情抽屉 / Overlay | 按流程使用 | 宽 1280px，最大 `100vw - 64px` | Drawer body | `gap` | `confirmed` | `gap` | 几何已确认，焦点与未保存保护待统一；状态分册 |
| `OVERLAY.FORM_DIALOG` | 新建编辑表单 / Overlay | 按流程使用 | 最大宽 720px | Dialog body | `gap` | `confirmed` | `gap` | 几何和基础表单已确认，未保存保护待统一；状态分册 |
| `OVERLAY.GLOBAL_PANEL` | 应用全局动作面板 / Overlay | 有全局动作时使用 | 宽 520–580px | 面板内部 | `confirmed` | `confirmed` | `confirmed` | `ApplicationGlobalActionPanel`；状态分册 |
| `OVERLAY.WORKFLOW` | 审批与流程载体 / Overlay | 有流程时使用 | 由流程内容决定，遵守单滚动 owner | 流程主体 | `inferred` | `inferred` | `inferred` | 业务流程组件；状态分册 |

元素进入正式组件库前必须完成统一模块合同：目的/所有者、Anatomy、尺寸/定位/滚动、字体/色彩/间距、动作、状态/键盘/可访问性、档位差异、实现组件、证据状态、当前差距和验收场景。

## 6. 业务应用与页面模式

### 6.1 外部装配和内部层级

```text
平台顶部层
→ 应用目录与启动上下文
→ Application Shell
→ 一级导航：Application Identity + Actions
→ 二级导航：Module + Tab
→ Page
→ Detail / Form / Workflow
```

```text
Application
├─ Identity + Application Actions
├─ Module
│  └─ Page / Tab
│     ├─ Update + Page Actions
│     ├─ Metrics（条件层）
│     ├─ Query Toolbar（条件层）
│     └─ Content Surface
└─ Application Settings
```

### 6.2 页面模式

| 页面模式 | 固定部分 | 条件部分 | 内容与滚动 |
| --- | --- | --- | --- |
| 标准记录页 | Update/Action + Content | Metrics、Query、批量、分页 | 表格为默认内容，内容区滚动 |
| 侧栏列表 | Update/Action + 左侧分组 + 主内容 | Metrics、Query | 左栏 360px，主内容独立布局 |
| 卡片看板 | Update/Action + Card Board | Metrics、Query、分页 | 默认五列，按内容声明最小宽度 |
| 定制工作台 | 完整三段应用壳 + 自有内容 | 标准页面原语按来源选用 | 保留来源结构，不强制表格化 |
| Embedded | 平台/应用壳 + Adapter | 页面工具栏按来源映射 | 优先由宿主页拥有唯一滚动 |

页面不得重复应用名称、Module 或已有 Tab。详情使用 Drawer；新建、编辑、发起使用 Dialog 或明确的 Workflow 载体。页面主动作与查询动作必须分行，行级动作和批量动作不得挤入顶部壳层。

## 7. Max 平台边界

Max 红框定义平台功能根节点及其所有后代，不只定义固定可见像素区域。

```text
Max Platform
├─ 顶部平台层
│  ├─ 公司身份
│  ├─ 应用切换
│  └─ 用户入口 → 用户中心与后台能力
├─ 左侧平台栏
│  ├─ 全部有权平台功能 → 后代页面
│  └─ 当前租户全部有权业务应用 → Application → Module → Page → Detail
└─ 主工作区
   ├─ 平台功能页面
   ├─ 业务应用页面
   └─ Embedded 页面
```

左栏至少覆盖智能助手、消息、通讯录、日程、文件中心、工具箱、数据看板、风险预警、任务督办、数据填报、后续注册的平台功能和当前租户完整业务应用集合。用户配置只改变置顶、排序和折叠，不得永久移除完整目录中的有权应用。

平台根入口至少登记 `id`、`routeRoot`、`contentType`、`governedBy`、`minTier`、`permissionKey`、`owner`。平台后代使用 `contentType = platform-function`；业务应用使用 `contentType = business-application`；Max 治理项使用 `governedBy = max-platform`。治理归属不会把业务应用内部页面改造成平台功能页面。

Max 用户中心的最小能力组包括组织人员、角色权限、账号映射、认证安全、接口同步、操作审计、订阅权益和平台偏好。

## 8. 产品经理快速定义

产品经理先区分内容类型，再定义治理归属和档位：

| 类型 | 使用条件 | 内部结构 |
| --- | --- | --- |
| Platform Function | 跨应用工具、治理、管理或能力中心 | Platform → Function → Page |
| Business Application | 独立业务域和业务流程 | Application → Module → Page → Detail |
| Embedded | 旧系统或迁移过渡 | Platform/Application Shell → Adapter |

最小 Brief：

| 项目 | 必填内容 |
| --- | --- |
| 名称 / 稳定 ID / owner | 产品、业务、UI、研发负责人 |
| 内容类型 / 治理归属 | `contentType`、`governedBy` |
| 产品档位 / 交付完整度 | Basic/Pro/Max 与基础接入/完整业务/平台集成分开填写 |
| 入口与 route root | 顶部、Max 左栏、应用内、直接链接 |
| 用户与权限 | 角色、组织、动作、字段、数据范围 |
| 信息结构 | 平台功能树或 Application/Module/Page |
| 页面合同 | 指标、字段、查询、动作、详情、表单、状态 |
| 数据与服务 | API、fixture、embedded、同步、失败恢复 |
| 审计与验收 | 主流程、异常流、权限流、直链、刷新恢复 |

业务应用模块表统一记录 `Module / Page(Tab) / routeKey / 默认页 / 角色 / 页面模式 / 主动作 / 详情或流程`。平台功能表统一记录 `根入口 / 后代页面 / minTier / 权限键 / 数据范围 / 后台服务 / 审计`。

## 9. 建设阶段与时间框架

以下为单一主要维护者的净工作量，不含产品评审等待；每阶段可以独立发布和使用。

| 阶段 | 净工作量 | 交付与退出条件 |
| --- | ---: | --- |
| P1 架构基线 | 1 天 | 总纲、双轴、三档、元素索引、差距登记通过合同测试 |
| P2 Foundations | 1.5 天 | 字体、颜色、间距、圆角、阴影、层级、动效及来源完整 |
| P3 壳层导航 | 2 天 | 顶部栏、Max 左栏、一级导航、Module/Tab 逐模块验收 |
| P4 页面与内容 | 2.5 天 | 更新、指标、查询、列表、侧栏、卡片、批量和分页完整 |
| P5 Overlay 与状态 | 1.5 天 | Drawer、Dialog、状态集、键盘和可访问性完整 |
| P6 运行化与验收 | 1.5 天 | 组件映射、skill 同步、截图台账和维护门禁通过 |

总净工作量约 10 天。总纲保持 v1.x 草案迭代；全部分册获批并成为组件发布门禁后再升级为 v2.0。

## 10. 当前实现差距

| 差距 | 目标 | 当前事实 | 后续实现入口 |
| --- | --- | --- | --- |
| Pro/Max 应用切换 | 三档均保留顶部应用切换 | 当前升级后隐藏 | `TopNavigationPrimaryBar.jsx` |
| Shortcut 二级导航 | 所有启动来源保留 Module + Tab | 仍支持 `hideSecondaryTabs` 和 title-only | `TopNavigation.jsx`、`appShellModel.js` |
| Max 完整应用目录 | 展示当前租户全部有权应用 | 当前主要是可配置快捷入口 | `Sidebar.jsx`、应用目录数据 |
| 页面框架 | 共享 48/84/32/1fr 节奏 | 仍由 feature CSS 分别持有 | 后续共享 `ApplicationPageFrame` |
| Overlay 可访问性 | 完整焦点陷阱、恢复和未保存保护 | 部分能力尚未统一 | 应用 Overlay primitives |
| 视觉证据 | Basic/Pro/Max 关键状态均有基线 | Pro/Max 状态截图不完整 | 证据台账与产品 Review Gate |

这些差距不在本轮文档任务中修改业务行为。

## 11. 验收与维护

结构验收：

1. 三档业务应用都显示顶部用户栏、应用一级导航和 Module + Tab。
2. Pro 与 Basic 的 DOM 地标、几何和内容宽度一致；Max 只由平台左栏改变横向框架。
3. 标准操作页的页面动作与查询动作分行，条件层无数据时不渲染空占位。
4. 内容区、Module 面板、Max 左栏和 Overlay 各自只有明确的滚动 owner。
5. 单模块、单页面、Shortcut 和 Direct 启动不产生 title-only 应用壳。

视觉验收只针对已登记的 `(source version, screenshot ID, viewport, route, tier, fixture, state, browser/font)`。截图可见元素和动作必须完整盘点；结构和顺序必须通过合同测试；CSS 数值用 computed style 验证，几何允许 1px 渲染误差；动态数据和字体抗锯齿区域可设 mask；缺失状态只能登记为 `inferred` 或 `gap`。

文档阶段运行 Markdown 链接、Spec ID 唯一性、字段完整性和 `git diff --check`；组件元数据阶段运行定向组件中心测试、lint、typecheck、test 和 build。仅 Reviewed 来源可以进入正式规则。

版本规则：兼容性变化升主版本，新增稳定规则升次版本，文字澄清升修订版本。每次变更记录 owner、证据、影响的 Spec、组件同步状态和 skill 同步版本。

### 11.1 变更日志

| 版本 | 日期 | 变更 |
| --- | --- | --- |
| v1.3 | 2026-07-15 | 建立总纲加分册体系、双轴模型、四所有权平面、核心元素索引、时间框架、证据状态和持续验收门禁 |
| v1.2 | 2026-07-15 | 业务应用强制包含顶部用户栏、一级导航、二级 Module + Tab，取消单页和 Shortcut 的隐藏例外 |
| v1.1 | 2026-07-15 | 确认累计档位、Pro 只增强知识能力、Max 平台边界和用户中心能力 |
| v1.0 | 2026-07-15 | 建立三档、Max 层级和业务应用结构首版 |
