import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { useModal } from '@/components/ModalProvider'

/* ─────────────────────────────────
   Pricing plans for card generation
───────────────────────────────── */
interface Plan {
  id: string
  name: string
  price: string
  unit: string
  tagline: string
  features: string[]
  cta: string
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'start',
    name: 'Старт',
    price: '1 490 ₽',
    unit: '/ месяц',
    tagline: 'Для небольшого магазина',
    features: [
      '30 карточек в месяц',
      'Чистый фон и свет',
      'Базовая ретушь',
      'Форматы под WB и Ozon',
      'Выгрузка в 4K',
    ],
    cta: 'Попробовать',
  },
  {
    id: 'business',
    name: 'Бизнес',
    price: '4 900 ₽',
    unit: '/ месяц',
    tagline: 'Для растущего бренда',
    features: [
      '120 карточек в месяц',
      'Всё из тарифа «Старт»',
      'Инфографика на фото',
      'AI-описания с SEO',
      'Lifestyle-сцены',
      'Приоритетная обработка',
    ],
    cta: 'Выбрать тариф',
    popular: true,
  },
  {
    id: 'studio',
    name: 'Студия',
    price: 'Индивидуально',
    unit: '',
    tagline: 'Для крупных каталогов',
    features: [
      'Безлимит карточек',
      'Всё из тарифа «Бизнес»',
      'Доступ по API',
      'Свои шаблоны и стиль',
      'Персональный менеджер',
    ],
    cta: 'Обсудить',
  },
]

export default function Plans() {
  const { openLead } = useModal()
  return (
    <section id="pricing" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="badge mx-auto mb-5">
            <Sparkles size={11} /> Тарифы
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Простые тарифы <span className="text-gradient">без сюрпризов</span>
          </h2>
          <p className="text-white/40 mt-5 max-w-md mx-auto">
            Первые 3 карточки — бесплатно. Платите только за результат, отмена в любой момент.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl p-7 flex flex-col ${
                plan.popular
                  ? 'bg-[#1A1A1A] border-2 border-[#FFE135]/60 md:-translate-y-3 shadow-[0_0_40px_rgba(255,225,53,0.12)]'
                  : 'bg-[#1A1A1A] border border-white/[0.08]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFE135] text-[#262626] text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Популярный
                </div>
              )}

              <div className="font-display font-bold text-white text-lg">{plan.name}</div>
              <div className="text-[12px] text-white/40 mb-5">{plan.tagline}</div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display font-black text-3xl text-white">{plan.price}</span>
                {plan.unit && <span className="text-sm text-white/35">{plan.unit}</span>}
              </div>

              <ul className="space-y-3 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-[#FFE135]/15 border border-[#FFE135]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-[#FFE135]" strokeWidth={3} />
                    </div>
                    <span className="text-[13px] text-white/70 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => openLead(plan.name)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-xl font-display font-bold flex items-center justify-center gap-2 transition-colors ${
                  plan.popular
                    ? 'bg-brand-yellow text-brand-dark'
                    : 'bg-white/[0.06] text-white border border-white/10 hover:border-[#FFE135]/40'
                }`}
              >
                {plan.cta}
                <ArrowRight size={17} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/25 mt-8">
          Нужен особый объём или интеграция? Напишите нам — соберём тариф под вас.
        </p>
      </div>
    </section>
  )
}
