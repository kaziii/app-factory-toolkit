# 壳层与导航规范

> 规范版本：v1.3
> 适用基线：1920 × 1080 桌面视口
> 本分册职责：定义顶部用户栏、Max 平台左栏、应用一级导航、Module + Tab 二级导航及其面板、状态和所有权。

## 1. 证据口径

结构口径来自产品总纲；当前几何和交互来自 `TopNavigation`、`Sidebar`、`00-base.css`、`01-sidebar.css`、`02-navigation.css`；Basic 和 Max 可见状态使用已登记截图。产品已确认但当前源码不满足的应用切换、完整应用目录和 title-only 行为统一标为 `gap`。本版不定义移动端导航。

## 2. 章节目录

1. 整体 Anatomy 与所有权
2. 顶部用户栏
3. Max 平台左栏
4. 应用一级导航
5. Module + Tab 二级导航
6. Module 面板
7. Basic / Pro / Max 差异
8. 禁止组合、实现映射与验收

## 3. 整体 Anatomy 与所有权

```text
Top User Bar 52
└─ brand | flexible region | app switch + account

Shell Body
├─ Max Rail 220 (Max only)
└─ Application Workspace
   ├─ Primary Application Navigation 72
   ├─ Module + Tab Navigation 48
   └─ Page Content
```

平台层拥有公司身份、应用切换、用户入口、Max 左栏和从这些入口派生的平台后代页面。应用壳拥有应用身份、应用级动作、Module 和 Tabs。业务页面只能从三段壳下方开始。

## 4. 顶部用户栏

### 4.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PLATFORM.TOP_USER_BAR` |
| 目的 / 所有者 | 跨应用提供公司身份、应用切换和用户入口；Platform / `widgets/navigation` |
| Anatomy | Brand、Application Switch Trigger/Popover、Account Trigger/Popover、条件版本状态 |
| 尺寸 / 定位 / 滚动 | 52px fixed 全宽；12px 横向 padding；Popover 自有滚动 |
| 字体 / 色彩 / 间距 | 平台 Token；24px 列 gap、10px account gap；辅助文案 12/16px |
| 圆角 / 阴影 / z-index / motion | Trigger 随控件圆角；Popover 20px、标准浮层阴影；位于壳层浮层；120–200ms |
| 动作 | 应用切换、账户打开、账号管理、退出和 Max 用户中心入口 |
| 状态 / 键盘 / 可访问性 | default/hover/focus/open/disabled；菜单键盘、Escape、焦点恢复、aria-expanded |
| 档位差异 | Basic、Pro、Max 结构和应用切换一致；Max 账号入口增加治理能力 |
| 实现组件 | `TopNavigationPrimaryBar`、Avatar、Popover、Button |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | Pro/Max 当前隐藏应用切换，顶部切换只展示前五项 |
| 验收 | 1920 × 1080 检查 52px、三元素共存、Popover 互斥、键盘和焦点恢复 |

### 4.2 目的、所有者和 Anatomy

- 目的：在所有业务应用中稳定提供公司身份、应用切换和用户入口。
- 所有者：Platform / `widgets/navigation`。
- Anatomy：Brand Mark、应用切换 Trigger/Popover、Account Trigger/Popover；版本标签只能表达档位状态，不替代应用切换。

### 4.3 尺寸、定位与滚动

| 项目 | 规范 |
| --- | --- |
| 行高 | 52px，全视口宽，fixed |
| 横向 padding | 12px |
| 三列 gap | 24px |
| Brand | 120 × 32px，完整展示，不裁切 |
| Account cluster | 高 36px，控件间距 10px |
| App switch trigger | 28 × 28px，图标 18px |
| Avatar trigger | 32 × 32px，圆形 |
| 滚动 | 顶部栏不滚动；Popover 自有内容滚动 |

### 4.4 字体、色彩和间距

背景使用半透明白色及 20px backdrop blur，底部使用弱分隔线。图标默认使用平台主文本的弱化值；hover 采用低透明叠层；focus-visible 使用可感知的 ring，不使用厚重蓝色矩形。

### 4.5 动作和状态

| 状态 | 规范 |
| --- | --- |
| default | Brand、应用切换、头像同时可见 |
| hover | Trigger 只出现弱背景，不改变尺寸 |
| focus-visible | 键盘焦点明确，Popover Trigger 保留 aria-expanded |
| open | 应用切换与账号 Popover 互斥 |
| disabled/loading | 账号切换时禁用重复动作并保持布局稳定 |

应用切换负责改变应用启动上下文和 route；账号入口负责个人资料、账号管理、退出及 Max 用户中心入口。两者不得合并为一个不明语义菜单。

### 4.6 键盘和可访问性

Trigger 使用 button 语义；应用切换和账号列表支持 Tab/Shift+Tab；Escape 和外部点击关闭；关闭后焦点返回 Trigger；头像图片具有替代名称或可用 fallback。

### 4.7 实现、证据和差距

- 实现组件：`TopNavigationPrimaryBar`。
- 源码：`apps/web/src/widgets/navigation/ui/TopNavigationPrimaryBar.jsx`。
- 样式：`apps/web/styles/02-navigation.css`。
- 证据状态：结构 `confirmed`；三档应用切换目标为 `gap`。
- 当前差距：当前 `showApplicationSwitcher` 会在 Pro/Max 隐藏；顶部切换只展示应用目录前五项。

## 5. Max 平台左栏

### 5.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `PLATFORM.MAX_RAIL` |
| 目的 / 所有者 | 提供 Max 平台功能和完整有权应用目录；Platform / `widgets/sidebar` |
| Anatomy | Collapse、平台工具、提醒、能力组、应用目录、设置、resize handle |
| 尺寸 / 定位 / 滚动 | 220px，180–260px，折叠 52px；top 52px；左栏内容独立滚动 |
| 字体 / 色彩 / 间距 | 平台 Token；紧凑 12/16px 元信息；8/12px 组间距 |
| 圆角 / 阴影 / z-index / motion | 导航项弱圆角、无浮动卡片阴影；壳层层级；折叠/resize 不做布局弹跳 |
| 动作 | 路由、折叠、resize、置顶/排序/分组配置 |
| 状态 / 键盘 / 可访问性 | expanded/collapsed/active/hover/focus；折叠 Tooltip、键盘路由、可访问 resize |
| 档位差异 | Basic/Pro 不渲染；只在 Max 改变横向框架 |
| 实现组件 | `Sidebar`、语义 Sidebar buttons、应用 shortcut 模型 |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | 应用区主要是 shortcut，完整目录和治理后端尚未完成 |
| 验收 | 1920 × 1080 检查 220/52px、180–260px 限制、滚动和主区偏移 |

### 5.2 目的、所有者和 Anatomy

- 目的：在 Max 中持续提供全部有权平台功能和当前租户完整业务应用目录。
- 所有者：Platform / `widgets/sidebar`。
- Anatomy：折叠控制、平台工具、提醒与任务、平台能力组、业务应用目录、设置入口、resize handle。

### 5.3 尺寸、定位与滚动

| 项目 | 规范 |
| --- | --- |
| 展开宽度 | 默认 220px，可调 180–260px |
| 折叠宽度 | 52px |
| 垂直范围 | `top: 52px` 到视口底部 |
| 高度 | `calc(100vh - 52px)` |
| 内容起点 | 应用一级/二级导航和页面从左栏右侧开始 |
| 滚动 | 左栏内容区独立纵向滚动，resize handle 不参与滚动 |

### 5.4 动作和状态

展开态显示图标、标题、状态和数量；折叠态只显示图标并提供 Tooltip。导航 active/hover 使用弱叠层或细指示，不使用大面积实色。resize 期间宽度限制在 180–260px，低于折叠阈值时进入 52px 折叠态。

应用目录必须由租户开通集合与权限交集驱动；用户配置只能置顶、排序或折叠，不能把有权应用从完整目录永久移除。

### 5.5 实现、证据和差距

- 实现组件：`Sidebar`。
- 源码：`apps/web/src/widgets/sidebar/ui/Sidebar.jsx`、`app/model/appShellModel.js`。
- 样式：`apps/web/styles/01-sidebar.css`。
- 证据状态：几何 `confirmed`；完整目录和平台治理为 `gap`。
- 当前差距：左栏应用部分主要来自可配置 shortcut，不是完整应用目录；用户中心后端能力尚未完整接入。

## 6. 应用一级导航

### 6.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `APPLICATION.PRIMARY_NAV` |
| 目的 / 所有者 | 表达 Application Identity 和应用全局动作；Application Shell / `widgets/navigation` |
| Anatomy | Logo、名称、Badge、简介、Global Actions、升级、设置、全屏 |
| 尺寸 / 定位 / 滚动 | 72px fixed；Logo 48px；动作 32px；不滚动，溢出进入 More |
| 字体 / 色彩 / 间距 | 标题 16/24px、简介 12/16px；应用 Token；12px padding/gap |
| 圆角 / 阴影 / z-index / motion | Logo 8px、动作 16px；本行无阴影；Panel 单独分层；120–200ms 状态动效 |
| 动作 | 总览、风险、消息、待办、升级、设置、全屏 |
| 状态 / 键盘 / 可访问性 | default/hover/focus/active/disabled/open；Tooltip、aria-label、aria-expanded |
| 档位差异 | 三档同一 DOM 和几何；Pro 仅知识增强，Max 仅受左栏横向约束 |
| 实现组件 | `TopNavigationSecondaryNav / Application Bar`、`ApplicationGlobalActionPanel` |
| 证据状态 | `overall=confirmed; geometry=confirmed; behavior=confirmed` |
| 当前差距 | 核心组件已确认；部分存量消费者仍有页面身份重复 |
| 验收 | 1920 × 1080 检查 72px、48px Logo、32px 动作、无页面重复身份 |

### 6.2 目的、所有者和 Anatomy

- 目的：持续表达当前 Application Identity 和应用级全局动作。
- 所有者：Application Shell / `widgets/navigation`。
- Anatomy：应用 Logo、名称、档位 Badge、简介、应用级 Actions、升级入口、设置、全屏控制。

### 6.3 尺寸、定位与滚动

| 项目 | 规范 |
| --- | --- |
| 行高 | 72px，全宽横向排列 |
| 横向 padding | 12px |
| 区域 gap | 12px |
| Logo | 48 × 48px，radius 8px，`object-fit: contain` |
| 标题 | 16 / 24px，600–700 |
| 简介 | 12 / 16px，单行省略 |
| Badge | 高 20px，pill |
| 图标动作 | 32 × 32px，图标 18px |
| 滚动 | 不滚动；动作溢出进入“更多”而不是换行 |

### 6.4 动作分区

应用级动作包括运行总览、风险预警、消息、待办、设置。总览/风险/消息/待办优先作为当前应用上下文内的受控 Panel；设置进入应用设置 Drawer 或明确 route。页面的新建、编辑、导出不进入本层。

### 6.5 状态和可访问性

图标动作默认 icon-only，hover/focus 显示 Tooltip；active 使用 Accent 12% 弱背景和 Accent 前景；disabled 保留 32px 几何。每个图标按钮提供 aria-label，Panel Trigger 提供 aria-expanded。

### 6.6 实现、证据和差距

- 实现组件：`TopNavigationSecondaryNav / Application Bar`、`ApplicationGlobalActionPanel`。
- 证据状态：布局和动作位置 `confirmed`。
- 当前差距：部分存量页面仍有页面局部身份或标题重复，需要在后续页面改造时逐页消除。

## 7. Module + Tab 二级导航

### 7.1 规范合同

| 字段 | 规范 |
| --- | --- |
| Spec ID | `APPLICATION.SECONDARY_NAV` |
| 目的 / 所有者 | 表达 Application → Module → Page(Tab)；Application Shell / `widgets/navigation` |
| Anatomy | Module Anchor/Trigger、Module Menu、Tab List、Active Indicator |
| 尺寸 / 定位 / 滚动 | 48px fixed；Module 最小 168×40；Tab 32px；Tabs 横向、面板纵向滚动 |
| 字体 / 色彩 / 间距 | Body 14/20px；应用 Token；8px Tab gap、20px Module/Tab gap、8px 12px padding |
| 圆角 / 阴影 / z-index / motion | Tab/Trigger 16px；行无阴影；Module 面板在壳层浮层；active indicator 平滑移动 |
| 动作 | Module 选择、Tab route 切换、面板打开关闭 |
| 状态 / 键盘 / 可访问性 | default/hover/focus/active/disabled/open；Tabs 方向键/Home/End，Menu Escape/焦点恢复 |
| 档位差异 | 三档结构和几何一致；Max 只增加左侧偏移 |
| 实现组件 | `TopNavigationSecondaryNav / Module Row`、`useWorkspaceSelection` |
| 证据状态 | `overall=gap; geometry=confirmed; behavior=gap` |
| 当前差距 | Shortcut/title-only 仍可省略二级导航 |
| 验收 | 1920 × 1080 检查 48px、单 Module/Tab、四启动上下文和键盘合同 |

### 7.2 目的、所有者和 Anatomy

- 目的：表达 `Application → Module → Page(Tab)` 的当前位置和切换关系。
- 所有者：Application Shell / `widgets/navigation`。
- Anatomy：Module Anchor/Trigger、Module Menu、Tab List、Active Indicator。

### 7.3 尺寸、定位与滚动

| 项目 | 规范 |
| --- | --- |
| 行高 | 48px |
| padding | 8px 12px |
| Module/Tab gap | 20px |
| Module anchor | 最小 168 × 40px |
| Tab list | 高 48px，gap 8px，单行横向滚动 |
| Tab | 高 32px，padding 6px 12px |
| Active indicator | 2px 高，跟随当前 Tab，不改变行高 |

Module 始终在左，Tabs 在右。单 Module 使用静态 anchor；多 Module 使用受控 Trigger。单页面仍显示至少一个 active Tab；不生成 title-only 壳层。

### 7.4 Tabs 状态和键盘

default 使用主文本弱化色；hover 使用弱背景；active 使用主文本/Accent 指示；disabled 可见但不可触发。Tabs 使用 tablist/tab/tabpanel 语义，支持左右方向键、Home、End；切换后 route 与焦点同步。

### 7.5 实现、证据和差距

- 实现组件：`TopNavigationSecondaryNav / Module Row`、`useWorkspaceSelection`。
- 证据状态：标准 Module/Tab `confirmed`；所有启动来源强制保留为 `gap`。
- 当前差距：Shortcut 仍能传 `hideSecondaryTabs`，`application-title-only-mode` 仍存在。

## 8. Module 面板

Module 面板是二级导航的展开状态，不是 Max 左栏或页面侧栏。

| 项目 | 规范 |
| --- | --- |
| 定位 | fixed，位于完整应用壳下方 |
| top | 172px |
| width | 392px |
| height | `calc(100vh - 172px)` |
| padding | 12px |
| 表面 | 白色，无装饰性外圆角和阴影，右侧弱分隔线 |
| Max 偏移 | 左边界从 Max 左栏右侧开始 |

选中 Module 不重复导航；列表支持键盘移动、Enter/Space 选择和 Escape 关闭；关闭后焦点返回 Module Trigger。

## 9. Basic / Pro / Max 差异

| 元素 | Basic | Pro | Max |
| --- | --- | --- | --- |
| Top User Bar | 完整显示 | 与 Basic 完全一致 | 与 Basic 完全一致 |
| Application Primary Nav | 完整显示 | 几何和 DOM 一致 | 主工作区内一致 |
| Module + Tab | 完整显示 | 完全一致 | 主工作区内一致 |
| Platform Rail | 无 | 无 | 唯一新增的全局结构 |
| 知识增强 | 基础 | 复用现有入口/插槽 | 包含 Pro，不新增另一套应用壳 |

## 10. 禁止组合

- 不把应用一级导航实现为应用侧边栏。
- 不把 Max 左栏用于 Module 或页面视图切换。
- 不在业务页面复制公司 Logo、应用切换、用户入口或应用身份。
- 不通过 `hideSecondaryTabs`、title-only 或快捷启动省略二级导航。
- 不用页面标题替代 Module + Tab。
- 不让 Popover、Module 面板与账号菜单同时保持展开。

## 11. 验收

在 1920 × 1080 分别验证 Basic、Pro、Max：

1. Top User Bar、应用一级导航、Module + Tab 几何为 52/72/48px。
2. Basic 与 Pro 的 DOM 地标、内容起点和宽度一致。
3. Max 展开/折叠分别按 220/52px 偏移主工作区，顶部栏仍全宽。
4. 单 Module/单 Tab、Platform/Account/Shortcut/Direct 启动均保留完整层级。
5. 应用切换、账号 Popover、Module 面板互斥，Escape 与焦点恢复正确。
6. 所有 icon-only 动作有 Tooltip 和可访问名称，hover/focus 不引起布局位移。
