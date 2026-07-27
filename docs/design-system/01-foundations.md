# Foundations：基础视觉与布局令牌

> 规范版本：v1.3
> 适用基线：1920 × 1080 桌面视口
> 本分册职责：定义平台层和应用层共享的字体、色彩、间距、圆角、阴影、z-index、motion 与固定几何，不定义具体业务页面内容。

## 1. 证据口径

本分册以 `apps/web/index.css` 的公开语义 Token、`apps/web/styles/00-base.css` 的壳层变量、生产组件 CSS Module 和已审阅截图为证据。CSS 当前值只在与产品规则一致时标为 `confirmed`；产品已确认但源码未满足时标为 `target` 或 `gap`；截图未覆盖的状态标为 `inferred`。本版不建立移动端规则。

证据优先级：获批产品规则决定结构和所有权；获批截图决定可见视觉；源码和 computed style 证明当前实现；`application-extension-template` 是执行镜像，不独立发明产品规则。

## 2. 章节目录

1. 规范合同
2. 作用域和 Token 分层
3. 字体
4. 色彩
5. 间距与固定几何
6. 圆角和阴影
7. z-index 与 Overlay
8. motion
9. 状态、键盘和可访问性
10. 档位差异、实现组件、当前差距与验收

## 3. 统一模块规范合同

所有后续模块必须按同一合同记录，字段不得用自由叙述替代。

| 字段 | 要求 |
| --- | --- |
| Spec ID | 稳定、唯一、使用 `LAYER.ELEMENT` 命名；兼容性变化才允许替换 |
| 目的 / 所有者 | 说明用户任务、Platform/Application/Page/Overlay 所有权及维护 owner |
| Anatomy | 列出可见子元素、插槽、必选和条件元素 |
| 尺寸 / 定位 / 滚动 | 给出 px、min/max、自适应、fixed/sticky、滚动 owner |
| 字体 / 色彩 / 间距 | 只引用公开 Token 或明确的已确认固定值 |
| 圆角 / 阴影 / z-index / motion | 说明层级、进入退出和 reduced-motion 行为 |
| 动作 | 区分应用动作、页面动作、查询动作、行级和批量动作 |
| 状态 / 键盘 / 可访问性 | 覆盖 default、hover、focus、active、disabled 及语义标签 |
| 档位差异 | 分别记录 Basic、Pro、Max；设备适配另列 |
| 实现组件 | 指向生产 export、源码、样式和测试，不复制实现代码 |
| 证据状态 | 使用 `confirmed / target / inferred / gap / deferred` |
| 当前差距 | 同时写目标、当前事实、影响和后续入口 |
| 验收 | 写明视口、route、fixture、状态、几何容差和检查方法 |

## 4. 作用域和 Token 分层

### 4.1 平台层

`--platform-*` 服务公司品牌、顶部用户栏、Max 平台左栏和平台功能页面。应用主题不得覆盖平台层语义。

### 4.2 应用层

`--application-*` 只在 `[data-ui-layer='application']` 或 `[data-application-theme]` 内公开。应用只能通过 `--application-local-*` 做受控覆盖，不能复制基础变量或修改平台壳。

### 4.3 兼容层

`--background`、`--foreground`、`--border`、`--radius` 等 shadcn/legacy 变量继续作为兼容输入。新业务组件优先消费所属层的公开语义 Token，不把兼容变量扩散成新的跨层依赖。

## 5. 字体

应用字体族统一使用 `--application-font-family`，默认解析为项目 `--font-sans`。字距为 `0`，不使用负字距；数字和状态必须保持单行扫描能力。

| 层级 | Token / 值 | 字重 | 使用范围 | 证据状态 |
| --- | --- | ---: | --- | --- |
| Meta | 12 / 16px | 400–700 | 标签、说明、时间辅助、分页 | `confirmed` |
| Body | 14 / 20px | 400 | 表格、筛选、按钮、正文 | `confirmed` |
| Title | 16 / 24px | 600–700 | 应用名、更新时间值、分区标题 | `confirmed` |
| Heading | 20 / 28px | 700 | Drawer/Dialog 标题 | `confirmed` |
| Metric | 32 / 32px | 600 | 页面指标值，最多六项 | `confirmed` |

长文本规则：导航标题单行省略；业务表格默认不换行，字段需要阅读长文时进入详情；说明文字可以换行但不得改变固定工具栏高度；按钮文案超出时优先调整动作分组，不缩放字体。

## 6. 色彩

### 6.1 应用基础色

| 角色 | Token | 当前值 | 语义 | 证据状态 |
| --- | --- | --- | --- | --- |
| Canvas | `--application-canvas` | `#f5f5f5` | 应用页面底色 | `confirmed` |
| Surface | `--application-surface` | `#ffffff` | 表格、表单、内容面 | `confirmed` |
| Elevated | `--application-elevated` | `#ffffff` | 菜单、Popover、Drawer | `confirmed` |
| Text | `--application-text` | `#292929` | 主文本、图标 | `confirmed` |
| Muted | `--application-muted` | `#909197` | 标签、说明、辅助信息 | `confirmed` |
| Border | `--application-border` | `#e8e8e8` | 分隔线和弱边界 | `confirmed` |
| Accent | `--application-accent` | `#2652f1` | 主动作、焦点、选中 | `confirmed` |
| On Accent | `--application-on-accent` | `#ffffff` | 主动作前景 | `confirmed` |
| Success | `--application-success` | `#1fc16b` | 成功、完成 | `confirmed` |
| Warning | `--application-warning` | `#ff9e00` | 更新时间图标、警告 | `confirmed` |
| Danger | `--application-danger` | `#f23030` | 删除、异常 | `confirmed` |
| Info | `--application-info` | `#2652f1` | 信息状态 | `confirmed` |

Hover 和 selected 默认使用 Accent 8% 透明混合；disabled 使用 Text 38% 透明混合。颜色不能作为唯一状态线索，状态同时提供文本、图标、圆点或 aria 描述。

### 6.2 平台基础色

平台层使用 `--platform-canvas/surface/elevated/text/muted/border/accent`。当前变量由现有主题和兼容别名解析，具体色值可能随平台主题演进；专题组件不得把应用蓝色强行写入平台层。

## 7. 间距与固定几何

### 7.1 间距比例

| Token | 值 | 主要用途 |
| --- | ---: | --- |
| `--application-space-1` | 4px | 标签内部、标题与辅助信息 |
| `--application-space-2` | 8px | 图标文字、紧凑控件、动作组 |
| `--application-space-3` | 12px | 页面主间距、分区 padding、工具栏组 |
| `--application-space-4` | 16px | 按钮横向 padding、较宽内容间距 |
| `--application-space-5` | 24px | 大区块分隔，需由页面模式明确使用 |

### 7.2 公开尺寸 Token

Foundations 只维护可复用尺寸 Token，不维护具体壳层、页面或 Overlay 的组合几何和证据状态。组件如何使用这些 Token 分别由壳层、页面和状态分册负责。

| Token | 默认值 | 语义边界 |
| --- | ---: | --- |
| `--platform-button-height` | 32px | 平台语义按钮基准 |
| `--application-button-height` | 32px | 应用语义按钮基准 |
| `--application-content-header-height` | 48px | 页面上下文行的尺寸输入 |
| `--application-metric-strip-height` | 84px | 指标区的尺寸输入 |
| `--application-toolbar-height` | 32px | 查询与紧凑控件尺寸输入 |
| `--application-drawer-width` | 1280px | Detail Drawer 宽度输入 |

以上数值的 Token 实现证据为 `apps/web/index.css`。它们是否在某个具体组件中满足完整 geometry/behavior 合同，以该 Spec ID 的 canonical 分册状态为准。

## 8. 圆角与阴影

| 类型 | 值 | 使用边界 |
| --- | ---: | --- |
| Control radius | 16px | 32px 控件、筛选、状态 Badge |
| Panel radius | 12px | 菜单和局部内容面 |
| Large card radius | 16px | 独立重复项，不包裹页面大区块 |
| Small card radius | 12px | 紧凑重复项 |
| Dialog radius | 20px | 表单 Dialog 与应用切换 Popover |
| Full-height Drawer | 0 | 贴右全高 Overlay，不做浮动卡片 |

默认页面区不使用装饰性阴影。菜单使用 `0 12px 32px`、约 12% 主文本透明阴影；大 Popover 可使用 `0 18px 52px rgba(15,23,42,.14)`。阴影只表达真实层级，不用于把所有区块卡片化。

## 9. z-index 与 Overlay

| 平面 | 建议层级 | 规则 |
| --- | ---: | --- |
| 页面内容 | 0–10 | sticky 列仅在本内容面内提升 |
| 固定壳层 | 20–60 | 顶部导航、Max 左栏、Module 面板按当前 owner 管理 |
| Popover/Menu | 70–120 | 锚定当前控件，不穿过更高模态层 |
| Drawer/Dialog Overlay | 130+ | 遮罩覆盖页面与固定壳层，焦点留在模态面 |

生产代码已有 Drawer layer `z-index: 130`。新增 Overlay 必须复用统一 portal 层，不通过页面局部任意增加高层级值。

## 10. motion

交互动效只表达状态变化。常规 hover/open 使用 120–200ms；页面或壳层进入可使用约 240ms；缓动使用 `ease` 或 `cubic-bezier(.2,.8,.2,1)`。不得用位移动画改变固定几何或引发布局抖动。

`prefers-reduced-motion: reduce` 下取消非必要位移、缩放和循环动画，保留即时状态切换。打开和关闭后的 DOM 状态、焦点归属和 route 结果必须与有动效时一致。

## 11. 状态、键盘和可访问性

所有交互组件至少覆盖 default、hover、focus-visible、active/open、disabled；异步动作额外覆盖 loading、success、error。focus-visible 必须可感知且符合 WCAG AA，不得只依赖被清除的浏览器 outline。

图标按钮必须有可访问名称和 Tooltip；Popover/Menu 支持 Escape 与外部点击关闭；Tabs 支持方向键、Home、End；Dialog/Drawer 需要焦点陷阱、关闭后焦点恢复和明确的关闭按钮；颜色状态必须有非颜色辅助。

## 12. 档位差异、实现组件与当前差距

Basic、Pro、Max 使用完全相同的 Foundations。Pro 只在既有内容插槽提供知识增强；Max 仍复用同一平台/应用 Token。产品档位不得覆盖为另一套字号、密度或响应式系统。

实现组件与来源：

- `apps/web/index.css`：平台/应用公开语义与基础值。
- `apps/web/styles/00-base.css`：全局兼容变量和基础尺度输入。
- `apps/web/src/shared/ui/application/ApplicationPagePrimitives.module.css`：应用 Token 消费示例。
- `apps/web/src/shared/ui/application/ApplicationRecordList.module.css`：文字、间距和色彩消费示例。

当前差距：平台层部分颜色仍由 legacy alias 解析；焦点 Token 尚未在所有消费者中统一；部分组件仍直接使用固定色值。具体壳层、页面和 Overlay 差距只在各自 canonical 分册维护。

## 13. 验收

在 1920 × 1080、默认字体和稳定主题下验证：公开 Token computed value 与本分册一致；平台与应用语义不互相覆盖；字体、间距、圆角和状态色符合使用边界；键盘焦点可见；reduced-motion 不改变行为。具体组件几何由其 canonical 分册验收，未获截图支持的值不得宣称像素级确认。
