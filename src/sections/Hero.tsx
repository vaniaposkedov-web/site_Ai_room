import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Zap, RefreshCw } from 'lucide-react'

/* ──────────────────────────────────
   Typing headline
────────────────────────────────── */
const headlines = ['E-commerce с AI-агентами', 'конверсию до 4.8%', 'рост ROI на 340%']
function TypewriterHeadline() {
  const [idx, setIdx]   = useState(0)
  const [text, setText] = useState('')
  const [del,  setDel]  = useState(false)
  useEffect(() => {
    const phrase = headlines[idx]
    let t: ReturnType<typeof setTimeout>
    if (!del && text.length < phrase.length)
      t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 60)
    else if (!del)
      t = setTimeout(() => setDel(true), 2400)
    else if (text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 32)
    else { setDel(false); setIdx(i => (i + 1) % headlines.length) }
    return () => clearTimeout(t)
  }, [text, del, idx])
  return (
    <span className="text-gradient">
      {text}
      <span className="inline-block w-[3px] h-[.85em] bg-brand-yellow ml-1 align-middle"
        style={{ animation: 'blink 0.9s step-end infinite' }} />
    </span>
  )
}

/* ──────────────────────────────────
   Product Simulator (Before / After)
────────────────────────────────── */
const BEFORE = {
  title:      'Куртка кожаная мужская',
  desc:       'Куртка из кожзама. Доступна в размерах 48-56.',
  price:      '₽4 990',
  conversion: 1.2,
  rating:     3.2,
  reviews:    47,
}
const AFTER = {
  title:      'Мужская куртка из экокожи — городской стиль',
  desc:       'Воплощение современного стиля: мягкая экокожа, утеплённая подкладка и безупречный крой. Создана для тех, кто уверен в каждом шаге.',
  price:      '₽4 990',
  conversion: 4.8,
  rating:     4.9,
  reviews:    2140,
}

function ProductSimulator() {
  const [activated, setActivated] = useState(false)
  const [typedDesc, setTypedDesc] = useState('')
  const [convValue, setConvValue] = useState(BEFORE.conversion)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clear = () => timerRef.current.forEach(clearTimeout)

  const activate = () => {
    setActivated(true)
    setTypedDesc('')
    setConvValue(BEFORE.conversion)

    // type description
    let i = 0
    const typeNext = () => {
      if (i <= AFTER.desc.length) {
        setTypedDesc(AFTER.desc.slice(0, i))
        i++
        const t = setTimeout(typeNext, 22)
        timerRef.current.push(t)
      }
    }
    const t1 = setTimeout(typeNext, 400)
    timerRef.current.push(t1)

    // animate conversion
    let c = BEFORE.conversion
    const step = (AFTER.conversion - BEFORE.conversion) / 60
    const tick = () => {
      c = parseFloat((c + step).toFixed(2))
      setConvValue(Math.min(c, AFTER.conversion))
      if (c < AFTER.conversion) {
        const t = setTimeout(tick, 28)
        timerRef.current.push(t)
      }
    }
    const t2 = setTimeout(tick, 600)
    timerRef.current.push(t2)
  }

  const reset = () => {
    clear()
    setActivated(false)
    setTypedDesc('')
    setConvValue(BEFORE.conversion)
  }

  useEffect(() => () => clear(), [])

  const current = activated ? AFTER : BEFORE

  return (
    <div className="w-full max-w-[460px] mx-auto relative">
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-3xl bg-brand-yellow/8 blur-3xl scale-110 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-brand-card shadow-2xl"
      >
        {/* Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-brand-surface border-b border-white/[0.05]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activated ? 'after' : 'before'}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-1.5 bg-[#1E1E1E] rounded-md px-3 py-1 text-[10px] text-white/35 font-mono"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: activated ? '#4ADE80' : '#F59E0B',
                    animation: 'pulse-ring 2s infinite',
                  }}
                />
                {activated ? 'AIROOM · Активирован ✦' : 'shop.example.ru · Стандартная карточка'}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Product card body */}
        <div className="p-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            {/* Product image */}
            <div className="relative rounded-xl overflow-hidden h-40">
              <AnimatePresence mode="wait">
                {!activated ? (
                  <motion.div
                    key="before-img"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)' }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-white/20">Стандартное фото</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="after-img"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #1a1233 0%, #2d1b69 35%, #111827 70%, #0f172a 100%)',
                    }}
                  >
                    {/* Studio art SVG placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-20 rounded-xl"
                          style={{
                            background: 'linear-gradient(145deg, #4f3a8a, #1e1040)',
                            boxShadow: '0 8px 32px rgba(79,58,138,0.5)',
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-yellow/80" />
                        <div className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-[#60A5FA]/70" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <span className="text-[9px] text-white/50 font-medium tracking-wider uppercase">AI Студия</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2 min-w-0">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={current.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="font-display font-bold text-sm text-white leading-snug"
                >
                  {current.title}
                </motion.h3>
              </AnimatePresence>

              <div className="text-lg font-bold text-brand-yellow font-display">{current.price}</div>

              {/* Description */}
              <div className="text-[11px] text-white/50 leading-relaxed min-h-[48px]">
                {activated ? (
                  <span>{typedDesc}{typedDesc.length < AFTER.desc.length && <span className="inline-block w-[2px] h-[10px] bg-brand-yellow ml-0.5 align-middle" style={{ animation: 'blink 0.8s step-end infinite' }} />}</span>
                ) : (
                  BEFORE.desc
                )}
              </div>

              {/* Rating */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activated ? 'after-r' : 'before-r'}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10}
                        className={s <= Math.round(current.rating) ? 'text-brand-yellow' : 'text-white/15'}
                        fill={s <= Math.round(current.rating) ? '#FFE135' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/40">
                    {current.rating} ({current.reviews.toLocaleString('ru')})
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Conversion metric */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Конверсия в корзину</div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl"
                  style={{ color: activated ? '#4ADE80' : '#F59E0B' }}>
                  {convValue.toFixed(1)}%
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${activated ? 'text-[#4ADE80]' : 'text-[#F59E0B]'}`}>
                  <TrendingUp size={12} />
                  {activated ? '+300%' : 'Среднее'}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!activated ? (
                <motion.button
                  key="activate"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={activate}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex items-center gap-2 bg-brand-yellow text-brand-dark font-display font-bold text-xs px-4 py-2.5 rounded-xl overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
                    style={{ skewX: '-20deg' }}
                  />
                  <Zap size={13} strokeWidth={2.5} />
                  Активировать AIROOM
                </motion.button>
              ) : (
                <motion.button
                  key="reset"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg border border-white/[0.08] hover:border-white/20"
                >
                  <RefreshCw size={11} />
                  Сбросить
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      {activated && (
        <>
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="absolute -right-4 top-16 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg animate-float"
          >
            <div className="w-5 h-5 rounded-md bg-[#4ADE80]/20 flex items-center justify-center">
              <TrendingUp size={11} className="text-[#4ADE80]" />
            </div>
            <span className="text-xs font-bold text-white">+300% к конверсии</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -left-4 bottom-20 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg animate-float-d1"
          >
            <Sparkles size={11} className="text-brand-yellow" />
            <span className="text-xs font-bold text-white">AI описание готово</span>
          </motion.div>
        </>
      )}
    </div>
  )
}

/* ──────────────────────────────────
   Hero section
────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 overflow-hidden">
      {/* BG: dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

      {/* Radial glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Subtle orbit */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-brand-yellow/[0.04] animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-brand-yellow/[0.03]"
          style={{ animation: 'spin 30s linear infinite reverse' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">

          {/* ── Left: copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="badge mb-7"
            >
              <Sparkles size={11} /> AI-агентство нового поколения
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-[52px] lg:text-6xl xl:text-[68px] leading-[1.04] tracking-tight text-white mb-5"
            >
              Масштабируем
              <br />
              <TypewriterHeadline />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-lg text-white/50 leading-relaxed max-w-[480px] mb-10"
            >
              Автоматизация поддержки, генерация студийного контента и умное
              ценообразование — в одной экосистеме для e-commerce брендов.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,225,53,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="font-display font-bold text-base px-7 py-3.5 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2.5 transition-shadow"
              >
                Получить демо
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-display font-semibold text-base px-7 py-3.5 rounded-xl border border-white/15 text-white/80 flex items-center gap-3 hover:border-white/30 hover:text-white transition-all"
              >
                <div className="relative w-9 h-9 rounded-full bg-white/[0.07] flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" />
                  <Play size={13} className="ml-0.5" />
                </div>
                Смотреть кейсы
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#E8845A','#60A5FA','#4ADE80','#F472B6','#A78BFA'].map((c,i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-brand-dark flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: c }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} className="text-brand-yellow" fill="#FFE135" />
                    ))}
                  </div>
                  <span className="text-xs text-white/35">4.9 · 34+ бренда</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/[0.08]" />
              {[['$2.4B', 'ARR клиентов'], ['340%', 'макс. рост ROI']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display font-black text-lg text-brand-yellow">{v}</div>
                  <div className="text-[10px] text-white/30">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: simulator ── */}
          <div className="relative">
            <ProductSimulator />
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-2 mt-16 cursor-pointer"
          onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] text-white/20 tracking-[.2em] uppercase">Скролл</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.7 }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-brand-yellow/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
