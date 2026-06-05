import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowUpRight, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Launch',
    price: '₽180K',
    period: '/ месяц',
    note: 'Старт за 2 недели',
    desc: 'Для брендов с выручкой до ₽500M/год',
    cta: 'Начать',
    highlight: false,
    features: [
      '1 AI-направление на выбор',
      'Команда: DS + PM + аналитик',
      'Базовые дашборды',
      'Еженедельные отчёты',
      'Email и Slack поддержка',
      'SLA 48 часов',
    ],
    limit: false,
  },
  {
    name: 'Scale',
    price: '₽480K',
    period: '/ месяц',
    note: 'Популярный выбор',
    desc: 'Для брендов ₽500M–₽5B/год',
    cta: 'Обсудить',
    highlight: true,
    features: [
      '3 AI-направления',
      'Команда: 2 DS + ML Eng + PM',
      'Расширенная аналитика',
      'Дашборды real-time',
      'Выделенный Slack-канал',
      'SLA 4 часа',
      'Ежеквартальный Strategy Review',
    ],
    limit: false,
  },
  {
    name: 'Enterprise',
    price: 'Индивид.',
    period: '',
    note: 'Полная экосистема',
    desc: 'Для федеральных ритейлеров и маркетплейсов',
    cta: 'Связаться',
    highlight: false,
    features: [
      'Все AI-направления',
      'Выделенная команда 8+ чел.',
      'On-premise или Private Cloud',
      'Custom SLA и NDA',
      'Прямой доступ к CTO',
      'Quarterly Business Review',
      'M&A и Data Strategy сессии',
    ],
    limit: false,
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div ref={ref} className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="inline-flex pill mb-5">Тарифы</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
            className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Прозрачно.<br /><span className="ty">Без «звёздочек».</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .2 }}
            className="text-white/45 text-base max-w-md mx-auto">
            Всё включено: команда, инфраструктура, отчёты. Никаких скрытых costs.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map(({ name, price, period, note, desc, cta, highlight, features }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .5, delay: .1 + i * .1 }}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300
                ${highlight
                  ? 'bg-[#FFE135] text-[#262626] shadow-[0_0_60px_rgba(255,225,53,0.18)] scale-[1.02]'
                  : 'card hover:-translate-y-1 hover:border-[rgba(255,225,53,0.2)]'}`}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#262626] text-[#FFE135] text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap size={10} /> {note}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${highlight ? 'text-[#262626]/50' : 'text-white/30'}`}>
                  {!highlight && note}
                  {highlight && name}
                </div>
                {!highlight && <div className="font-display font-black text-xl text-white mb-1">{name}</div>}
                <div className={`text-xs mb-4 ${highlight ? 'text-[#262626]/60' : 'text-white/40'}`}>{desc}</div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-display font-black text-4xl ${highlight ? 'text-[#262626]' : 'text-white'}`}>{price}</span>
                  {period && <span className={`text-sm ${highlight ? 'text-[#262626]/50' : 'text-white/35'}`}>{period}</span>}
                </div>
              </div>

              {/* CTA */}
              <button className={`btn w-full justify-center mb-7 text-sm py-3
                ${highlight ? 'bg-[#262626] text-[#FFE135] hover:bg-[#1a1a1a]' : 'btn-ghost'}`}>
                {cta} <ArrowUpRight size={15} />
              </button>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className={`shrink-0 mt-0.5 ${highlight ? 'text-[#262626]/70' : 'text-[#FFE135]'}`} />
                    <span className={highlight ? 'text-[#262626]/75' : 'text-white/60'}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .6 }}
          className="text-center text-white/25 text-sm mt-10">
          Не знаете, с чего начать?{' '}
          <button className="text-[#FFE135] hover:underline">Запишитесь на бесплатный аудит данных →</button>
        </motion.p>
      </div>
    </section>
  )
}
