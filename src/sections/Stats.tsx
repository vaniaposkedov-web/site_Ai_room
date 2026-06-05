import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '$2.4B', sub: 'ARR клиентов под управлением', desc: 'Суммарная выручка компаний, с которыми работает AIROOM' },
  { value: '+340%', sub: 'лучший результат по конверсии', desc: 'Рекорд кейса с маркетплейс-брендом за 3 месяца работы' },
  { value: '34', sub: 'e-commerce бренда', desc: 'От нишевых D2C до федеральных ритейл-сетей' },
  { value: '4.4×', sub: 'средний ROAS по портфелю', desc: 'Средний возврат на рекламные инвестиции за последние 12 мес.' },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="stats" ref={ref} className="py-20 px-6 bg-[#1e1e1e]">
      <div className="max-w-screen-xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
        {stats.map(({ value, sub, desc }, i) => (
          <motion.div key={value}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .55, delay: i * .1 }}
            className="bg-[#1e1e1e] p-8 group hover:bg-[#232323] transition-colors"
          >
            <div className="font-display font-black text-5xl ty mb-3 leading-none">{value}</div>
            <div className="text-sm font-semibold text-white mb-2">{sub}</div>
            <div className="text-xs text-white/35 leading-relaxed">{desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
