# Changelog

## 0.2.0

- Add an opt-in redirect when the current DSH session starts thinking.
- Let users choose Douyin or Bilibili as the destination.
- Detect the official current-session `running` edge and trigger once per turn.

## 0.1.2

- Remove backdrop blur, saturation filters, and the high-quality rendering toggle entirely.
- Simplify the page background from six paint layers to three static layers.
- Remove blur-related settings so every configuration follows the lightweight rendering path.

## 0.1.1

- Add an opt-in high-quality backdrop blur control.
- Default to lightweight alpha-composited glass for smoother streaming output.
- Remove the global `:has()` selector and fixed-background repaint path.
- Reduce the default blur from 24 px to 10 px and cap the settings slider at 32 px.

## 0.1.0

- Initial release with custom backgrounds and liquid-glass appearance controls.
