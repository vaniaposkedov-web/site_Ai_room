import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  {
    quote: 'Через 4 месяца после запуска рекомендательного движка наш средний чек вырос на 28%, а возврат клиентов через 30 дней — на 19%. Это живые деньги, не метрика.',
    name: 'Дмитрий Назаров',
    title: 'VP Growth · Ozon',
    avatar: { bg: '#3B82F6', initials: 'ДН' },
    metric: '+28%',
    metricLabel: 'средний чек',
  },
  {
    quote: 'Команда AIROOM сразу заговорила языком бизнеса: CAC, LTV, unit economics. Никакого "машинного обучения ради машинного обучения". За 6 месяцев CAC снизился на 55%.',
    name: 'Юлия Семёнова',
    title: 'CMO · Wildberries',
    avatar: { bg: '#4ADE80', initials: 'ЮС' },
    metric: '−55%',
    metricLabel: 'CAC когорты',
  },
  {
    quote: 'Они не просто внедрили AI — они изменили, как мы думаем о данных. ROAS 4.4× — это не удача, это системная работа над сегментацией и ставками каждый день.',
    name: 'Николай Орлов',
    title: 'Performance Director · Lamoda',
    avatar: { bg: '#F472B6', initials: 'НО' },
    metric: '4.4×',
    metricLabel: 'ROAS',
  },
  {
    quote: 'Раньше поиск на нашем сайте был болью — клиенты не находили нужное. Сейчас семантический поиск от AIROOM даёт +87% CTR. Конкуренты спрашивают, как мы это сделали.',
    name: 'Антон Кириллов',
    title: 'CTO · СберМегаМаркет',
    avatar: { bg: '#A78BFA', initials: 'АК' },
    metric: '+87%',
    metricLabel: 'CTR поиска',
  },
]

const logos = ['Ozon', 'Wildberries', 'Lamoda', 'СберМегаМаркет', 'МВидео', 'Самокат', 'Tinkoff', 'ВкусВилл', 'Hoff', 'Leroy Merlin']

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [idx, setIdx] = useState(0)
  const r = reviews[idx]

  const prev = () => setIdx(i => (i - 1 + reviews.length) % reviews.length)
  const next = () => setIdx(i => (i + 1) % reviews.length)

  return (
    <section className="py-28 px-6 bg-[#1e1e1e]">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="inline-flex pill mb-5">
            Отзывы
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
            className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight">
            Говорят клиенты,<br /><span className="ty">не мы</span>
          </motion.h2>
        </div>

        {/* Quote block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2 }}>
          <div className="max-w-3xl mx-auto">
            {/* Big quotation mark */}
            <div className="font-display font-black text-[120px] leading-none ty opacity-20 h-16 mb-4 select-none">"</div>

            <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: .3 }}
              >
                <p className="text-2xl lg:text-3xl font-display font-semibold text-white/85 leading-snug mb-8">
                  {r.quote}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-sm"
                      style={{ background: `${r.avatar.bg}25`, border: `2px solid ${r.avatar.bg}50`, color: r.avatar.bg }}>
                      {r.avatar.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{r.name}</div>
                      <div className="text-sm text-white/40">{r.title}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-display font-black text-3xl ty">{r.metric}</div>
                    <div className="text-xs text-white/35">{r.metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            <div className="flex items-center gap-4 mt-10">
              <button onClick={prev}
                className="w-10 h-10 rounded-full card flex items-center justify-center text-white/40 hover:text-white hover:border-[rgba(255,225,53,0.3)] transition-all">
                <ChevronLeft size={17} />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-2 bg-[#FFE135]' : 'w-2 h-2 bg-white/15 hover:bg-white/30'}`} />
                ))}
              </div>
              <button onClick={next}
                className="w-10 h-10 rounded-full card flex items-center justify-center text-white/40 hover:text-white hover:border-[rgba(255,225,53,0.3)] transition-all">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Client logos */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .5 }}
          className="mt-20 pt-10 border-t border-white/[0.07]">
          <p className="text-center text-[10px] text-white/20 tracking-[.2em] uppercase mb-8">Нам доверяют</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {logos.map((l, i) => (
              <motion.span key={l}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: .5 + i * .04 }}
                className="font-display font-black text-sm text-white/12 hover:text-white/35 transition-colors cursor-default tracking-tight">
                {l}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
