import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Upload, Wand2, LayoutGrid, FileText, Sparkles, CheckCircle2, Star, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ─────────────────────────────────
   Data
───────────────────────────────── */
interface StepData {
  num: string
  label: string
  title: string
  desc: string
  icon: LucideIcon
}

const STEPS: StepData[] = [
  { num: '01', label: 'Загрузка',   icon: Upload,     title: 'Загрузка фотографии', desc: 'Загрузите фото товара как есть — со стола, с вешалки или с телефона.' },
  { num: '02', label: 'Концепция',  icon: Wand2,      title: 'Выбор концепции',     desc: 'Студия, интерьер или lifestyle — нейросеть ставит фон, свет и сцену.' },
  { num: '03', label: 'Инфографика', icon: LayoutGrid, title: 'Добавить инфографику', desc: 'Ключевые преимущества и характеристики выносим прямо на фото.' },
  { num: '04', label: 'Описание',   icon: FileText,   title: 'Описание карточки товара', desc: 'AI пишет продающий заголовок и текст с SEO-ключами под маркетплейс.' },
]

const MOCK = {
  raw: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=720&q=80',
  studio: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=720&q=80',
  tags: ['Натуральная ткань', 'Лёгкая и дышащая', 'Размеры 40–52'],
  title: 'Летнее платье миди',
  price: '₽2 990',
  desc: 'Свободный крой из натуральной ткани — комфорт в жару и аккуратный силуэт. Идеально для прогулок и отдыха.',
}

/* ─────────────────────────────────
   Live card preview — builds up per step
───────────────────────────────── */
function CardPreview({ step }: { step: number }) {
  const showStudio = step >= 1 // step index 0-based: 0=raw, >=1 studio
  const showTags = step >= 2
  const showDesc = step >= 3

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-[#1A1A1A] shadow-2xl">
        {/* Image area */}
        <div className="relative aspect-[4/5] bg-[#141414] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={showStudio ? 'studio' : 'raw'}
              src={showStudio ? MOCK.studio : MOCK.raw}
              alt="preview"
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* RAW / AI tag */}
          <div className="absolute top-3 left-3">
            {showStudio ? (
              <span className="flex items-center gap-1 bg-[#FFE135] text-[#262626] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                <Sparkles size={10} strokeWidth={2.5} /> AI Studio
              </span>
            ) : (
              <span className="bg-black/55 backdrop-blur-md text-white/70 text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md">
                RAW · оригинал
              </span>
            )}
          </div>

          {/* Infographic chips */}
          <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1.5">
            <AnimatePresence>
              {showTags &&
                MOCK.tags.map((tag, i) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg w-fit"
                  >
                    <CheckCircle2 size={12} className="text-[#FFE135] flex-shrink-0" />
                    <span className="text-[11px] font-medium text-white leading-tight">{tag}</span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Description area */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {showDesc ? (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className="text-[#FFE135]" fill="#FFE135" />
                  ))}
                  <span className="text-[10px] text-white/35 ml-1">4.9 · 2 140 отзывов</span>
                </div>
                <div className="font-display font-bold text-white text-[15px] leading-snug">{MOCK.title}</div>
                <div className="text-lg font-display font-black text-[#FFE135] mt-0.5">{MOCK.price}</div>
                <p className="text-[11px] text-white/45 leading-relaxed mt-1.5">{MOCK.desc}</p>
              </motion.div>
            ) : (
              <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-2">
                <div className="h-3 rounded bg-white/[0.06] w-2/3" />
                <div className="h-3 rounded bg-white/[0.06] w-1/3" />
                <div className="h-2.5 rounded bg-white/[0.04] w-full" />
                <div className="h-2.5 rounded bg-white/[0.04] w-4/5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function StepShowcase() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [restartKey, setRestartKey] = useState(0)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, amount: 0.3 })

  // Автопоказ по умолчанию. Перезапускается, когда пользователь кликнул шаг
  // (restartKey) или когда блок снова попал в зону видимости (inView).
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2600)
    return () => clearInterval(id)
  }, [inView, restartKey])

  // клик по шагу — переходим к нему и перезапускаем таймер автопоказа
  const pick = (i: number) => {
    setActive(i)
    setRestartKey((k) => k + 1)
  }

  return (
    <section id="step-showcase" className="relative py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-32 left-0 w-[420px] h-[420px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge mx-auto mb-5"
          >
            <Sparkles size={11} />
            Как это работает
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Готовая карточка <span className="text-gradient">за 4 шага</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Нажимайте на шаги слева — справа карточка собирается в реальном времени.
          </motion.p>
        </div>

        {/* Stepper + preview */}
        <div className="grid lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-center">
          {/* Steps */}
          <div className="relative flex flex-col gap-4 lg:grid lg:grid-rows-4 lg:gap-0 lg:h-[600px]">
            {/* vertical track — only on desktop, ends at the last node (no tail) */}
            <div className="hidden lg:block absolute left-8 top-[12.5%] h-[75%] w-px bg-white/[0.08]" />
            <motion.div
              className="hidden lg:block absolute left-8 top-[12.5%] w-px bg-[#FFE135]"
              animate={{ height: `${(active / (STEPS.length - 1)) * 75}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = i === active
              const isDone = i < active
              return (
                <button
                  key={step.num}
                  onClick={() => pick(i)}
                  className="relative flex items-center gap-5 text-left group lg:h-full"
                >
                  {/* node */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive || isDone ? '#FFE135' : '#1A1A1A',
                      borderColor: isActive || isDone ? '#FFE135' : 'rgba(255,255,255,0.1)',
                      boxShadow: isActive ? '0 0 0 6px rgba(255,225,53,0.12)' : '0 0 0 0 transparent',
                    }}
                    className="relative z-10 w-16 h-16 rounded-full border flex items-center justify-center flex-shrink-0"
                  >
                    <Icon size={24} className={isActive || isDone ? 'text-[#262626]' : 'text-white/50'} strokeWidth={2.2} />
                  </motion.div>

                  {/* text */}
                  <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-45 group-hover:opacity-75'}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm text-[#FFE135]">{step.num}</span>
                      <span className="font-display font-bold text-white text-lg md:text-xl">{step.title}</span>
                    </div>
                    <p className="text-white/45 text-[14px] leading-relaxed mt-2 max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            <CardPreview step={active} />
          </div>
        </div>

        {/* CTA — попробовать */}
        <div className="flex justify-center mt-12">
          <motion.button
            onClick={() => navigate('/app')}
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,225,53,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="font-display font-bold text-base px-8 py-4 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2.5 transition-shadow"
          >
            Попробовать бесплатно
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
