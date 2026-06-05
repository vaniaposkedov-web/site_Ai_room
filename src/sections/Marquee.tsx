import BrandMark from '@/components/BrandMark'

const words = ['AI Персонализация', 'Рост Конверсии', 'Контент-Автоматизация', 'AI Рекомендации',
  'ROAS Оптимизация', 'Retention AI', 'A/B Тестирование', 'Предикт Спроса']

export default function Marquee() {
  const items = [...words, ...words]
  return (
    <div id="marquee" className="py-9 border-y border-white/[0.07] bg-[#1e1e1e] overflow-hidden">
      <div className="marquee-track anim-marquee select-none whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-5 mx-8 text-xl md:text-2xl font-bold text-white/90 tracking-wide align-middle">
            <BrandMark size={20} className="text-brand-yellow shrink-0" />
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
