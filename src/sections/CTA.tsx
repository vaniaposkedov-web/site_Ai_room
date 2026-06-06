import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useModal } from '@/components/ModalProvider'

const perks = ['Ответ в течение дня', 'Без обязательств', 'Покажем на вашем товаре']

export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { openLead } = useModal()

  return (
    <section id="cta" className="py-28 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30, scale: .97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: .7, ease: [.22, 1, .36, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: '#FFE135' }}
        >
          {/* Decorative large bg text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <span className="font-display font-black text-[22vw] text-[#262626]/[0.04] leading-none whitespace-nowrap">
              AIROOM
            </span>
          </div>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(38,38,38,.12) 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 text-center py-20 px-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
              className="text-[#262626]/50 text-sm font-semibold uppercase tracking-widest mb-5"
            >
              Готовы к росту?
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2 }}
              className="font-display font-black text-5xl lg:text-7xl text-[#262626] tracking-tight leading-[1.0] mb-6"
            >
              Карточки, которые<br />продают
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .28 }}
              className="text-[#262626]/60 text-lg max-w-lg mx-auto mb-10"
            >
              Оставьте e-mail — пришлём примеры готовых карточек, тарифы
              и ответим на вопросы.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .34 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
            >
              {/* Email input row */}
              <div className="flex gap-2 bg-[#262626] rounded-xl p-1.5 w-full max-w-md">
                <input
                  type="email"
                  placeholder="your@brand.ru"
                  className="flex-1 bg-transparent text-white text-sm px-4 py-2 outline-none placeholder:text-white/25"
                />
                <button
                  onClick={() => openLead()}
                  className="btn bg-[#FFE135] text-[#262626] text-sm px-5 py-2.5 shrink-0 group"
                  style={{ borderRadius: '10px' }}>
                  Отправить
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .44 }}
              className="flex items-center justify-center gap-6 flex-wrap"
            >
              {perks.map(p => (
                <span key={p} className="flex items-center gap-2 text-sm text-[#262626]/55">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#262626]/30" />
                  {p}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
