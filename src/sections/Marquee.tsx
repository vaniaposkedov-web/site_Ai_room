import BrandMark from '@/components/BrandMark'

const words = ['AI Персонализация', 'Рост Конверсии', 'Контент-Автоматизация', 'AI Рекомендации',
  'ROAS Оптимизация', 'Retention AI', 'A/B Тестирование', 'Предикт Спроса']

export default function Marquee() {
  const items = [...words, ...words]
  return (
    <div id="marquee" className="py-5 border-y border-white/[0.07] bg-[#1e1e1e] overflow-hidden">
      <div className="marquee-track anim-marquee select-none whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-6 text-sm font-semibold text-white/30 tracking-wide align-middle">
            <BrandMark size={13} className="text-brand-yellow/60 shrink-0" />
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
