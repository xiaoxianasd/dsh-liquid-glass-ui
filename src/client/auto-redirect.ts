import type { EntertainmentTarget } from '../shared.js'

/** Public web destinations used by the thinking redirect. */
export const ENTERTAINMENT_URLS: Readonly<Record<EntertainmentTarget, string>> = Object.freeze({
  douyin: 'https://www.douyin.com/',
  bilibili: 'https://www.bilibili.com/',
})

interface RunningSession {
  readonly running: boolean
}

/** Small projection of the official DSH session-list snapshot. */
export interface RunningSessionSnapshot {
  readonly current: string | undefined
  readonly ids: readonly string[]
  readonly byId: Readonly<Record<string, RunningSession>>
}

/** Resolve the configured destination without accepting arbitrary URLs. */
export function entertainmentUrl(target: EntertainmentTarget): string {
  return ENTERTAINMENT_URLS[target]
}

/** Open the selected site in a separate browser tab without exposing window.opener. */
export function openEntertainmentPage(
  target: EntertainmentTarget,
  openPage: (url: string, target: string, features: string) => unknown = (url, windowTarget, features) => window.open(url, windowTarget, features),
): void {
  openPage(entertainmentUrl(target), '_blank', 'noopener,noreferrer')
}

/**
 * Track official session running-state edges. Selection of an already-running
 * session does not count as a new thinking start.
 */
export function createCurrentRunningEdgeTracker(initial: RunningSessionSnapshot): (next: RunningSessionSnapshot) => boolean {
  const previous = new Map<string, boolean>()
  for (const id of initial.ids) previous.set(id, initial.byId[id]?.running ?? false)

  return (next) => {
    const currentId = next.current
    const currentRunning = currentId === undefined ? false : (next.byId[currentId]?.running ?? false)
    const started = currentId !== undefined && previous.get(currentId) === false && currentRunning

    const liveIds = new Set(next.ids)
    for (const id of previous.keys()) {
      if (!liveIds.has(id)) previous.delete(id)
    }
    for (const id of next.ids) previous.set(id, next.byId[id]?.running ?? false)
    return started
  }
}
