import { describe, expect, it } from 'vitest'
import { Config } from '../src/config.js'
import { DEFAULT_CONFIG, resolveConfig } from '../src/shared.js'
import { createAppearance, cssImageValue } from '../src/appearance.js'
import { STYLE } from '../src/client/styles.js'

describe('liquid glass configuration', () => {
  it('resolves stable defaults', () => {
    expect(resolveConfig(undefined)).toEqual(DEFAULT_CONFIG)
    expect(Config({})).toEqual(DEFAULT_CONFIG)
  })

  it('rejects visual values outside supported bounds', () => {
    expect(() => Config({ surfaceOpacity: 0 })).toThrow()
    expect(() => Config({ blur: 61 })).toThrow()
    expect(() => Config({ saturation: 2.1 })).toThrow()
    expect(() => Config({ backgroundDim: 0.71 })).toThrow()
  })

  it('quotes image URLs as one CSS image', () => {
    expect(cssImageValue('')).toBe('none')
    expect(cssImageValue(' https://example.com/a b.jpg ')).toBe('url("https://example.com/a b.jpg")')
    expect(cssImageValue('https://example.com/a\"b.jpg')).toBe('url("https://example.com/a\\\"b.jpg")')
  })

  it('creates paired light and dark semantic token overrides', () => {
    const appearance = createAppearance({ surfaceOpacity: 0.3, blur: 12, enableBackdropBlur: true })
    expect(appearance.body.blur).toBe('12px')
    expect(appearance.body.enableBackdropBlur).toBe(true)
    expect(appearance.tokens['--dsw-alias-bg-layer-1']).toEqual({
      light: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(17, 20, 27, 0.3)',
    })
    for (const token of Object.values(appearance.tokens)) {
      expect(token).toEqual({ light: expect.any(String), dark: expect.any(String) })
    }
  })

  it('keeps expensive backdrop effects opt-in', () => {
    expect(createAppearance(undefined).body.enableBackdropBlur).toBe(false)
    expect(STYLE).not.toContain(':has(')
    expect(STYLE).not.toContain('background-attachment: fixed')
    expect(STYLE).toContain('[data-dsh-lg-backdrop]')
  })
})
