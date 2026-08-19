import { describe, expect, it } from 'vitest'
import { Config } from '../src/config.js'
import { DEFAULT_CONFIG, resolveConfig } from '../src/shared.js'
import { createAppearance, cssImageValue } from '../src/appearance.js'
import { STYLE } from '../src/client/styles.js'
import { createCurrentRunningEdgeTracker, entertainmentUrl, openEntertainmentPage } from '../src/client/auto-redirect.js'

describe('liquid glass configuration', () => {
  it('resolves stable defaults', () => {
    expect(resolveConfig(undefined)).toEqual(DEFAULT_CONFIG)
    expect(Config({})).toEqual(DEFAULT_CONFIG)
  })

  it('rejects visual values outside supported bounds', () => {
    expect(() => Config({ surfaceOpacity: 0 })).toThrow()
    expect(() => Config({ backgroundDim: 0.71 })).toThrow()
    expect(() => Config({ autoRedirectTarget: 'youtube' as never })).toThrow()
  })

  it('quotes image URLs as one CSS image', () => {
    expect(cssImageValue('')).toBe('none')
    expect(cssImageValue(' https://example.com/a b.jpg ')).toBe('url("https://example.com/a b.jpg")')
    expect(cssImageValue('https://example.com/a\"b.jpg')).toBe('url("https://example.com/a\\\"b.jpg")')
  })

  it('creates paired light and dark semantic token overrides', () => {
    const appearance = createAppearance({ surfaceOpacity: 0.3 })
    expect(appearance.tokens['--dsw-alias-bg-layer-1']).toEqual({
      light: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(17, 20, 27, 0.3)',
    })
    for (const token of Object.values(appearance.tokens)) {
      expect(token).toEqual({ light: expect.any(String), dark: expect.any(String) })
    }
  })

  it('does not ship expensive backdrop effects', () => {
    expect(STYLE).not.toContain(':has(')
    expect(STYLE).not.toContain('background-attachment: fixed')
    expect(STYLE).not.toContain('backdrop-filter')
    expect(STYLE).not.toContain('filter: blur')
  })

  it('detects one current-session running edge without selection false positives', () => {
    const tracker = createCurrentRunningEdgeTracker({ current: 'a', ids: ['a', 'b'], byId: { a: { running: false }, b: { running: true } } })
    expect(tracker({ current: 'a', ids: ['a', 'b'], byId: { a: { running: true }, b: { running: true } } })).toBe(true)
    expect(tracker({ current: 'a', ids: ['a', 'b'], byId: { a: { running: true }, b: { running: true } } })).toBe(false)
    expect(tracker({ current: 'b', ids: ['a', 'b'], byId: { a: { running: false }, b: { running: true } } })).toBe(false)
    expect(tracker({ current: 'b', ids: ['a', 'b'], byId: { a: { running: false }, b: { running: false } } })).toBe(false)
    expect(tracker({ current: 'b', ids: ['a', 'b'], byId: { a: { running: false }, b: { running: true } } })).toBe(true)
  })

  it('maps only supported entertainment targets', () => {
    expect(entertainmentUrl('douyin')).toBe('https://www.douyin.com/')
    expect(entertainmentUrl('bilibili')).toBe('https://www.bilibili.com/')
  })

  it('opens entertainment in a separate protected browser tab', () => {
    const calls: string[][] = []
    openEntertainmentPage('bilibili', (...args) => { calls.push(args) })
    expect(calls).toEqual([['https://www.bilibili.com/', '_blank', 'noopener,noreferrer']])
  })
})
