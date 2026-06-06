import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

/* ──────────────────────────────────
   Typing headline
────────────────────────────────── */
const headlines = ['карточек маркетплейсов', 'ИИ-редизайна фото', 'ИИ-обработки фото']
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
      t = setTimeout(() => setDel(true), 5000)
    else if (text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 32)
    else { setDel(false); setIdx(i => (i + 1) % headlines.length) }
    return () => clearTimeout(t)
  }, [text, del, idx])
  return (
    <span className="text-gradient whitespace-nowrap">
      {text}
      <span className="inline-block w-[3px] h-[.85em] bg-brand-yellow ml-1 align-middle"
        style={{ animation: 'blink 0.9s step-end infinite' }} />
    </span>
  )
}

/* ──────────────────────────────────
   Hero section
────────────────────────────────── */
export default function Hero() {
  const navigate = useNavigate()
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center pt-20 pb-16 px-6 overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="badge mb-8"
        >
          <Sparkles size={11} /> Нейросеть для маркетплейсов
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-[26px] sm:text-4xl lg:text-[58px] leading-[1.08] tracking-tight text-white mb-6"
        >
          Нейросеть для
          <br />
          <TypewriterHeadline />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-[520px] mb-10"
        >
          Загрузите фото товара — нейросеть сделает{' '}
          <span className="text-white/90 font-semibold">редизайн</span> и{' '}
          <span className="text-white/90 font-semibold">обработку</span> и соберёт{' '}
          <span className="text-brand-yellow font-semibold">продающую карточку</span> для Wildberries и Ozon.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          <motion.button
            onClick={() => navigate('/app')}
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,225,53,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="font-display font-bold text-base sm:text-lg px-8 py-4 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2.5 transition-shadow"
          >
            Попробовать бесплатно
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
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
    </section>
  )
}
