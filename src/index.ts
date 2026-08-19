/** Host half of the Liquid Glass bundle: owns its durable settings section. */
import type { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import { Config } from './config.js'
import { APPEARANCE_NAMESPACE, type Config as ConfigValue } from './shared.js'

export { Config } from './config.js'
export * from './shared.js'

/** Cordis plugin name. */
export const name = 'dsh-liquid-glass-ui'

/** Register the live settings namespace when the settings provider is present. */
export function apply(ctx: Context, config: ConfigValue = {}): void {
  installSettingsSection(
    ctx,
    settingsNamespace(APPEARANCE_NAMESPACE),
    Config,
    config,
    { setSource: () => {}, onChange: () => {} },
  )
}
