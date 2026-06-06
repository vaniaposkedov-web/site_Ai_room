import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react'

/* 3 варианта обработки, раскрываются по клику на категорию */
const CONCEPTS = [
  { label: 'Студия', tint: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent 60%)' },
  { label: 'Интерьер', tint: 'linear-gradient(to top, rgba(56,28,110,0.4), transparent 60%)' },
  { label: 'Lifestyle', tint: 'linear-gradient(to top, rgba(255,225,53,0.16), transparent 60%)' },
]

/* ─────────────────────────────────
   Data
───────────────────────────────── */
interface Category {
  id: string
  label: string
  bgText: string
  hint: string
  img: string
}

const CATEGORIES: Category[] = [
  {
    id: 'clothing',
    label: 'Одежда',
    bgText: 'WARDROBE',
    hint: '12 концепций · студия / интерьер / lookbook',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'jewelry',
    label: 'Ювелирные украшения',
    bgText: 'JEWELRY',
    hint: 'Макро · мрамор · бархатные подложки',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'shoes',
    label: 'Обувь',
    bgText: 'SNEAKERS',
    hint: '360° вращение · 4 ракурса в одном клике',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'drinks',
    label: 'Напитки',
    bgText: 'TEA · COFFEE',
    hint: 'Парящие капли · дымка · подача в кадре',
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'pets',
    label: 'Зоотовары',
    bgText: 'PET CARE',
    hint: 'Лайфстайл-сцены с животными — без съёмки',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'electronics',
    label: 'Электроника',
    bgText: 'GADGETS',
    hint: 'Тёмный фон · подсветка экрана · детализация',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=720&q=80',
  },
]

/* ─────────────────────────────────
   Single category card
───────────────────────────────── */
function CategoryCard({ category, index, onExpand }: { category: Category; index: number; onExpand: (c: Category) => void }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="relative flex-shrink-0 w-[260px] sm:w-[300px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Radial glow halo behind card */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: hover ? 1 : 0, scale: hover ? 1.1 : 0.85 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[60%] bg-[#FFE135]/30 rounded-full blur-3xl" />
      </motion.div>

      <motion.button
        onClick={() => onExpand(category)}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="block w-full text-left relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#141414] border border-white/[0.06] group"
      >
        {/* Image */}
        <motion.img
          src={category.img}
          alt={category.label}
          loading="lazy"
          initial={false}
          animate={{ scale: hover ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/35 to-[#0a0a0a]/55" />

        {/* Large semi-transparent background label */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.span
            initial={false}
            animate={{
              opacity: hover ? 0.18 : 0.08,
              letterSpacing: hover ? '0.02em' : '-0.01em',
            }}
            transition={{ duration: 0.5 }}
            className="font-display font-black text-white whitespace-nowrap select-none"
            style={{ fontSize: 'clamp(56px, 14vw, 140px)', lineHeight: 1 }}
          >
            {category.bgText}
          </motion.span>
        </div>

        {/* Top badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFE135]" />
          <span className="text-[9px] uppercase tracking-widest font-mono text-white/70">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Arrow indicator */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: hover ? '#FFE135' : 'rgba(26,26,26,0.7)',
            color: hover ? '#262626' : '#FFE135',
            rotate: hover ? 0 : -45,
          }}
          transition={{ duration: 0.35 }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center"
        >
          <ArrowUpRight size={15} strokeWidth={2.5} />
        </motion.div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="font-display font-black text-white text-xl leading-tight tracking-tight">
            {category.label}
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: hover ? 1 : 0.55, y: hover ? 0 : 2 }}
            className="text-[11px] text-white/55 mt-1.5 leading-snug"
          >
            {category.hint}
          </motion.div>

          {/* Active glow underline */}
          <motion.div
            initial={false}
            animate={{ scaleX: hover ? 1 : 0.18, opacity: hover ? 1 : 0.45 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-px mt-4 bg-[#FFE135] origin-left"
            style={{ boxShadow: '0 0 12px rgba(255,225,53,0.6)' }}
          />
        </div>
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function CategoriesGrid() {
  const trackRef = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const pausedRef = useRef(false)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const [expanded, setExpanded] = useState<Category | null>(null)

  // Пауза карусели и блокировка прокрутки, пока открыта раскрытая карточка
  useEffect(() => {
    pausedRef.current = !!expanded
    document.body.style.overflow = expanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  // Smooth GPU transform-based marquee (right → left). scrollLeft is janky,
  // translate3d is buttery.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    let last = performance.now()
    const SPEED = 55 // px / sec

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (!pausedRef.current) offset.current += SPEED * dt
      const half = track.scrollWidth / 2
      if (half > 0) {
        if (offset.current >= half) offset.current -= half
        else if (offset.current < 0) offset.current += half
      }
      track.style.transform = `translate3d(${-offset.current}px,0,0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Arrow nudge — smooth eased tween, then resume auto-scroll
  const tweenBy = (dx: number) => {
    pausedRef.current = true
    const start = offset.current
    const target = start + dx
    const t0 = performance.now()
    const dur = 500
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      const ease = 1 - Math.pow(1 - k, 3)
      offset.current = start + (target - start) * ease
      if (k < 1) requestAnimationFrame(step)
      else setTimeout(() => (pausedRef.current = false), 500)
    }
    requestAnimationFrame(step)
  }

  // Duplicate the set so the loop is seamless
  const loop = [...CATEGORIES, ...CATEGORIES]

  return (
    <section id="categories" className="relative py-24 overflow-hidden">
      {/* CSS grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-10 right-10 w-[420px] h-[420px] rounded-full bg-[#FFE135]/[0.035] blur-3xl pointer-events-none" />

      {/* Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              className="badge mb-5"
            >
              <LayoutGrid size={11} />
              Категории товаров
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-black text-white tracking-tight max-w-[640px]"
            >
              Работаем со <span className="text-gradient">всеми нишами</span> — от одежды до электроники
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => tweenBy(-340)}
              aria-label="Назад"
              className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#FFE135]/40 hover:text-[#FFE135] text-white/55 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => tweenBy(340)}
              aria-label="Вперёд"
              className="w-11 h-11 rounded-full bg-[#FFE135] text-[#262626] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_24px_rgba(255,225,53,0.35)]"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Horizontal marquee */}
      <div
        className="relative z-10 overflow-hidden"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => { if (!expanded) pausedRef.current = false }}
      >
        {/* py даёт место для увеличения карточек, чтобы они не обрезались */}
        <div
          ref={trackRef}
          className="flex gap-5 w-max px-6 py-10 will-change-transform"
        >
          {loop.map((cat, i) => (
            <CategoryCard key={`${cat.id}-${i}`} category={cat} index={i} onExpand={setExpanded} />
          ))}
        </div>

        {/* Edge fade — left/right */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#262626] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#262626] to-transparent" />
      </div>

      {/* Expanded category — раскрытие с 3 под-карточками */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setExpanded(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/[0.08] bg-[#1A1A1A] p-6 shadow-2xl"
            >
              <button
                onClick={() => setExpanded(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Закрыть"
              >
                <X size={17} />
              </button>

              <div className="badge mb-3">
                <LayoutGrid size={11} /> {expanded.label}
              </div>
              <h3 className="font-display font-black text-2xl text-white mb-1">{expanded.label}</h3>
              <p className="text-white/40 text-sm mb-5">3 варианта обработки — листайте карточки →</p>

              <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1">
                {CONCEPTS.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: 36, rotate: 5, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                    transition={{ delay: 0.08 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    className="snap-center shrink-0 w-[220px] sm:w-[250px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#141414]"
                  >
                    <div className="relative aspect-[3/4]">
                      <img src={expanded.img} alt={c.label} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: c.tint }} />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#FFE135] text-[#262626] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                        {c.label}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
                        <div className="font-display font-bold text-white text-sm leading-tight">
                          {expanded.label} · {c.label}
                        </div>
                        <div className="text-[10px] text-white/50 mt-0.5">Готовый кадр для карточки</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
