import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactFlowProvider } from '@xyflow/react'
import { ArrowLeft, Star, Plus, Sparkles, Loader2, X } from 'lucide-react'
import NodeLibrary from '@/workspace/NodeLibrary'
import Editor from '@/workspace/Editor'
import Inspector from '@/workspace/Inspector'
import Toolbar from '@/workspace/Toolbar'
import BottomDrawer from '@/workspace/BottomDrawer'
import { useFlow } from '@/workspace/store'
import { STAR_TO_RUB } from '@/workspace/types'

/* плавный «барабан» баланса */
function useCountUp(value: number, dur = 600) {
  const [disp, setDisp] = useState(value)
  const fromRef = useRef(value)
  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))
      setDisp(v)
      if (k < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, dur])
  return disp
}

const PACKS = [
  { stars: 50, bonus: 0 },
  { stars: 100, bonus: 10 },
  { stars: 300, bonus: 50 },
]

export default function Workspace() {
  const [booting, setBooting] = useState(true)
  const [topup, setTopup] = useState(false)

  const balance = useFlow((s) => s.balance)
  const running = useFlow((s) => s.running)
  const run = useFlow((s) => s.run)
  const cost = useFlow((s) => s.graphCost())
  const fileCount = useFlow((s) => s.files.length)
  const price = cost * Math.max(1, fileCount)
  const allDone = useFlow((s) => s.nodes.length > 0 && s.nodes.every((n) => n.data.status === 'done'))
  const dispBalance = useCountUp(balance)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1700)
    return () => clearTimeout(t)
  }, [])

  const canRun = !running && cost > 0 && balance >= price && !allDone

  return (
    <div className="h-screen flex flex-col bg-brand-dark text-white overflow-hidden">
      {/* Boot screen */}
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="font-display font-black text-3xl tracking-tight"
            >
              AI<span className="text-brand-yellow">ROOM</span>
            </motion.div>
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-brand-yellow" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
            </div>
            <div className="text-white/40 text-xs tracking-wide">Загружаем рабочую область…</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 flex-shrink-0 flex items-center gap-4 px-4 border-b border-white/[0.07] bg-[#1A1A1A]/80 backdrop-blur-md z-20">
        <Link to="/" className="font-display font-black text-xl tracking-tight">
          AI<span className="text-brand-yellow">ROOM</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white px-2 py-1.5 rounded-lg transition-colors">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">На сайт</span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* balance */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl pl-3 pr-1.5 py-1.5">
            <span className="text-xs text-white/40 hidden sm:inline">Баланс</span>
            <motion.span
              key={balance}
              initial={{ scale: 1.25, color: '#FFFFFF' }}
              animate={{ scale: 1, color: '#FFE135' }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1 font-display font-black tabular-nums"
            >
              {dispBalance} <Star size={13} fill="currentColor" />
            </motion.span>
            <button
              onClick={() => setTopup(true)}
              className="flex items-center gap-1 text-xs font-semibold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/25 rounded-lg px-2 py-1 hover:bg-brand-yellow/25 transition-colors"
            >
              <Plus size={12} /> <span className="hidden sm:inline">Пополнить</span>
            </button>
          </div>

          {/* generate */}
          <button
            onClick={() => run()}
            disabled={!canRun}
            className="flex items-center gap-2 font-display font-bold text-sm px-4 sm:px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-dark transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {running ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} strokeWidth={2.5} />}
            {running ? 'Генерация…' : allDone ? 'Измените параметры' : (
              <span className="flex items-center gap-1">
                Сгенерировать
                <span className="opacity-70 flex items-center gap-0.5">(от {price} <Star size={11} fill="currentColor" />)</span>
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Body: library · (toolbar + canvas + batch) · inspector */}
      <div className="flex-1 flex min-h-0">
        <NodeLibrary />
        <div className="flex-1 flex flex-col min-w-0">
          <Toolbar />
          <ReactFlowProvider>
            <Editor />
          </ReactFlowProvider>
          <BottomDrawer />
        </div>
        <Inspector />
      </div>

      {/* Top-up modal */}
      <AnimatePresence>
        {topup && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTopup(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#1A1A1A] p-7 shadow-2xl"
            >
              <button onClick={() => setTopup(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                <X size={17} />
              </button>
              <h3 className="font-display font-black text-2xl text-white mb-1">Пополнить баланс</h3>
              <p className="text-white/40 text-sm mb-5">1 ⭐ = {STAR_TO_RUB} ₽. Списываются только за платные блоки.</p>
              <div className="space-y-2.5">
                {PACKS.map((p) => {
                  const total = p.stars + p.bonus
                  return (
                    <button
                      key={p.stars}
                      onClick={() => { useFlow.setState((s) => ({ balance: s.balance + total })); setTopup(false) }}
                      className="w-full flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 hover:border-brand-yellow/40 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-display font-bold text-white">
                        {total} <Star size={14} className="text-brand-yellow" fill="#FFE135" />
                        {p.bonus > 0 && <span className="text-[11px] text-[#4ADE80]">+{p.bonus} бонус</span>}
                      </span>
                      <span className="text-sm text-white/50">{p.stars * STAR_TO_RUB} ₽</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
