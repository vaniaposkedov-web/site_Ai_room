import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'

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
function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [hover, setHover] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 w-[260px] sm:w-[300px] snap-start"
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

      <motion.a
        href={`#${category.id}`}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#141414] border border-white/[0.06] group"
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
      </motion.a>
    </motion.div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function CategoriesGrid() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const [paused, setPaused] = useState(false)

  // Endless auto-scroll — sets wrap to half (because list is duplicated)
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    let last = performance.now()
    const SPEED = 55 // px / sec

    const tick = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      if (!paused) {
        el.scrollLeft += SPEED * dt
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const scrollBy = (dx: number) => {
    const el = scrollerRef.current
    if (!el) return
    setPaused(true)
    el.scrollBy({ left: dx, behavior: 'smooth' })
    // resume auto-scroll after the user finishes
    window.clearTimeout((scrollBy as unknown as { _t?: number })._t)
    ;(scrollBy as unknown as { _t?: number })._t = window.setTimeout(() => setPaused(false), 1400)
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
              onClick={() => scrollBy(-340)}
              aria-label="Назад"
              className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#FFE135]/40 hover:text-[#FFE135] text-white/55 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(340)}
              aria-label="Вперёд"
              className="w-11 h-11 rounded-full bg-[#FFE135] text-[#262626] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_24px_rgba(255,225,53,0.35)]"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroller */}
      <div
        className="relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-6 px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2))] no-scrollbar"
        >
          {loop.map((cat, i) => (
            <CategoryCard key={`${cat.id}-${i}`} category={cat} index={i} />
          ))}
        </div>

        {/* Edge fade — left/right */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#262626] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#262626] to-transparent" />
      </div>
    </section>
  )
}
