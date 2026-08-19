/** Pure CSS values derived from one resolved appearance configuration. */
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
import type { Config } from './shared.js'
import { resolveConfig } from './shared.js'

/** CSS properties written directly to the body by this plugin. */
export interface BodyAppearance {
  enabled: boolean
  image: string
  size: string
  position: string
  dim: string
}

function alpha(value: number): string {
  return Number(value.toFixed(3)).toString()
}

/** Quote a user-selected image URL for use as a CSS image value. */
export function cssImageValue(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) return 'none'
  return `url(${JSON.stringify(trimmed)})`
}

/** Build body-level values and official DSH semantic token overrides. */
export function createAppearance(config: Config | undefined): {
  body: BodyAppearance
  tokens: ThemeTokenOverrides
} {
  const value = resolveConfig(config)
  const opacity = value.surfaceOpacity
  const elevated = Math.min(0.98, opacity + 0.12)
  const nested = Math.min(0.98, opacity + 0.2)
  const light = (a: number) => `rgba(255, 255, 255, ${alpha(a)})`
  const dark = (a: number) => `rgba(17, 20, 27, ${alpha(a)})`
  const modes = (lightValue: string, darkValue: string) => ({ light: lightValue, dark: darkValue })

  return {
    body: {
      enabled: value.enabled,
      image: cssImageValue(value.backgroundImage),
      size: value.backgroundSize,
      position: value.backgroundPosition,
      dim: alpha(value.backgroundDim),
    },
    tokens: {
      '--dsw-alias-bg-base': modes(light(opacity * 0.42), dark(opacity * 0.52)),
      '--dsw-alias-bg-layer-1': modes(light(opacity), dark(opacity)),
      '--dsw-alias-bg-layer-2': modes(light(elevated), dark(elevated)),
      '--dsw-alias-bg-layer-3': modes(light(nested), dark(nested)),
      '--dsw-alias-bg-overlay': modes(light(Math.min(0.98, nested + 0.08)), dark(Math.min(0.98, nested + 0.08))),
      '--dsw-alias-bg-module-platform': modes(light(opacity * 0.82), dark(opacity * 0.82)),
      '--dsw-specific-sidebar-fill': modes(light(opacity * 0.9), dark(opacity * 0.9)),
      '--dsw-specific-input-major': modes(light(elevated), dark(elevated)),
      '--dsw-specific-menu': modes(light(nested), dark(nested)),
      '--dsw-alias-button-elevated-fill': modes(light(elevated), dark(elevated)),
      '--dsw-alias-button-floating-fill': modes(light(nested), dark(nested)),
      '--dsw-alias-border-l1': modes('rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.16)'),
      '--dsw-alias-border-l2': modes('rgba(255, 255, 255, 0.42)', 'rgba(255, 255, 255, 0.22)'),
      '--dsw-alias-border-l3': modes('rgba(255, 255, 255, 0.56)', 'rgba(255, 255, 255, 0.3)'),
    },
  }
}
