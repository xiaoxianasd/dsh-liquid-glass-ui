# dsh-liquid-glass-ui

为 DeepSeek Harness Web UI 提供自定义背景图和类似 iOS 液态玻璃的透明质感。

[English](README.md)

## 功能

- 支持远程背景 URL，也支持上传本地图片（以 data URL 保存，上限 4 MB）。
- 可调玻璃不透明度、背景暗化、图片尺寸和位置。
- 全部界面统一使用轻量透明合成，不使用实时模糊或滤镜管线。
- 在设置卡片中预览效果，确认后再保存。
- 使用 DSH 原生用户设置服务持久化配置。
- 通过官方 `theme.overrideTokens()` 与明暗主题组合；禁用或卸载插件时完整恢复原主题。
- 避免全局关系选择器与固定背景在流式输出期间触发高成本重绘。
- 可选在当前 DSH 会话开始新一轮思考时，用新标签页打开抖音或哔哩哔哩网页版，当前 DSH 页面保持不变。

## 安装

发布到 npm 后：

```sh
dsh plugin --profile web add dsh-liquid-glass-ui
```

本地开发安装：

```sh
pnpm install
pnpm run check
dsh plugin --profile web add .
```

Windows 上的 DSH `0.1.0-rc.7` 可能错误拆分包含空格的本地绝对路径。使用 `add .` 时请把仓库放在不含空格的路径，或者先打包，再从不含空格的临时路径安装 `.tgz`；通过 npm 包名安装不受影响。

重启 `dsh web`，打开 **设置 → 插件 → 液态玻璃外观**。

## 发布并进入插件市场发现范围

DeepSeek Harness 的社区插件发现依赖可安装的 npm/GitHub 包，以及 GitHub 的 `dsh-plugin` topic。正式发布前需要：

1. 在 `package.json` 中补充最终的 `author`、`repository`、`bugs` 和 `homepage`。
2. 创建公开 GitHub 仓库，并添加 `dsh-plugin`、`deepseek-harness`、`dsh`、`theme`、`glassmorphism` topics。
3. 运行 `pnpm run check`，检查 dry-run 包内容。
4. 执行 `pnpm publish --access public`。
5. 在全新的 DSH Web profile 中验证安装。

插件把 DSH `0.1.0-rc.7` 设为最低兼容版本，因为它使用了该预览版本线提供的浏览器主题覆盖服务。

## 安全与隐私

- 远程背景 URL 由浏览器直接请求，图片服务商可能获得 DSH 用户的 IP 地址。
- 本地图片只会以 data URL 保存在 DSH 设置文档中，插件不会把图片上传到第三方服务。
- 思考跳转默认关闭；启用后，所选娱乐平台会收到一次普通浏览器访问及其常规网络信息。浏览器必须允许 DSH 站点弹出窗口。
- 共用设备上不要选择敏感图片，并遵守当前 DSH 设置存储的访问控制规则。

## 开源协议

MIT
