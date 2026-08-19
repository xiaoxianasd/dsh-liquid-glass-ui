# dsh-liquid-glass-ui

Custom backgrounds and iOS-inspired liquid glass transparency for the DeepSeek Harness Web UI.

[简体中文](README.zh-CN.md)

## Features

- Choose a remote background URL or upload a local image (stored as a data URL, up to 4 MB).
- Adjust glass opacity, background dimming, size, and position.
- Use lightweight alpha-composited glass everywhere, with no live blur or filter pipeline.
- Preview changes in the settings card before saving.
- Persist settings through the native DSH user-settings service.
- Compose with the native light/dark theme through `theme.overrideTokens()` and cleanly restore it when disabled or uninstalled.
- Avoid global relational selectors and fixed-background repainting during streaming output.

## Install

From npm after the package has been published:

```sh
dsh plugin --profile web add dsh-liquid-glass-ui
```

For local development:

```sh
pnpm install
pnpm run check
dsh plugin --profile web add .
```

On Windows, DSH `0.1.0-rc.7` may split a local absolute path when one of its directories contains a space. Clone this repository to a path without spaces for `add .`, or install the packed `.tgz` from a no-space temporary path. Registry installation is unaffected.

Restart `dsh web`, then open **Settings → Plugins → Liquid Glass Appearance**.

## Publishing and marketplace discovery

DeepSeek Harness discovers community plugins through installable npm/GitHub packages and the GitHub `dsh-plugin` topic. Before publishing:

1. Add the final `author`, `repository`, `bugs`, and `homepage` fields to `package.json`.
2. Create a public GitHub repository and add the topics `dsh-plugin`, `deepseek-harness`, `dsh`, `theme`, and `glassmorphism`.
3. Run `pnpm run check` and inspect the dry-run package contents.
4. Publish with `pnpm publish --access public`.
5. Verify installation in a clean DSH Web profile.

The package intentionally declares DSH `0.1.0-rc.7` as its minimum compatible release because it relies on the browser theme override service introduced in that preview line.

## Security and privacy

- A remote background URL is fetched directly by the browser and may disclose the DSH user's IP address to that image host.
- Local images stay in the DSH settings document as data URLs; the plugin does not upload them to an external service.
- Avoid sensitive images on shared machines, and follow the access controls of the configured DSH settings provider.

## License

MIT
