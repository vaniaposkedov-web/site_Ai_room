import { useEffect } from 'react'

/**
 * Следит за прокруткой и обновляет #хэш в адресной строке в зависимости от того,
 * какая секция сейчас в зоне видимости. Использует history.replaceState, поэтому
 * не засоряет историю браузера и не вызывает скачка/плавной прокрутки.
 *
 * @param ids — список id секций в порядке их следования на странице.
 */
export function useScrollSpy(ids: string[]) {
  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Видимость каждой секции: какую долю своей высоты она показывает.
    const ratios = new Map<string, number>()
    let current = ''

    const apply = () => {
      // Активной считаем самую видимую секцию (наибольшая доля в окне).
      let bestId = ''
      let bestRatio = 0
      for (const el of elements) {
        const r = ratios.get(el.id) ?? 0
        if (r > bestRatio) {
          bestRatio = r
          bestId = el.id
        }
      }

      // Самый верх страницы — без хэша (чтобы #hero не «прилипал» на загрузке).
      if (window.scrollY < 8) bestId = ''

      if (bestId === current) return
      current = bestId

      const newHash = bestId ? `#${bestId}` : ' '
      // replaceState не добавляет запись в историю и не двигает скролл.
      window.history.replaceState(null, '', bestId ? newHash : window.location.pathname + window.location.search)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        apply()
      },
      {
        // Сужаем «зону наблюдения»: верхние 80px перекрыты фикс-шапкой,
        // нижние 40% игнорируем, чтобы активной была секция в верхней части экрана.
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [ids])
}
