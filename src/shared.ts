/** JSON-safe settings values shared by the Host and browser bundles. */

/** Plugin settings namespace shown in Settings > Plugins. */
export const APPEARANCE_NAMESPACE = 'liquid-glass-ui'

/** Maximum local image size accepted by the settings UI. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024

/** Background sizing modes supported by CSS. */
export const BACKGROUND_SIZES = ['cover', 'contain', 'auto'] as const
export type BackgroundSize = typeof BACKGROUND_SIZES[number]

/** User-configurable glass appearance. */
export interface Config {
  enabled?: boolean
  enableBackdropBlur?: boolean
  backgroundImage?: string
  backgroundSize?: BackgroundSize
  backgroundPosition?: string
  surfaceOpacity?: number
  blur?: number
  saturation?: number
  backgroundDim?: number
}

/** Stable defaults used by the schema, settings form, and tests. */
export const DEFAULT_CONFIG = Object.freeze({
  enabled: true,
  enableBackdropBlur: false,
  backgroundImage: '',
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center center',
  surfaceOpacity: 0.24,
  blur: 10,
  saturation: 1.35,
  backgroundDim: 0.18,
})

/** Return a complete settings object without hidden client-side defaults. */
export function resolveConfig(config: Config | undefined): Required<Config> {
  return {
    enabled: config?.enabled ?? DEFAULT_CONFIG.enabled,
    enableBackdropBlur: config?.enableBackdropBlur ?? DEFAULT_CONFIG.enableBackdropBlur,
    backgroundImage: config?.backgroundImage ?? DEFAULT_CONFIG.backgroundImage,
    backgroundSize: config?.backgroundSize ?? DEFAULT_CONFIG.backgroundSize,
    backgroundPosition: config?.backgroundPosition ?? DEFAULT_CONFIG.backgroundPosition,
    surfaceOpacity: config?.surfaceOpacity ?? DEFAULT_CONFIG.surfaceOpacity,
    blur: config?.blur ?? DEFAULT_CONFIG.blur,
    saturation: config?.saturation ?? DEFAULT_CONFIG.saturation,
    backgroundDim: config?.backgroundDim ?? DEFAULT_CONFIG.backgroundDim,
  }
}
