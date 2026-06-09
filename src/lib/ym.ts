/* Яндекс.Метрика — инициализация по ID (из настроек админки) */
type YmWindow = Window & { ym?: (...args: unknown[]) => void; __ymId?: string }

export function initYandexMetrika(id: string) {
  if (!id || typeof window === 'undefined') return
  const w = window as YmWindow
  if (w.__ymId === id) return
  w.__ymId = id

  // стандартный счётчик
  ;(function (m: YmWindow, e: Document, t: string, r: string) {
    if (m.ym) return
    const ym = function (...args: unknown[]) {
      ;(ym as unknown as { a: unknown[][] }).a = (ym as unknown as { a: unknown[][] }).a || []
      ;(ym as unknown as { a: unknown[][] }).a.push(args)
    }
    m.ym = ym
    const k = e.createElement(t) as HTMLScriptElement
    const a = e.getElementsByTagName(t)[0]
    k.async = true
    k.src = r
    a.parentNode?.insertBefore(k, a)
  })(w, document, 'script', 'https://mc.yandex.ru/metrika/tag.js')

  w.ym?.(Number(id), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true })
}

export function ymHit(url: string) {
  const w = window as YmWindow
  if (w.ym && w.__ymId) w.ym(Number(w.__ymId), 'hit', url)
}
