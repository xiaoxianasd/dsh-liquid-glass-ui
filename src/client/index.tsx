/** Web client half of the Liquid Glass bundle. */
import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import {
  APPEARANCE_NAMESPACE,
  BACKGROUND_SIZES,
  DEFAULT_CONFIG,
  MAX_IMAGE_BYTES,
  resolveConfig,
  type BackgroundSize,
  type Config,
} from '../shared.js'
import { createAppearance, cssImageValue } from '../appearance.js'
import { STYLE } from './styles.js'

interface SettingsFace { scope: SettingsScope<Config> }
type SettingsCardProps = PropsRuntime<'settings.plugin.item'> & InjectFace<SettingsFace>

const BODY_PROPERTIES = [
  '--dsh-lg-image',
  '--dsh-lg-size',
  '--dsh-lg-position',
  '--dsh-lg-blur',
  '--dsh-lg-saturation',
  '--dsh-lg-dim',
] as const

/** Required browser services. */
export const inject = ['slots', 'settingsScope', 'theme']

/** Mount global appearance state and its Settings > Plugins card. */
export function apply(ctx: Context): void {
  const scope = ctx.settingsScope.bind<Config>({ namespace: APPEARANCE_NAMESPACE as never })
  const theme = ctx.get('theme') as ThemeRuntime
  let disposeTokens: (() => void) | undefined

  const render = (): void => {
    disposeTokens?.()
    disposeTokens = undefined
    const appearance = createAppearance(scope.getSnapshot().value)
    const body = document.body
    if (!appearance.body.enabled) {
      body.removeAttribute('data-dsh-liquid-glass')
      body.removeAttribute('data-dsh-lg-backdrop')
      for (const property of BODY_PROPERTIES) body.style.removeProperty(property)
      return
    }
    body.setAttribute('data-dsh-liquid-glass', '')
    body.toggleAttribute('data-dsh-lg-backdrop', appearance.body.enableBackdropBlur)
    body.style.setProperty('--dsh-lg-image', appearance.body.image)
    body.style.setProperty('--dsh-lg-size', appearance.body.size)
    body.style.setProperty('--dsh-lg-position', appearance.body.position)
    body.style.setProperty('--dsh-lg-blur', appearance.body.blur)
    body.style.setProperty('--dsh-lg-saturation', appearance.body.saturation)
    body.style.setProperty('--dsh-lg-dim', appearance.body.dim)
    disposeTokens = theme.overrideTokens('dsh-liquid-glass-ui', appearance.tokens)
  }

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-liquid-glass-ui'
    style.textContent = STYLE
    document.head.appendChild(style)
    render()
    const unsubscribe = scope.subscribe(render)
    return () => {
      unsubscribe()
      disposeTokens?.()
      document.body.removeAttribute('data-dsh-liquid-glass')
      document.body.removeAttribute('data-dsh-lg-backdrop')
      for (const property of BODY_PROPERTIES) document.body.style.removeProperty(property)
      style.remove()
    }
  }, 'dsh-liquid-glass-ui: appearance')

  const register = ctx.slots.register.bind(ctx.slots) as unknown as (options: object, component: unknown) => () => void
  ctx.slots.inject('settings.plugin.item', () => register({
    name: 'settings.plugin.item',
    key: APPEARANCE_NAMESPACE,
    id: APPEARANCE_NAMESPACE,
    inject: (): SettingsFace => ({ scope }),
  }, LiquidGlassSettingsCard))
}

/** Settings card for background selection and glass rendering controls. */
export function LiquidGlassSettingsCard(props: SettingsCardProps) {
  const [open, setOpen] = useState(false)
  const [snapshot, setSnapshot] = useState(() => props.scope.getSnapshot())
  const [draft, setDraft] = useState(() => resolveConfig(snapshot.value))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => props.scope.subscribe(() => { setSnapshot(props.scope.getSnapshot()) }), [props.scope])
  useEffect(() => { setDraft(resolveConfig(snapshot.value)) }, [snapshot])

  const previewStyle = useMemo(() => ({
    '--dsh-lg-preview-image': cssImageValue(draft.backgroundImage),
    '--dsh-lg-preview-size': draft.backgroundSize,
    '--dsh-lg-preview-position': draft.backgroundPosition,
    '--dsh-lg-preview-opacity': String(draft.surfaceOpacity),
    '--dsh-lg-preview-blur': `${String(draft.blur)}px`,
    '--dsh-lg-preview-saturation': String(draft.saturation),
  }) as CSSProperties, [draft])

  const update = <K extends keyof Required<Config>>(key: K, value: Required<Config>[K]): void => {
    setDraft(current => ({ ...current, [key]: value }))
    setMessage('')
  }

  const onFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) return
    if (!file.type.startsWith('image/')) { setMessage('请选择图片文件。'); return }
    if (file.size > MAX_IMAGE_BYTES) { setMessage('图片不能超过 4 MB；建议先压缩后再上传。'); return }
    try {
      const dataURL = await readDataURL(file)
      update('backgroundImage', dataURL)
      setMessage(`已载入 ${file.name}，点击保存后生效。`)
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    }
  }

  const save = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await props.scope.set('enabled', draft.enabled)
      await props.scope.set('enableBackdropBlur', draft.enableBackdropBlur)
      await props.scope.set('backgroundImage', draft.backgroundImage.trim())
      await props.scope.set('backgroundSize', draft.backgroundSize)
      await props.scope.set('backgroundPosition', draft.backgroundPosition.trim() || DEFAULT_CONFIG.backgroundPosition)
      await props.scope.set('surfaceOpacity', draft.surfaceOpacity)
      await props.scope.set('blur', draft.blur)
      await props.scope.set('saturation', draft.saturation)
      await props.scope.set('backgroundDim', draft.backgroundDim)
      setMessage('外观已保存并实时应用。')
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }

  const reset = (): void => {
    setDraft({ ...DEFAULT_CONFIG })
    setMessage('已恢复默认预览，点击保存后生效。')
  }

  return (
    <li className="dsh-lg-card">
      <button type="button" className="dsh-lg-head" aria-expanded={open} onClick={() => { setOpen(value => !value) }}>
        <span><span className="dsh-lg-title">液态玻璃外观</span><span className="dsh-lg-desc">自定义背景与 UI 透明度，营造 iOS 风格玻璃质感。</span></span>
        <span aria-hidden="true">{open ? '⌃' : '⌄'}</span>
      </button>
      {open ? <form className="dsh-lg-body" onSubmit={(event) => { void save(event) }}>
        <label className="dsh-lg-switch"><span><span className="dsh-lg-label">启用液态玻璃</span><span className="dsh-lg-desc">关闭后立即恢复 DSH 原始主题。</span></span><input type="checkbox" checked={draft.enabled} onChange={event => { update('enabled', event.target.checked) }} /></label>

        <div className="dsh-lg-preview" data-dsh-lg-backdrop={draft.enableBackdropBlur ? '' : undefined} style={previewStyle} aria-label="玻璃效果预览"><div className="dsh-lg-preview-glass">Liquid Glass · 实时预览</div></div>

        <label className="dsh-lg-field"><span className="dsh-lg-label">背景图片 URL</span><input className="dsh-lg-input" type="text" value={draft.backgroundImage.startsWith('data:') ? '' : draft.backgroundImage} placeholder={draft.backgroundImage.startsWith('data:') ? '已使用本地图片' : 'https://example.com/background.jpg'} onChange={event => { update('backgroundImage', event.target.value) }} /><span className="dsh-lg-hint">支持 http(s) URL；远程服务器需允许浏览器加载该图片。</span></label>

        <div className="dsh-lg-field"><span className="dsh-lg-label">或上传本地图片</span><div className="dsh-lg-upload"><input className="dsh-lg-file" type="file" accept="image/*" onChange={(event) => { void onFile(event) }} /><button type="button" className="dsh-lg-btn" disabled={draft.backgroundImage.length === 0} onClick={() => { update('backgroundImage', '') }}>移除背景</button></div><span className="dsh-lg-hint">图片会作为 data URL 保存在 DSH 用户设置中，大小上限 4 MB。</span></div>

        <label className="dsh-lg-field"><span className="dsh-lg-label-row"><span className="dsh-lg-label">玻璃不透明度</span><span className="dsh-lg-value">{Math.round(draft.surfaceOpacity * 100)}%</span></span><input className="dsh-lg-range" type="range" min="0.05" max="0.95" step="0.01" value={draft.surfaceOpacity} onChange={event => { update('surfaceOpacity', Number(event.target.value)) }} /><span className="dsh-lg-hint">数值越低越透明，文字可读性也会相应降低。</span></label>

        <label className="dsh-lg-switch"><span><span className="dsh-lg-label">高质量实时模糊</span><span className="dsh-lg-desc">默认关闭以保持流畅；开启后仅模糊弹窗和菜单，可能增加 GPU 占用。</span></span><input type="checkbox" checked={draft.enableBackdropBlur} onChange={event => { update('enableBackdropBlur', event.target.checked) }} /></label>

        <label className="dsh-lg-field"><span className="dsh-lg-label-row"><span className="dsh-lg-label">背景模糊</span><span className="dsh-lg-value">{draft.blur}px</span></span><input className="dsh-lg-range" type="range" min="0" max="32" step="1" value={Math.min(draft.blur, 32)} disabled={!draft.enableBackdropBlur} onChange={event => { update('blur', Number(event.target.value)) }} /><span className="dsh-lg-hint">仅在开启“高质量实时模糊”时生效。</span></label>

        <label className="dsh-lg-field"><span className="dsh-lg-label-row"><span className="dsh-lg-label">色彩饱和度</span><span className="dsh-lg-value">{Math.round(draft.saturation * 100)}%</span></span><input className="dsh-lg-range" type="range" min="0.5" max="2" step="0.05" value={draft.saturation} disabled={!draft.enableBackdropBlur} onChange={event => { update('saturation', Number(event.target.value)) }} /></label>

        <label className="dsh-lg-field"><span className="dsh-lg-label-row"><span className="dsh-lg-label">背景暗化</span><span className="dsh-lg-value">{Math.round(draft.backgroundDim * 100)}%</span></span><input className="dsh-lg-range" type="range" min="0" max="0.7" step="0.01" value={draft.backgroundDim} onChange={event => { update('backgroundDim', Number(event.target.value)) }} /></label>

        <label className="dsh-lg-field"><span className="dsh-lg-label">背景尺寸</span><select className="dsh-lg-input" value={draft.backgroundSize} onChange={event => { update('backgroundSize', event.target.value as BackgroundSize) }}>{BACKGROUND_SIZES.map(size => <option key={size} value={size}>{size}</option>)}</select></label>

        <label className="dsh-lg-field"><span className="dsh-lg-label">背景位置</span><input className="dsh-lg-input" value={draft.backgroundPosition} placeholder="center center" onChange={event => { update('backgroundPosition', event.target.value) }} /><span className="dsh-lg-hint">使用 CSS background-position，例如 center center、left top 或 50% 30%。</span></label>

        <div className="dsh-lg-actions"><span className="dsh-lg-status" role="status">{message}</span><div className="dsh-lg-buttons"><button type="button" className="dsh-lg-btn" onClick={reset}>恢复默认</button><button type="submit" className="dsh-lg-btn dsh-lg-btn-primary" disabled={saving || !snapshot.writable}>{saving ? '保存中…' : '保存并应用'}</button></div></div>
      </form> : null}
    </li>
  )
}

function readDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('无法读取图片。'))
    }, { once: true })
    reader.addEventListener('error', () => { reject(reader.error ?? new Error('无法读取图片。')) }, { once: true })
    reader.readAsDataURL(file)
  })
}
