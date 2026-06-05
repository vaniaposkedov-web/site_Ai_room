import BrandMark from '@/components/BrandMark'

const words = ['Карточки для маркетплейсов', 'ИИ-обработка фото', 'ИИ-редизайн фото', 'Нейросеть',
  'Инфографика для карточек', 'Замена фона', 'Wildberries', 'Ozon', 'Продающие карточки', 'AI-фотосессия']

export default function Marquee() {
  const items = [...words, ...words]
  return (
    <div id="marquee" className="py-9 border-y border-white/[0.07] bg-[#1e1e1e] overflow-hidden">
      <div className="flex w-max animate-marquee select-none whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-5 mx-8 text-xl md:text-2xl font-bold text-white/90 tracking-wide align-middle shrink-0">
            <BrandMark size={20} className="text-brand-yellow shrink-0" />
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
