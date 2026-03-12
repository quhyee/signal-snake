# Signal Snake

`Signal Snake` 是一个复古街机风的贪吃蛇小游戏，使用 `HTML + CSS + JavaScript + Canvas` 构建，适合直接在 VS Code 中打开、运行和继续扩展。

## 在 VS Code 中运行

### 方式一：使用 Live Server

1. 在 VS Code 中安装 `Live Server` 扩展。
2. 打开本项目目录，例如 `snake-game/`。
3. 右键 `index.html`，选择 `Open with Live Server`。

### 方式二：在终端启动本地静态服务器

1. 打开 VS Code 集成终端。
2. 运行 `npx serve .`
3. 在浏览器中打开终端输出的本地地址。

说明：不建议直接通过 `file://` 打开 `index.html`，因为浏览器对模块脚本的加载在本地静态服务器下会更稳定。

## 操作方式

- `方向键` 或 `WASD`：控制小蛇移动；在待机状态下也可以直接开局
- `R`：立即重新开始
- `Enter` 或 `Space`：开始新一局

## 测试核心引擎

```bash
npm test
```

## 生成发布目录

```bash
npm run build
```

执行后会生成 `dist/`，其中只包含线上运行需要的静态资源：

- `dist/index.html`
- `dist/style.css`
- `dist/src/`

这样可以避免把测试、计划文档和本地排障文件一起公开到线上站点。

如果想在推送前做一次本地 smoke test，也可以进入 `dist/` 后运行 `npx serve .` 进行快速验证。

## 推荐部署方式

当前项目推荐使用 `公开 GitHub 仓库 + Netlify 自动部署`：

1. 将项目推送到公开 GitHub 仓库。
2. 在 Netlify 中通过 Git 导入该仓库。
3. 构建命令填写 `npm run build`。
4. 发布目录填写 `dist`。

这样每次推送到 `main` 分支后，Netlify 都会自动生成新的线上版本。

## 当前特性

- 基于 Canvas 的游戏棋盘
- 分数与最高分记录
- 随着长度增长逐步加速
- 带反向保护的键盘输入
- 兼容小屏幕的复古街机界面

## 文件说明

- `index.html`：页面结构、HUD 和静态界面文案
- `style.css`：视觉样式、中文排版与响应式布局
- `src/config.js`：共享配置常量
- `src/game.js`：游戏状态推进与碰撞逻辑
- `src/renderer.js`：Canvas 渲染
- `src/input.js`：键盘与方向输入处理
- `src/main.js`：主循环、DOM 绑定与本地持久化
- `src/ui-text.js`：运行时中文文案与格式化逻辑
