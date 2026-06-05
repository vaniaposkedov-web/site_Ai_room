import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Layers, MessageSquare, BarChart2, ChevronRight, Bot, User, TrendingUp } from 'lucide-react'

/* ─────────────────────────────────
   Tab 1 – Before / After drag slider
───────────────────────────────── */
function DragSlider() {
  const [pos, setPos] = useState(52)           // 0–100 %
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const applyPos = (clientX: number) => {
    if (!trackRef.current) return
    const { left, width } = trackRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100))
    setPos(pct)
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
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchend',  onUp)
    }
  }, [])

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden select-none border border-white/[0.08]"
      style={{ height: 320 }}
      ref={trackRef}
      onMouseDown={e => { dragging.current = true; applyPos(e.clientX) }}
      onTouchStart={e => { dragging.current = true; applyPos(e.touches[0].clientX) }}
    >
      {/* AFTER layer (full width, behind) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ background: 'linear-gradient(135deg, #1a1233 0%, #2d1b69 50%, #0f172a 100%)' }}>
        <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1">После AIROOM</div>
        <div className="w-28 h-32 rounded-2xl shadow-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(145deg,#4f3a8a,#7c3aed)', boxShadow: '0 16px 48px rgba(124,58,237,.5)' }}>
          <span className="text-4xl">🧥</span>
        </div>
        <div className="font-display font-bold text-sm text-white text-center px-4">
          Мужская куртка из экокожи — городской стиль
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-bold px-2.5 py-1 rounded-full">4.8% конверсия</span>
          <span className="bg-brand-yellow/20 text-brand-yellow text-[10px] font-bold px-2.5 py-1 rounded-full">AI Studio</span>
        </div>
      </div>

      {/* BEFORE layer (clipped) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <div className="absolute inset-0 min-w-[200%] flex flex-col items-center justify-center gap-3"
          style={{ background: '#262626' }}>
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1">До AIROOM</div>
          <div className="w-28 h-32 rounded-2xl flex items-center justify-center border border-white/[0.08] bg-[#1e1e1e]">
            <span className="text-white/15 text-xs text-center px-2">Стандартное фото</span>
          </div>
          <div className="font-display font-bold text-sm text-white/50 text-center px-4 max-w-[200px]">
            Куртка кожаная мужская
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/5 text-white/30 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/[0.06]">1.2% конверсия</span>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-px bg-white/30 pointer-events-none z-10"
        style={{ left: `${pos}%` }} />

      {/* Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl cursor-ew-resize"
        style={{ left: `${pos}%` }}
        whileHover={{ scale: 1.1 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white/60 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">До</div>
      <div className="absolute bottom-3 right-3 bg-brand-yellow/20 backdrop-blur-md text-brand-yellow text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">После</div>
    </div>
  )
}

/* ─────────────────────────────────
   Tab 2 – Auto-playing mini chat
───────────────────────────────── */
const chatScript: { role: 'user' | 'bot'; text: string; delay: number }[] = [
  { role: 'user', text: 'Привет! Хочу вернуть заказ #84231',         delay: 0    },
  { role: 'bot',  text: 'Здравствуйте! Уже нашёл ваш заказ. Назовите причину возврата?', delay: 900 },
  { role: 'user', text: 'Не подошёл размер',                         delay: 1800 },
  { role: 'bot',  text: 'Оформляю бесплатный обмен — курьер завтра с 10 до 18. Подходит?', delay: 2700 },
  { role: 'user', text: 'Да, отлично!',                              delay: 3600 },
  { role: 'bot',  text: '✅ Готово! Курьер уже назначен. Хотите выбрать другой размер прямо сейчас?', delay: 4500 },
]

function MiniChat() {
  const [visible, setVisible] = useState<number[]>([])
  const [typing,  setTyping]  = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisible([])
    setTyping(false)
    const timers: ReturnType<typeof setTimeout>[] = []

    chatScript.forEach((msg, i) => {
      if (msg.role === 'bot') {
        const t1 = setTimeout(() => setTyping(true),  msg.delay)
        const t2 = setTimeout(() => { setTyping(false); setVisible(v => [...v, i]) }, msg.delay + 700)
        timers.push(t1, t2)
      } else {
        const t = setTimeout(() => setVisible(v => [...v, i]), msg.delay)
        timers.push(t)
      }
    })

    // restart loop
    const total = chatScript[chatScript.length - 1].delay + 2400
    const loop = setTimeout(() => {
      setVisible([])
      setTyping(false)
    }, total)
    timers.push(loop)

    return () => timers.forEach(clearTimeout)
  }, [visible.length === 0 ? 0 : visible[0]])  // restart trigger

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visible, typing])

  return (
    <div className="w-full max-w-lg mx-auto border border-white/[0.08] rounded-2xl overflow-hidden bg-[#1A1A1A]">
      {/* Topbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#141414]">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 flex items-center justify-center">
            <Bot size={15} className="text-brand-yellow" />
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4ADE80] border border-[#1A1A1A]" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">AIROOM Support Bot</div>
          <div className="text-[10px] text-[#4ADE80]">Онлайн · отвечает за 2 сек</div>
        </div>
        <div className="ml-auto text-[10px] text-white/20 font-mono">Wildberries</div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2.5 p-4 h-56 overflow-y-auto">
        {chatScript.map((msg, i) => {
          if (!visible.includes(i)) return null
          const isUser = msg.role === 'user'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                isUser
                  ? 'bg-white/10 text-white/50'
                  : 'bg-brand-yellow/20 text-brand-yellow'
              }`}>
                {isUser ? <User size={10} /> : <Bot size={10} />}
              </div>
              <div className={`max-w-[76%] text-xs leading-relaxed px-3 py-2 rounded-2xl ${
                isUser
                  ? 'bg-white/[0.07] text-white/70 rounded-br-sm'
                  : 'bg-[#2a2a2a] text-white rounded-bl-sm border border-white/[0.06]'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          )
        })}

        {/* Typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-brand-yellow/20 flex items-center justify-center">
              <Bot size={10} className="text-brand-yellow" />
            </div>
            <div className="bg-[#2a2a2a] border border-white/[0.06] px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1">
              {[0.1, 0.25, 0.4].map(d => (
                <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: d }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input stub */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]">
        <div className="flex-1 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 flex items-center">
          <span className="text-[11px] text-white/20">Написать сообщение...</span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-brand-yellow/20 flex items-center justify-center">
          <ChevronRight size={14} className="text-brand-yellow" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Tab 3 – Animated SVG revenue chart
───────────────────────────────── */
const months  = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен']
const revBefore = [1.1, 1.2, 1.0, 1.3, 1.15, 1.25, 1.2, 1.35, 1.4]
const revAfter  = [1.1, 1.35, 1.65, 2.1, 2.55, 3.0, 3.5, 4.1, 4.8]

function RevenueChart() {
  const [progress, setProgress] = useState(0)
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, amount: 0.4 })

  useEffect(() => {
    if (!inView) return
    let frame: number
    let start: number | null = null
    const dur = 1600
    const tick = (ts: number) => {
      if (!start) start = ts
      setProgress(Math.min(1, (ts - start) / dur))
      if (ts - start < dur) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView])

  const W = 480; const H = 200; const PAD = { l: 36, r: 12, t: 16, b: 32 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const maxV = 5.5
  const xOf = (i: number) => PAD.l + (i / (months.length - 1)) * iW
  const yOf = (v: number) => PAD.t + iH - (v / maxV) * iH

  const pathD = (data: number[], p = 1) => {
    const pts = data.map((v, i) => ({
      x: xOf(i),
      y: yOf(PAD.t + (v - PAD.t) >= 0 ? v : v),  // passthrough
    }))
    const partial = pts.filter((_, i) => i / (pts.length - 1) <= p)
    if (partial.length < 2) return ''
    return partial.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
  }

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto border border-white/[0.08] rounded-2xl overflow-hidden bg-[#1A1A1A] p-5">
      {/* Legend */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-bold text-white font-display">Динамика выручки</div>
          <div className="text-[10px] text-white/30">млн ₽ · месяц к месяцу</div>
        </div>
        <div className="flex gap-4">
          {[['До', '#6B7280'], ['После AIROOM', '#FFE135']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-5 h-px" style={{ background: c, height: 2 }} />
              <span className="text-[10px] text-white/40">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
        {/* Grid lines */}
        {[1,2,3,4,5].map(v => {
          const y = yOf(v)
          return (
            <g key={v}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PAD.l - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.2)">{v}M</text>
            </g>
          )
        })}

        {/* Month labels */}
        {months.map((m, i) => (
          <text key={m} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)">{m}</text>
        ))}

        {/* Before line */}
        <path d={pathD(revBefore, progress)} fill="none" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* After area fill */}
        {progress > 0 && (() => {
          const d = pathD(revAfter, progress)
          const lastIdx = Math.min(months.length - 1, Math.floor(progress * (months.length - 1)))
          const fillClose = ` L${xOf(lastIdx).toFixed(1)},${(PAD.t + iH).toFixed(1)} L${PAD.l.toFixed(1)},${(PAD.t + iH).toFixed(1)} Z`
          return (
            <path d={d + fillClose} fill="url(#yGrad)" opacity="0.25" />
          )
        })()}

        {/* After line */}
        <path d={pathD(revAfter, progress)} fill="none" stroke="#FFE135" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Animated dot at end of after line */}
        {progress > 0.05 && (() => {
          const i = Math.min(months.length - 1, progress * (months.length - 1))
          const iFloor = Math.floor(i)
          const iFrac  = i - iFloor
          const x = iFloor < months.length - 1
            ? xOf(iFloor) + iFrac * (xOf(iFloor + 1) - xOf(iFloor))
            : xOf(months.length - 1)
          const y = iFloor < months.length - 1
            ? yOf(revAfter[iFloor]) + iFrac * (yOf(revAfter[iFloor + 1]) - yOf(revAfter[iFloor]))
            : yOf(revAfter[months.length - 1])
          return (
            <g>
              <circle cx={x} cy={y} r="5" fill="#FFE135" opacity="0.25" />
              <circle cx={x} cy={y} r="3" fill="#FFE135" />
            </g>
          )
        })()}

        <defs>
          <linearGradient id="yGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFE135" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE135" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
        {[
          { label: 'Рост выручки',  value: '+340%',   color: '#4ADE80' },
          { label: 'Время внедрения', value: '14 дней', color: '#60A5FA' },
          { label: 'ROI',           value: '×7.2',    color: '#FFE135' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-display font-black text-xl" style={{ color: s.color }}>
              {progress > 0.9 ? s.value : '—'}
            </div>
            <div className="text-[10px] text-white/25 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Tab definitions
───────────────────────────────── */
const TABS = [
  { id: 'slider', icon: Layers,        label: 'Визуал продукта',  sub: 'AI-студия' },
  { id: 'chat',   icon: MessageSquare, label: 'Поддержка 24/7',   sub: 'AI-агент'  },
  { id: 'chart',  icon: BarChart2,     label: 'Рост выручки',     sub: 'Аналитика' },
] as const
type TabId = typeof TABS[number]['id']

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function Solutions() {
  const [active, setActive] = useState<TabId>('slider')

  return (
    <section id="solutions" className="relative py-24 px-6 overflow-hidden">
      {/* Dot grid BG */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="badge mx-auto mb-5">
            <TrendingUp size={11} />
            Три ключевых решения
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Смотрите, как AIROOM
            <br />
            <span className="text-gradient">трансформирует</span> ваш бизнес
          </h2>
          <p className="text-white/40 mt-5 max-w-lg mx-auto leading-relaxed">
            Три направления — одна платформа. Каждый инструмент встраивается
            в вашу экосистему за&nbsp;14&nbsp;дней.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 bg-[#1A1A1A] border border-white/[0.07] rounded-2xl">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = active === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-display font-bold transition-colors"
                  style={{ color: isActive ? '#262626' : 'rgba(255,255,255,0.45)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-xl bg-brand-yellow"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  <span className="relative z-10 sm:hidden">{tab.sub}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === 'slider' && <DragSlider />}
            {active === 'chat'   && <MiniChat />}
            {active === 'chart'  && <RevenueChart />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
