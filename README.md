# App Factory Toolkit — 平台业务应用生成插件

按平台 UI 规范，从一份业务功能结构文档快速生成可运行的运营型 React 业务应用，并一键发布到演示环境。

## 功能

安装后获得唯一入口 Skill `application-extension-template`：

| Skill | 功能 |
| --- | --- |
| `application-extension-template` | **唯一入口。** 从业务结构文档生成 standalone Basic 应用：自带完整 React/Vite 工程与平台壳（顶部用户栏、一级导航、Module + Tab 二级导航、列表/看板/侧栏三种视图、详情抽屉、表单弹窗），内置「所见即所推」本地预览（双击即开、零 Node 依赖、渲染逻辑与演示站一致），以及发布到陌衡企信演示环境的 publish 能力（临时链接 + 接口需求清单） |

典型流程：描述需求 → 生成应用与 `本地预览.html` → 双击预览看到与发布后一致的真实渲染并确认 → 回复「发布」推送到演示环境，获得临时访问链接。

使用示例（在会话中直接发送）：

```
用 $application-extension-template 生成一个人事管理应用，包含员工列表、入离职流程两个模块
```

## 安装指引

### Codex（GUI 插件市场）

1. 打开 Codex，进入左侧栏的 **插件** 页面。
2. 点击右上角 **设置（⚙）→ 添加插件市场**，填写：

   | 字段 | 填写内容 |
   | --- | --- |
   | 来源 | `kaziii/app-factory-toolkit` |
   | Git 引用 | `master` |
   | 稀疏路径 | 留空 |

3. 点击 **添加市场**。插件列表中出现 **App Factory Toolkit** 后点击 **安装**。
4. 重启 Codex 验证：在会话输入框输入 `$`，补全列表出现 `application-extension-template` 即安装成功；也可在 **技能** 页面查看已加载的 Skill。

> 私有仓库需要本机 git 具备该仓库访问权限（已配置 SSH key 或 GitHub 登录）。也可直接填完整地址 `git@github.com:kaziii/app-factory-toolkit.git`。
>
> 更新：插件页面对 App Factory Toolkit 点击 **更新** 即可（前提是「Git 引用」填的是分支名 `master`，pin 了 tag/commit 则停留在该版本）。

### WorkBuddy（GUI 技能市场）

1. 先把仓库下载到本地：

   ```bash
   git clone https://github.com/kaziii/app-factory-toolkit.git
   ```

2. 打开 WorkBuddy，点击左侧 **技能** 进入 SkillHub 技能市场。
3. 点击 **添加技能 → 上传技能**，拖拽或选择仓库根目录 `app-factory-toolkit` 导入（根目录已含 `SKILL.md` 入口，符合 WorkBuddy 技能规范；也可只导入 `app-factory-toolkit/skills/application-extension-template`）。
4. 导入后在技能列表中将该技能切换为 **启用** 状态。
5. 验证：新建会话，输入 `$` 或直接发送上面的使用示例，能触发 `application-extension-template` 即安装成功。

也可以走插件市场目录手动安装（等价于 GUI 导入）：把本仓库复制到 `%USERPROFILE%\.workbuddy\plugins\marketplaces\` 下，然后在 `%USERPROFILE%\.workbuddy\settings.json` 中启用：

```json
{
  "enabledPlugins": {
    "app-factory-toolkit@app-factory-toolkit-marketplace": true
  }
}
```

任一方式安装后需**重启客户端**才会加载。`application-extension-template` 内含完整 React 模板工程与预览运行时，首次拉取需要一些时间，属正常现象。参考状态图不随插件分发——由演示环境在生成前按本机配置实时下发（详见 skill 的 Generation policy 章节）。
