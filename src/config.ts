/** Host-side validation schema for durable appearance settings. */
import z from '@deepseek-ai/schemastery'
import { BACKGROUND_SIZES, DEFAULT_CONFIG, ENTERTAINMENT_TARGETS, type Config as ConfigValue } from './shared.js'

export * from './shared.js'

/** Cordis settings schema with bounds for every numeric visual control. */
export const Config: z<ConfigValue> = z.object({
  enabled: z.boolean().default(DEFAULT_CONFIG.enabled),
  autoRedirectEnabled: z.boolean().default(DEFAULT_CONFIG.autoRedirectEnabled),
  autoRedirectTarget: z.union(ENTERTAINMENT_TARGETS).default(DEFAULT_CONFIG.autoRedirectTarget),
  backgroundImage: z.string().default(DEFAULT_CONFIG.backgroundImage),
  backgroundSize: z.union(BACKGROUND_SIZES).default(DEFAULT_CONFIG.backgroundSize),
  backgroundPosition: z.string().default(DEFAULT_CONFIG.backgroundPosition),
  surfaceOpacity: z.number().min(0.05).max(0.95).default(DEFAULT_CONFIG.surfaceOpacity),
  backgroundDim: z.number().min(0).max(0.7).default(DEFAULT_CONFIG.backgroundDim),
})
