# 业务应用

本项目是由平台业务应用生成工具创建的独立 React/Vite 桌面应用。

## 运行

先确认本机已安装 Node.js 22+ 和 pnpm，然后在项目根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

`pnpm check` 会自动构建应用、启动一次短生命周期预览服务，并检查首页和基础壳资源是否可访问。开发服务启动后，打开终端显示的 `http://127.0.0.1:<port>` 地址。

不要使用 `npm install` 或 yarn，也不要直接双击 `index.html`：Vite 必须先转换 `/src/main.jsx`，因此应用只能经 Vite 服务打开。

## 生产构建

```bash
pnpm build
pnpm preview
```

## 排障

如果看到 `package-lock.json` 冲突提示，说明此前混用了 npm 和 pnpm。移除 npm 的 lockfile 与 `node_modules` 后，重新执行：

```bash
pnpm install --frozen-lockfile
pnpm check
```
