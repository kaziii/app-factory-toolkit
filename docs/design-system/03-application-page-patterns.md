# 应用页面与内容模式规范

> 规范版本：v1.3
> 适用基线：1920 × 1080 桌面视口
> 本分册职责：定义业务页面从应用壳以下的更新时间与操作、指标、查询工具栏、内容模式、批量操作、分页和详情触发关系。

## 1. 证据口径

标准页面节奏来自已落地的人力资源页面、`ApplicationPagePrimitives`、`ApplicationRecordList`、`ListTableShell` 和 Basic 状态截图。仅当页面拥有对应业务能力时使用指标、查询、分页或批量层；条件层缺失时不得保留空占位。定制工作台和 Embedded 页面以来源结构为主，不强制套表格。

## 2. 章节目录

1. 页面框架与滚动
2. 更新时间与页面操作
3. 指标区
4. 查询工具栏
5. 表格列表
6. 侧栏列表
7. 卡片看板与定制页面
8. 选择、批量和分页
9. 详情、表单和流程触发
10. 档位差异、实现映射和验收

## 3. 页面框架与滚动

```text
Application Page Viewport
├─ Update + Page Actions                48px
├─ Metric Strip                         84px, conditional
├─ Query Toolbar                        32px, conditional
└─ Content Surface                      minmax(0, 1fr)
   ├─ Table / Sidebar / Card / Custom
   ├─ Batch Action                       conditional
   └─ Pagination                         conditional
```

标准页面使用 12px 外边距和 12px 行间距。页面容器 `min-width: 0; min-height: 0`，内容区填满剩余高度。页面只拥有内容滚动；固定壳层、Module 面板和 Overlay 各自独立。

标准网格简写为 `48px 84px 32px minmax(0, 1fr)`；84px 和 32px 是条件轨道，不存在对应能力时从网格中移除。

页面模式必须在 PRD/Brief 中声明：`record-list`、`sidebar-list`、`card-board`、`custom-workbench`、`embedded`。同一 route 可以提供视图切换，但视图必须共享数据、筛选和选中语义，不能只做装饰性变体。

## 4. 更新时间与页面操作

### 4.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PAGE.UPDATE_ACTION` |
| 目的 / 所有者 | 表达数据新鲜度并承载页面主动作；Page / 业务页面 owner |
| Anatomy | Clock、Label/Value、业务日期、Refresh、Primary、View Mode、More |
| 尺寸 / 定位 / 滚动 | 最小 48px，页面首行；自身不滚动 |
| 字体 / 色彩 / 间距 | Label 12/16、Value 16/24；应用 Token；12px 主 gap、8px 动作 gap |
| 圆角 / 阴影 / z-index / motion | 32px 控件 radius 16px；无阴影/层级提升；刷新动效尊重 reduced-motion |
| 动作 | 刷新、新建/发起、视图切换、更多页面动作 |
| 状态 / 键盘 / 可访问性 | default/hover/focus/disabled/loading/error；Button/Menu 键盘、aria-busy、错误反馈 |
| 档位差异 | Basic/Pro/Max 完全一致 |
| 实现组件 | `ApplicationPageHeader`、`SystemButton` |
| 证据状态 | `overall=confirmed; geometry=confirmed; behavior=confirmed` |
| 当前差距 | 核心组件已确认；部分存量消费者尚未复用 |
| 验收 | 1920 × 1080 检查 48px、左右分区、刷新结果、动作归属和键盘 |

### 4.2 目的、所有者和 Anatomy

- 目的：给出页面数据新鲜度，并集中承载当前页面的主动作和视图动作。
- 所有者：Page。
- Anatomy：Clock、更新时间 Label/Value、可选业务日期、Refresh、Primary Action、View Mode、More Actions。

### 4.3 尺寸和布局

| 项目 | 规范 |
| --- | --- |
| 行高 | 最小 48px |
| 对齐 | 左侧更新时间，右侧页面动作，垂直居中 |
| 区域 gap | 12px；动作间 gap 8px |
| 底部 | 12px padding + 1px 弱分隔线 |
| Clock | 32 × 32px，圆形，18px 图标 |
| Refresh | 32 × 32px，16px 图标 |
| Primary Action | 高 32px，padding 6px 16px，radius 16px |

更新时间 Label 使用 12/16px Muted；时间值使用 16/24px、700；时间与刷新在同一行。刷新不得只播放动画而不更新数据状态；失败时在当前页面提供可恢复反馈。

### 4.4 动作边界

页面主动作包括新建、发起、导入或页面级处理；视图切换紧随主动作；导出、字段配置等次动作进入 More。应用总览、消息、风险、待办和设置属于应用一级导航；排序、筛选、搜索属于查询行；查看、编辑、删除属于行级动作。

### 4.5 状态和可访问性

Refresh 支持 loading 和失败提示；Primary Action 支持 disabled/loading；More Menu 支持键盘和 Escape；所有按钮有明确名称。动作异步完成后保持数据、选择状态和焦点结果可预测。

## 5. 指标区

### 5.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PAGE.METRIC_STRIP` |
| 目的 / 所有者 | 提供页面级可扫描指标；Page / 业务页面 owner |
| Anatomy | 最多六个 Label、Value、Helper/Trend，可选交互容器 |
| 尺寸 / 定位 / 滚动 | 最小 84px，六等列；自身不滚动 |
| 字体 / 色彩 / 间距 | Label/Helper 12/16、Value 32/32；应用 Token；12px gap/padding |
| 圆角 / 阴影 / z-index / motion | 无卡片圆角、阴影和层级；数值更新不移动布局 |
| 动作 | 默认只读；仅真实筛选/钻取时可点击 |
| 状态 / 键盘 / 可访问性 | static/hover/focus/selected/loading；button 指标可键盘触发，趋势非仅颜色 |
| 档位差异 | 三档同一结构；Pro 知识结果不新增指标壳 |
| 实现组件 | `ApplicationMetricStrip` |
| 证据状态 | `overall=confirmed; geometry=confirmed; behavior=confirmed` |
| 当前差距 | 共享组件已确认；每个业务指标含义仍由应用证据负责 |
| 验收 | 1920 × 1080 检查 84px、最多六列、无虚假 KPI、交互结果可解释 |

### 5.2 Anatomy 与几何

指标区最多六项等宽列，不使用独立卡片包裹每个数值。

| 项目 | 规范 |
| --- | --- |
| 最小高度 | 84px |
| 列 | 最多六个 `minmax(0, 1fr)` |
| gap | 12px |
| 底部 | 12px padding + 1px 分隔线 |
| Label/Helper | 12 / 16px，Muted |
| Value | 32 / 32px，600，单行省略 |

### 5.3 行为

默认指标是只读摘要。只有存在真实筛选、钻取或详情结果时才使用 button 语义；点击后必须可解释页面筛选变化或进入的目标。趋势不能只靠红绿颜色表达。

无指标的页面整层不渲染；不得为了填满模板生成虚假 KPI。

## 6. 查询工具栏

### 6.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PAGE.QUERY_TOOLBAR` |
| 目的 / 所有者 | 统一排序、筛选、搜索和高级筛选；Page / 业务页面 owner |
| Anatomy | Sort、Divider、Quick Filters、Search、Advanced Filter |
| 尺寸 / 定位 / 滚动 | 最小 32px；Search 300×32px；高级菜单内部滚动 |
| 字体 / 色彩 / 间距 | Body 14/20；应用 Token；12px 主 gap、8px 组 gap |
| 圆角 / 阴影 / z-index / motion | 控件 16px、Menu 12px；Menu 标准阴影/浮层；120–200ms |
| 动作 | 单选排序、多选快筛、受控搜索、高级筛选和清空 |
| 状态 / 键盘 / 可访问性 | default/hover/focus/open/checked/disabled；Menu 键盘、Search label、Escape |
| 档位差异 | Basic/Pro/Max 完全一致 |
| 实现组件 | `ApplicationQueryToolbar`、Filter Menus、`ApplicationSearchField` |
| 证据状态 | `overall=confirmed; geometry=confirmed; behavior=confirmed` |
| 当前差距 | 核心组件已确认；部分存量消费者仍使用私有查询条 |
| 验收 | 1920 × 1080 检查 32px、固定顺序、300×32px、筛选语义和键盘 |

### 6.2 固定顺序

```text
Left:  Sort → Divider → Quick Filters
Right: Search → Advanced Filter
```

| 项目 | 规范 |
| --- | --- |
| 最小高度 | 32px |
| 主区域 gap | 12px |
| 左组/筛选 gap | 8px |
| Divider | 1 × 20px |
| Search | 300 × 32px，radius 16px |
| Quick Filter/Menu | 高 32px，菜单宽 220px |
| Advanced Menu | 最大高 `min(520px, 100vh - 128px)`，内部滚动 |

### 6.3 查询语义

- Sort：单选，同一时刻只有一个排序规则。
- Quick Filter：默认多选，勾选时菜单保持打开，Trigger 显示选中值或数量。
- Search：受控输入；明确搜索字段、去空格和无结果行为。
- Advanced Filter：按业务分组，可显示选中数量和清空动作。

筛选条件改变时默认回到第一页；清空恢复该 route 的默认条件；route-scoped 偏好只存视图和非敏感查询信息。无查询能力的页面整行不渲染。

### 6.4 状态与键盘

default 使用 Text 6% 背景；hover 使用 Accent 边界和 8% 背景；focus-within 使用白色 Surface 与 Accent 边界；open/checked 使用 selected 背景和 Accent 文本。菜单项支持方向键、Enter/Space、Escape，搜索输入具有可见 label 或 aria-label。

## 7. 表格列表

### 7.1 内容面规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PAGE.CONTENT_SURFACE` |
| 目的 / 所有者 | 承载表格、侧栏、卡片或定制业务内容；Page / feature owner |
| Anatomy | Content Container、Primary View、Selection/Batch、Pagination、Detail Trigger |
| 尺寸 / 定位 / 滚动 | `minmax(0,1fr)`；12px padding/gap；内容区为页面主滚动 owner |
| 字体 / 色彩 / 间距 | Body 14/20、Meta 12/16；应用 Token；表格/卡片使用 8/12px 节奏 |
| 圆角 / 阴影 / z-index / motion | 表格容器 16px、表面无装饰阴影；sticky 操作列局部 z-index；切换不抖动 |
| 动作 | 行详情、行级动作、选择、批量、分页和视图切换 |
| 状态 / 键盘 / 可访问性 | loading/empty/error/permission/selected；表格语义、Checkbox 键盘、焦点可见 |
| 档位差异 | 三档内容结构一致；Max 只减少可用横向宽度 |
| 实现组件 | `ApplicationRecordList`、`ListTableShell`、Card/Sidebar feature views |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | 标准表格已确认，共享 Page Frame 和部分业务视图尚未统一 |
| 验收 | 1920 × 1080 检查填充、单滚动、表头/行/分页、sticky、视图数据一致 |

### 7.2 容器和几何

| 项目 | 规范 |
| --- | --- |
| Table Container | 填满内容区，白色，padding 12px，radius 16px |
| Table | 至少填满可用宽度，必要时横向滚动 |
| Header | 36px，padding 0 12px，背景 `#f5f5f6` |
| Data Row | 68px，padding 12px，底部分隔线 |
| Primary Cell | 主信息 14/20px，辅助信息 12/16px |
| Selection | 固定 42px，命中区至少 24px |
| Row Actions | 12/16px unboxed Accent 文本 |
| Sticky Actions | 最后一列在横向滚动内固定到右侧 |

表格列定义来自业务字段，不为视觉对齐删除字段。主信息列允许主/副两行；其他单元格默认单行。长文本进入 Drawer 阅读。表头和数据对齐，操作列不遮挡最后业务列。

### 7.3 行为和状态

行 hover 使用 `#f9fafb`；选中保持可见 Checkbox；点击普通行可打开详情，按钮、链接、Checkbox、菜单阻止行详情冒泡。无权限的动作隐藏或禁用必须由权限合同明确，不能只依赖前端视觉。

表格必须覆盖 loading、empty、error、permission-empty 和 partial-data；具体文案与恢复动作见状态分册。

## 8. 侧栏列表

侧栏列表用于分组、组织树或类别驱动的记录浏览，不等同 Max 平台左栏。

| 项目 | 规范 |
| --- | --- |
| Overall grid | `360px minmax(0, 1fr)`，无额外卡片间隙 |
| Left rail | 12px padding/gap，右侧弱分隔线 |
| Update row | 48px |
| Search | 32px |
| Group list | 填满剩余高度，独立滚动 |
| Main content | 复用标准 Query/Table/Detail 合同 |

左侧选中分组必须与右侧标题、筛选和数据一致。折叠、搜索和数量变化不得改变 360px 固定轨道；没有分组语义时不使用此模式。

## 9. 卡片看板与定制页面

### 9.1 卡片看板

默认五等列、12px gap，卡片声明稳定最小宽度，状态和主要动作在卡片内部可扫描。卡片只用于重复业务项，不把整个页面区块包装成浮动卡片，也不嵌套卡片。

卡片视图与列表视图共享筛选、排序、分页、选择和详情数据。切换视图不应重置 route-scoped 查询条件。

### 9.2 定制工作台

组织树、风险地图、报告、驾驶舱和来源明确的工作台保留来源信息架构。它们仍必须复用顶部三段壳，且声明页面首行、主滚动 owner、状态和 Overlay；不为满足标准截图强行添加指标、查询或表格。

### 9.3 Embedded

Embedded 页面通过 Adapter 接入统一壳层。公司级头部映射到宿主平台，不保留双 Logo、双应用切换或双用户中心。iframe 优先由父页面拥有纵向滚动，内部滚动只在源系统无法调整时作为显式例外记录。

## 10. 选择、批量和分页

### 10.1 选择和批量

选择只作用于当前数据范围和当前权限。表头 Checkbox 表达未选、部分、全选三态；批量操作条在存在选择时出现，最小高 48px，不永久占据无选择页面。

批量条显示选择数量、可用动作和清空选择。危险动作必须二次确认并说明影响范围；执行后同步更新列表、分页和指标。

### 10.2 分页

| 项目 | 规范 |
| --- | --- |
| 高度 | 64px |
| padding / gap | 0 12px / 12px |
| 控件 | 最小 28 × 28px，radius 8px |
| 文字 | 12px，Muted |
| Current | Accent 边界和文本，较高字重 |

分页固定在列表容器底部，不固定到整个浏览器视口。上一页/下一页禁用态必须可感知；page size 改变时回到第一页。

## 11. 详情、表单和流程触发

- 查看、行点击：打开 Detail Drawer，保持列表 route 和查询上下文。
- 新建、编辑：打开 Form Dialog；复杂长流程使用专门 Workflow 载体。
- 设置：由应用一级导航进入 Settings Drawer，不在页面重复设置标题栏。
- 全局应用动作：在一级导航锚定 Panel，不转化为页面局部卡片。

关闭 Overlay 后焦点返回原 Trigger；提交成功后更新记录并保留可解释的列表位置；未保存变更的退出保护必须由业务流程明确。

## 12. 档位差异和实现映射

Basic、Pro、Max 使用同一页面框架、Tokens、列表模式和 Overlay。Pro 的知识增强只进入已存在的页面插槽或动作结果；Max 左栏只改变可用横向宽度，业务页面内部结构不变。

生产组件：

- `ApplicationPageScope`
- `ApplicationPageHeader`
- `ApplicationMetricStrip`
- `ApplicationQueryToolbar`
- `ApplicationFilterMenu` / `ApplicationAdvancedFilterMenu`
- `ApplicationSearchField`
- `ApplicationRecordList` / `ListTableShell`
- `ListSelectionCheckbox` / `ListBatchActionBar`
- `ApplicationDetailDrawer` / `ApplicationFormDialog`

当前差距：标准 `48/84/32/1fr` 网格仍主要由各 feature CSS 持有，尚无共享 `ApplicationPageFrame`；部分业务页仍使用私有表格和状态；异常、权限和未保存变更状态未完全统一。

## 13. 验收

在 1920 × 1080 使用固定 fixture 验证：

1. 标准页保持 48/84/32/剩余内容的稳定节奏，条件层省略时无空白轨道。
2. 页面动作、查询动作、行级动作、批量动作分别归位。
3. 搜索 300×32px，排序单选，普通筛选多选且勾选时不自动关闭。
4. 表头 36px、数据行 68px、分页 64px；横向滚动时操作列正确 sticky。
5. 列表、侧栏、卡片共享数据和详情语义；定制页面不被错误表格化。
6. 内容区只有一个主滚动 owner，Overlay 打开后背景交互和焦点受到约束。
