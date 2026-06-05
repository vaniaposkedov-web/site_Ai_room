import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Sparkles, Wand2, Sun, Eraser, BadgeCheck, ArrowRight } from 'lucide-react'

/* ─────────────────────────────────
   Mock data — examples of photo upgrade
───────────────────────────────── */
interface Example {
  id: string
  label: string
  before: string
  after: string
}

const EXAMPLES: Example[] = [
  {
    id: 'sneakers',
    label: 'Кроссовки',
    before: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80',
    after: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'bag',
    label: 'Сумка',
    before: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=720&q=80',
    after: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'cosmetics',
    label: 'Косметика',
    before: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=720&q=80',
    after: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=720&q=80',
  },
]

const IMPROVEMENTS = [
  { icon: Eraser, title: 'Чистый фон', desc: 'Убираем фон и блики' },
  { icon: Sun, title: 'Свет и цвет', desc: 'Ровная экспозиция' },
  { icon: Wand2, title: 'Ретушь', desc: 'Дефекты и резкость' },
  { icon: BadgeCheck, title: 'Под маркетплейс', desc: 'Формат WB и Ozon' },
]

/* ─────────────────────────────────
   Before / After drag slider
───────────────────────────────── */
function BeforeAfter({ example, intro }: { example: Example; intro?: boolean }) {
  const [pos, setPos] = useState(50)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const userTouched = useRef(false)

  const applyPos = (clientX: number) => {
    if (!trackRef.current) return
    userTouched.current = true
    const { left, width } = trackRef.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)))
  }

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      applyPos(x)
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  // intro sweep: ползунок проезжает вправо-влево, пока пользователь не тронул
  useEffect(() => {
    if (!intro) return
    let raf = 0
    const t0 = performance.now()
    const dur = 1900
    const seq = (k: number) => {
      if (k < 0.34) return 50 + (84 - 50) * (k / 0.34)
      if (k < 0.67) return 84 + (16 - 84) * ((k - 0.34) / 0.33)
      return 16 + (50 - 16) * ((k - 0.67) / 0.33)
    }
    const step = (t: number) => {
      if (userTouched.current) return
      const k = Math.min(1, (t - t0) / dur)
      setPos(seq(k))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [intro])

  return (
    <div
      ref={trackRef}
      className="relative w-full h-full rounded-2xl overflow-hidden select-none border border-white/[0.08] bg-[#141414] cursor-ew-resize"
      onMouseDown={(e) => { dragging.current = true; applyPos(e.clientX) }}
      onTouchStart={(e) => { dragging.current = true; applyPos(e.touches[0].clientX) }}
    >
      {/* AFTER (full, behind) */}
      <img src={example.after} alt="После" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute top-3 right-3 bg-[#FFE135] text-[#262626] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md pointer-events-none">
        После
      </div>

      {/* BEFORE (clipped) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <img
          src={example.before}
          alt="До"
          className="absolute inset-0 h-full max-w-none object-cover"
          style={{ width: trackRef.current?.clientWidth ?? '100%' }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          До
        </div>
      </div>

      {/* Divider + handle */}
      <div className="absolute top-0 bottom-0 w-px bg-white/70 pointer-events-none z-10" style={{ left: `${pos}%` }} />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
          <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/45 backdrop-blur-md text-white/60 text-[10px] px-3 py-1 rounded-full pointer-events-none">
        Перетащите ползунок
      </div>
    </div>
  )
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '55%' : '-55%', opacity: 0, scale: 0.92 }),
  center: { x: '0%', opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-55%' : '55%', opacity: 0, scale: 0.92 }),
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function Solutions() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [restartKey, setRestartKey] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const example = EXAMPLES[index]

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.3 })

  // Сначала отыгрывает интро ползунка, потом включается смена фото
  useEffect(() => {
    if (!inView || introDone) return
    const t = setTimeout(() => setIntroDone(true), 2200)
    return () => clearTimeout(t)
  }, [inView, introDone])

  useEffect(() => {
    if (!inView || !introDone) return
    const id = setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % EXAMPLES.length)
    }, 5200)
    return () => clearInterval(id)
  }, [inView, introDone, restartKey])

  const pick = (i: number) => {
    setDir(i > index ? 1 : -1)
    setIndex(i)
    setRestartKey((k) => k + 1)
  }

  return (
    <section id="solutions" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-20 right-0 w-[420px] h-[420px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />

      <div ref={sectionRef} className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="badge mx-auto mb-4">
            <Sparkles size={11} />
            Обработка фото
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-tight">
            Из обычного фото — <span className="text-gradient">продающая карточка</span>
          </h2>
          <p className="text-white/40 mt-3 text-[15px]">
            Очищаем фон, выравниваем свет и готовим кадр под маркетплейс.
          </p>
        </motion.div>

        {/* Content rectangle */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 lg:h-[430px] items-stretch">
          {/* Slider with auto right-to-left slide */}
          <div className="relative w-full h-[340px] lg:h-full overflow-hidden rounded-2xl">
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={example.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <BeforeAfter example={example} intro={index === 0 && !introDone} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info panel — fills to match the slider height */}
          <div className="flex flex-col h-full justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/30 mb-2.5">
                Что делает нейросеть
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {IMPROVEMENTS.map((imp) => {
                  const Icon = imp.icon
                  return (
                    <div key={imp.title} className="glass-card p-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFE135]/15 border border-[#FFE135]/30 flex items-center justify-center mb-2">
                        <Icon size={15} className="text-[#FFE135]" />
                      </div>
                      <div className="font-display font-bold text-white text-[13px] mb-0.5">{imp.title}</div>
                      <div className="text-white/45 text-[11px] leading-snug">{imp.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div>
                <div className="font-display font-black text-xl text-[#FFE135]">~15 сек</div>
                <div className="text-[11px] text-white/35">на одно фото</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="font-display font-black text-xl text-[#FFE135]">4K</div>
                <div className="text-[11px] text-white/35">разрешение</div>
              </div>
            </div>

            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="font-display font-bold text-[15px] px-6 py-3 rounded-xl bg-brand-yellow text-brand-dark flex items-center justify-center gap-2.5"
            >
              Обработать своё фото
              <ArrowRight size={17} />
            </motion.button>

            {/* Product switcher — under the CTA */}
            <div className="flex gap-2.5">
              {EXAMPLES.map((ex, i) => {
                const isOn = i === index
                return (
                  <button
                    key={ex.id}
                    onClick={() => pick(i)}
                    className="relative flex-1 rounded-xl overflow-hidden aspect-[5/3] bg-[#141414] group"
                    aria-label={ex.label}
                  >
                    <img src={ex.after} alt={ex.label} className="w-full h-full object-cover" loading="lazy" />
                    <div className={`absolute inset-0 transition-colors ${isOn ? 'bg-black/0' : 'bg-black/50 group-hover:bg-black/25'}`} />
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none transition-shadow"
                      style={{ boxShadow: isOn ? 'inset 0 0 0 2px #FFE135' : 'inset 0 0 0 0 transparent' }}
                    />
                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white text-center truncate drop-shadow">
                      {ex.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
