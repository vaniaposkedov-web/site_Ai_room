const words = ['AI Персонализация', 'Рост Конверсии', 'Контент-Автоматизация', 'AI Рекомендации',
  'ROAS Оптимизация', 'Retention AI', 'A/B Тестирование', 'Предикт Спроса']

export default function Marquee() {
  const items = [...words, ...words]
  return (
    <div className="py-5 border-y border-white/[0.07] bg-[#1e1e1e] overflow-hidden">
      <div className="marquee-track anim-marquee select-none">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-6 text-sm font-semibold text-white/30 tracking-wide">
            <span className="w-1 h-1 rounded-full bg-[#FFE135]/50" />
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
