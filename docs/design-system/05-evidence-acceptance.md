# 证据、还原度与验收规范

> 规范版本：v1.3
> 适用基线：1920 × 1080 桌面视口
> 本分册职责：登记文字、截图、源码、组件和测试证据，定义还原度、视觉比较、Review Gate、同步顺序和持续维护门禁。

## 1. 证据口径

正式规则必须可追溯到获批文字、获批截图/Figma、当前源码或稳定测试。来源发生冲突时不静默选择：记录目标、现状、冲突范围、owner 和确认动作。截图只证明其可见视口和交互状态，不能自动证明 hover、disabled、empty、error、permission 或其他档位。

本版只验收 1920 × 1080 桌面场景，不创建移动端截图、断点或合格结论。

## 2. 章节目录

1. 来源优先级和证据状态
2. 截图登记合同
3. 当前视觉基线台账
4. 还原度定义
5. 结构、几何、视觉、交互验收
6. Basic / Pro / Max 场景矩阵
7. 组件中心和 skill 同步
8. 变更门禁、版本和审计

## 3. 来源优先级和证据状态

### 3.1 来源职责

| 来源 | 能证明什么 | 不能单独证明什么 |
| --- | --- | --- |
| 获批产品文字 | 所有权、层级、档位、必选性、业务边界 | 精确视觉像素 |
| 获批截图/Figma | 指定状态的结构、可见内容、几何、视觉 | 未展示状态和真实交互结果 |
| 当前源码/computed style | 当前实现值、组件 owner、route 和状态 | 未来目标是否正确 |
| 测试 | 被锁定的结构、接口和行为 | 未编写断言的视觉细节 |
| application-extension | 未来代理的生成与验证步骤 | 独立产品决策 |

### 3.2 状态转换

- `inferred → confirmed`：产品 Review Gate 接受并补足来源。
- `target → confirmed`：实现、测试和视觉证据全部满足目标。
- `gap → confirmed`：差距关闭并完成回归。
- `deferred`：只有范围重新启用后才能进入其他状态。

每条规则保留最后确认日期、确认人/owner、来源版本和影响的 Spec ID。证据状态不是组件成熟度，不能用“稳定组件”替代视觉或产品确认。

## 4. 截图登记合同

每个截图必须登记：

| 字段 | 说明 |
| --- | --- |
| Screenshot ID | 稳定标识，使用 `VISUAL.<TIER>.<SURFACE>.<NNN>` |
| Source | 本地稳定路径、Figma node 或获批文档 |
| Source version/date | 截图版本、提供日期、最后确认日期 |
| Tier | Basic / Pro / Max |
| Viewport | CSS viewport，当前统一 1920 × 1080 |
| Route / launch context | route、Platform/Account/Shortcut/Direct |
| Fixture | 稳定数据集或需要 mask 的动态区域 |
| State | default/open/selected/loading 等 |
| Browser / font | 浏览器版本、缩放、系统字体条件 |
| Visible assertions | 截图真正支持的结构与视觉结论 |
| Exclusions | 未覆盖或不得据此推导的规则 |
| Evidence status | confirmed/target/inferred/gap/deferred |

截图文件名使用英文小写短横线，保留原图，不二次压缩；标注图可作为边界证据，但不能用红框尺寸推导 CSS 值。CSS 值由源码/computed style 和获批设计值共同确认。

## 5. 当前视觉证据台账

现有两张图片都是用户提供的标注图，而不是在受控浏览器条件下生成的原始基准截图。它们可确认产品讨论指向和可见区域，但在 CSS viewport、DPR、route、fixture、browser/font 条件建立前，不参与 1920 × 1080 像素差验收。

### `VISUAL.MAX.PLATFORM_BOUNDARY.001` — `inferred`

| 字段 | 登记值 |
| --- | --- |
| Source | [max-platform-boundary.png](assets/max-platform-boundary.png)，用户红框标注图 |
| 提供日期 / source version | 2026-07-15 / annotated-source-v1 |
| 文件 bitmap | 4210 × 2196 PNG；SHA-256 `f9d4ee644c8c3e30c238b442f7f338ebce807ea9944e23f010db34064199a9fa` |
| Tier / state | Max / visible default shell |
| CSS viewport / DPR | 未建立；不得把 bitmap 尺寸换算为 1920 × 1080 CSS 几何 |
| route / launch context | 未建立；可见内容为 Max 平台入口进入后的主工作区 |
| fixture | 截图内示例数据，未冻结为自动化 fixture |
| browser/font | 未建立；不用于字体抗锯齿和像素差判断 |
| Visible assertions | 红框表达顶部平台层、平台左栏及入口后代属于 Max 平台治理 |
| Exclusions | 左栏后代页面逐页样式、hover/disabled、展开折叠 computed geometry |
| Evidence status | `inferred`；Max 所有权由用户文字确认，图片视觉参数仍需受控截图 |

### `VISUAL.BASIC.BUSINESS_FRAME.001` — `inferred`

| 字段 | 登记值 |
| --- | --- |
| Source | [basic-business-application-frame.png](assets/basic-business-application-frame.png)，用户红框标注图 |
| 提供日期 / source version | 2026-07-15 / annotated-source-v1 |
| 文件 bitmap | 4206 × 2206 PNG；SHA-256 `1f644d773c2d69bdbdb9757fe1c419cbc45cdfc5e3382b9452f6737434ef093c` |
| Tier / state | Basic / business list visible state |
| CSS viewport / DPR | 未建立；不得直接作为 1920 × 1080 像素基线 |
| route / launch context | 人力资源业务应用可见页；具体 hash route 未建立 |
| fixture | 截图内岗位示例数据，未冻结为自动化 fixture |
| browser/font | 未建立；不用于精确字体或抗锯齿比较 |
| Visible assertions | 顶部用户栏、应用一级/二级导航、更新时间、指标、查询和表格的可见层级 |
| Exclusions | hover、focus、disabled、loading、empty、error、permission 和 Overlay |
| Evidence status | `inferred`；结构由产品规则与代码确认，图片视觉参数仍需受控截图 |

Basic 其他状态图目前由 `application-extension` skill 的 `$CODEX_HOME/skills/application-extension/assets/screenshots/` 维护，包括 table、sidebar、card、drawer、dialog、global panel、settings、application switcher、account 和 module switcher。P6 同步时记录 skill 规范版本；未复制进仓库的资源继续作为本地执行证据，不作为跨环境唯一链接。

Pro 的完整截图集、1920 × 1080 受控 Basic 截图和 Max 展开/折叠状态图尚未形成正式基线，相关视觉细节保持 `inferred` 或 `gap`。这不影响已确认的 Pro 结构等同 Basic、Max 只新增平台左栏的产品规则。

## 6. 还原度定义

不得使用一个主观百分比替代分项验收。还原度分为五个维度：

| 维度 | 合格定义 |
| --- | --- |
| 内容覆盖 | 截图/来源中可见的标签、字段、状态、动作和区域 100% 盘点 |
| 结构覆盖 | 必选层、顺序、所有权、条件层和 Overlay 100% 通过合同测试 |
| 几何覆盖 | 高度、宽度、padding、gap、滚动和固定定位通过 computed style；允许 1px 误差 |
| 视觉覆盖 | 字体、颜色、圆角、边界、阴影在明确基线状态下通过图像对比和人工 Review |
| 交互覆盖 | route、open/close、键盘、焦点、筛选、选择、分页、提交及异常场景通过测试/操作验收 |

“100% 对标截图”只表示指定 Screenshot ID、route、tier、fixture、state、browser/font 条件下，上述可见内容和结构无遗漏；不表示整个产品所有状态均已 100% 完成。

## 7. 自动截图与比较

### 7.1 运行条件

- viewport：1920 × 1080。
- browser zoom：100%。
- 固定 locale、timezone、字体和 reduced-motion 条件。
- 使用稳定 fixture；时间、头像、随机 ID 和动画区域按规则冻结或 mask。
- route 加载、字体和图片完成后截图，不使用任意长 sleep 代替就绪条件。

### 7.2 比较规则

1. 先比较三段壳和页面内容起点，再比较页面内部。
2. computed style 精确验证固定几何和 Token；截图比较负责视觉关系。
3. 几何容差 1px；字体抗锯齿和动态数据可 mask；不得 mask 结构错位。
4. 差异报告记录 Screenshot ID、像素差区域、原因、处理决定和 owner。
5. 自动比较通过后仍需人工 Review Gate 确认业务表达和视觉方向。

## 8. 验收层级

### 8.1 文档合同

- 总纲版本、基准视口和状态明确。
- 核心 Spec ID 唯一、必选性和 owner 完整。
- 五个分册可达，无断链和占位文字。
- 每个正式模块包含统一规范合同的全部字段。
- 当前、目标、推断、差距和延期不会混写。

### 8.2 结构合同

- 三档业务应用都有 Top User Bar、Application Primary Nav、Module + Tab。
- 单 Module/单 Page 和四种启动上下文不省略层级。
- Pro DOM/几何与 Basic 一致；Max 左栏不替换应用导航。
- Page Actions、Query Actions、Row Actions、Batch Actions 分层归位。
- Overlay 不进入常驻页面网格。

### 8.3 几何和滚动

- 壳层 52/72/48，总高 172px。
- Max 左栏 220px、范围 180–260px、折叠 52px。
- 标准页 48/84/32/1fr，12px padding/gap。
- 表头 36px、行 68px、分页 64px。
- Drawer 1280px、Dialog 最大 720px、Global Panel 520–580px。
- 各区域只有一个明确纵向滚动 owner。

### 8.4 交互和可访问性

- default/hover/focus/active/disabled/loading/empty/error/permission 有明确合同。
- icon-only 按钮有 Tooltip 和可访问名称。
- Menu/Tabs/Dialog/Drawer 键盘行为、焦点陷阱和焦点恢复正确。
- 颜色不是唯一状态线索；文本对比和焦点达到 WCAG AA。
- reduced-motion 不改变行为和数据结果。

## 9. Basic / Pro / Max 场景矩阵

| 场景 | Basic | Pro | Max |
| --- | --- | --- | --- |
| 默认记录页 | 与 Basic 基线比较 | 与 Basic 做 DOM/几何等同性比较 | 与 Basic 页面内容比较，并验证左栏偏移 |
| 应用切换 | Trigger、Popover、route | 应保留，当前登记 gap | 应保留，当前登记 gap |
| 单 Module/Tab | 静态 Module + active Tab | 同 Basic | 同 Basic |
| Max Rail | 不渲染 | 不渲染 | 展开 220、折叠 52、完整目录和权限 |
| Detail/Form | 共享 Overlay | 同 Basic | 主区同 Basic，平台治理不改变业务字段 |
| Shortcut/Direct | 完整三段壳 | 完整三段壳 | 完整三段壳 + Max Rail |

## 10. 组件中心和 skill 同步

### 10.1 UI 组件中心

与核心规范相关的生产组件登记 `specId`、`componentFamily`、`evidenceStatus`。字段含义：

- `specId`：该 registry entry 完整承担的主要稳定规范标识；`null` 表示已经审阅并确认该组件不完整承担 v1.3 核心 Spec，而不是遗漏登记。
- `componentFamily`：跨产品表面的组件家族，首版词汇为 navigation、application-content、input、list、detail、form、overlay、statistics、catalog、collaboration、button。
- `evidenceStatus`：该 registry 分类判断的证据状态，不等同业务目标全部实现；`specId: null` 与 `evidenceStatus: confirmed` 组合表示“确认无核心主映射”。

复合组件以主要 Spec ID 登记，组件完整覆盖的其他规范放入 `relatedSpecIds`；仅作为某个规范内部构件时使用 `usedBySpecIds`，且不会因此计为该规范的生产覆盖。Registry 保持当前 export、Props、source/test paths、states、tokens 和 preview 的实现事实，不承担未来产品决策。

### 10.2 application-extension

Skill 必须记录同步的总纲版本、同步日期、稳定 Spec ID 来源和证据状态词汇。总纲升级后，如果 skill 尚未同步，代理必须先读取总纲并报告版本差距，不能继续把旧执行镜像当成最新产品规则。

| 执行镜像 | 同步版本 | 同步日期 | 桌面基线 | 状态 |
| --- | --- | --- | --- | --- |
| `application-extension` | v1.3 | 2026-07-15 | 1920 × 1080；移动端 deferred | 已同步 |
| `application-extension-template` | v1.3 | 2026-07-15 | 1920 × 1080；仅 standalone Basic；移动端、紧凑和大屏 deferred | 已同步（Basic-only） |

## 11. 变更门禁

```text
Draft source
→ Human Review Gate
→ Update master/topic spec and evidence
→ Update implementation and tests
→ Update component-center mapping
→ Sync application-extension version
→ Visual/interaction acceptance
→ Publish change log
```

内容文案或 fixture 变化通常只更新示例；结构、组件、系统样式和交互变化必须重新进入 Review Gate。只有稳定且获批的规则可以同步到 Figma、AI 文档或公司知识库。

## 12. 版本和审计

- 总纲兼容性变化升主版本；新增稳定规则升次版本；澄清升修订版本。
- 专题分册跟随总纲版本并记录独立最后确认日期。
- 每次发布记录变更的 Spec、来源、owner、实现 commit、测试、Screenshot ID、组件中心和 skill 同步状态。
- 删除或替换 Spec ID 必须给出迁移映射和失效版本，不能静默复用旧 ID 表达新语义。

## 13. 验收

P1–P5 至少通过文档合同测试、相对链接检查、Spec ID 唯一性、字段完整性和 `git diff --check`。P6 在此基础上运行组件中心定向测试、lint、typecheck、完整测试和 build；完整测试存在历史失败时，必须对比改动前后数量和失败清单，证明未新增回归。视觉验收以本分册登记的截图和 1920 × 1080 条件执行。
