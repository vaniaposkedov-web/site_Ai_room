import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Wand2, Sparkles, Check, X, RotateCcw, ArrowRight } from 'lucide-react'

/* ─────────────────────────────────
   Data — wardrobe items
───────────────────────────────── */
interface Item {
  id: string
  label: string
  thumb: string
  look: string
}

const ITEMS: Item[] = [
  {
    id: 'dress',
    label: 'Платье',
    thumb: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80',
    look: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'jacket',
    label: 'Куртка',
    thumb: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80',
    look: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'turtleneck',
    label: 'Водолазка',
    thumb: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80',
    look: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'skirt',
    label: 'Юбка',
    thumb: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d05?auto=format&fit=crop&w=300&q=80',
    look: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'blazer',
    label: 'Пиджак',
    thumb: 'https://images.unsplash.com/photo-1591047139756-eb2746e3f9f5?auto=format&fit=crop&w=300&q=80',
    look: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=720&q=80',
  },
]

const BASE_LOOK =
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=720&q=80'

const LEFT_IDS = ['dress', 'jacket', 'turtleneck']
const RIGHT_IDS = ['skirt', 'blazer']

/* ─────────────────────────────────
   Smooth photo morph (whole image, no tiles)
───────────────────────────────── */
function MorphImage({ src }: { src: string }) {
  return (
    <div className="absolute inset-0">
      {/* crossfade + zoom-out + deblur — фото остаётся цельным */}
      <AnimatePresence>
        <motion.img
          key={src}
          src={src}
          alt="Образ"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.12, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      {/* короткая AI-вспышка при смене */}
      <AnimatePresence>
        <motion.div
          key={src + '-flash'}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,225,53,0.4), transparent 70%)' }}
        />
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────
   Draggable wardrobe card
───────────────────────────────── */
function WardrobeCard({
  item,
  connected,
  cardRef,
  onDragMove,
  onDrop,
  onDisconnect,
}: {
  item: Item
  connected: boolean
  cardRef: (el: HTMLDivElement | null) => void
  onDragMove: (rect: DOMRect) => void
  onDrop: (rect: DOMRect) => void
  onDisconnect: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={cardRef} className="w-[86px] sm:w-[112px]">
      <motion.div
        ref={innerRef}
        drag
        dragSnapToOrigin
        dragElastic={0.14}
        dragMomentum={false}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1, zIndex: 60 }}
        onDragStart={() => setDragging(true)}
        onDrag={() => {
          const r = innerRef.current?.getBoundingClientRect()
          if (r) onDragMove(r)
        }}
        onDragEnd={() => {
          setDragging(false)
          const r = innerRef.current?.getBoundingClientRect()
          if (r) onDrop(r)
        }}
        onClick={() => connected && onDisconnect()}
        className="relative cursor-grab active:cursor-grabbing select-none rounded-2xl border bg-[#1A1A1A] p-1.5 sm:p-2 flex flex-col gap-1"
        style={{
          touchAction: 'none',
          position: 'relative',
          zIndex: dragging ? 60 : 30,
          borderColor: connected ? 'rgba(255,225,53,0.9)' : 'rgba(255,255,255,0.08)',
          boxShadow: dragging
            ? '0 18px 40px rgba(0,0,0,0.55)'
            : connected
            ? '0 0 22px rgba(255,225,53,0.3)'
            : '0 6px 18px rgba(0,0,0,0.35)',
        }}
      >
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#141414]">
          <img src={item.thumb} alt={item.label} className="w-full h-full object-cover pointer-events-none" loading="lazy" />
          {connected && (
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#FFE135] border-2 border-[#1A1A1A] flex items-center justify-center">
              <Check size={11} className="text-[#262626]" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="text-[10px] sm:text-[11px] font-display font-bold text-white text-center truncate">{item.label}</div>
        <div className="text-[7px] sm:text-[8px] uppercase tracking-wider text-white/30 font-mono text-center">
          {connected ? 'клик — снять' : 'тяни к фото'}
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
interface Line { id: string; x1: number; y1: number; x2: number; y2: number; len: number }

export default function TryOnSimulator() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState<string[]>([])
  const [lastApplied, setLastApplied] = useState<string | null>(null)
  const [pulse, setPulse] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [lines, setLines] = useState<Line[]>([])

  const stageRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  // надёжно: пересекается ли прямоугольник перетаскиваемой карточки с фото
  const overlapsDrop = (card: DOMRect) => {
    const b = dropRef.current?.getBoundingClientRect()
    if (!b) return false
    const pad = 16 // небольшой запас
    return (
      card.left < b.right + pad &&
      card.right > b.left - pad &&
      card.top < b.bottom + pad &&
      card.bottom > b.top - pad
    )
  }

  const handleDragMove = (rect: DOMRect) => setDragOver(overlapsDrop(rect))

  const handleDrop = (id: string) => (rect: DOMRect) => {
    setDragOver(false)
    if (!overlapsDrop(rect)) return
    setConnected((arr) => (arr.includes(id) ? arr : [...arr, id]))
    setLastApplied(id)
    setPulse(true)
    setTimeout(() => setPulse(false), 600)
  }

  const disconnect = (id: string) => {
    const rest = connected.filter((x) => x !== id)
    setConnected(rest)
    setLastApplied((prev) => (prev !== id ? prev : rest.length ? rest[rest.length - 1] : null))
  }

  const reset = () => {
    setConnected([])
    setLastApplied(null)
  }

  // measure connection lines — from card edge to the PHOTO BORDER (not centre),
  // so they plug into the frame instead of crossing over the image
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current?.getBoundingClientRect()
      const photo = dropRef.current?.getBoundingClientRect()
      if (!stage || !photo) return
      const cx = photo.left + photo.width / 2 - stage.left
      const cy = photo.top + photo.height / 2 - stage.top
      const hw = photo.width / 2
      const hh = photo.height / 2
      const next: Line[] = []
      for (const id of connected) {
        const el = cardRefs.current[id]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const x1 = r.left + r.width / 2 - stage.left
        const y1 = r.top + r.height / 2 - stage.top
        const dx = x1 - cx
        const dy = y1 - cy
        // точка пересечения луча (центр→карточка) с рамкой фото
        const tx = dx !== 0 ? hw / Math.abs(dx) : Infinity
        const ty = dy !== 0 ? hh / Math.abs(dy) : Infinity
        const t = Math.min(tx, ty, 1)
        const x2 = cx + dx * t
        const y2 = cy + dy * t
        next.push({ id, x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) })
      }
      setLines(next)
    }
    measure()
    // карточка ещё возвращается на место после дропа — домерим после анимации
    const t = setTimeout(measure, 380)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [connected])

  const centralImg = lastApplied ? ITEMS.find((i) => i.id === lastApplied)!.look : BASE_LOOK

  const renderColumn = (ids: string[]) => (
    <div className="flex flex-col gap-3 sm:gap-5 justify-center">
      {ids.map((id) => {
        const item = ITEMS.find((x) => x.id === id)!
        return (
          <WardrobeCard
            key={id}
            item={item}
            connected={connected.includes(id)}
            cardRef={(el) => (cardRefs.current[id] = el)}
            onDragMove={handleDragMove}
            onDrop={handleDrop(id)}
            onDisconnect={() => disconnect(id)}
          />
        )
      })}
    </div>
  )

  return (
    <section id="try-on" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-1/3 w-[460px] h-[460px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="badge mx-auto mb-5"
          >
            <Wand2 size={11} />
            AI Примерка
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Соберите образ <span className="text-gradient">перетаскиванием</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Тяните карточки с вещами к фото в центре — нейросеть «надевает» их,
            и снимок пересобирается на лету.
          </motion.p>
        </div>

        {/* Stage: left cards · big photo · right cards */}
        <div
          ref={stageRef}
          className="relative grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6"
        >
          {/* connection lines — sit BEHIND the photo, plug into its border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {lines.map((l) => (
              <g key={l.id}>
                {/* soft glow */}
                <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFE135" strokeWidth={7} strokeLinecap="round" opacity={0.12} />
                {/* main line draws itself in */}
                <motion.line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#FFE135" strokeWidth={2} strokeLinecap="round" opacity={0.45}
                  strokeDasharray={l.len}
                  initial={{ strokeDashoffset: l.len }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* flowing pulses toward the photo */}
                <motion.line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#FFF6C2" strokeWidth={2.5} strokeLinecap="round"
                  strokeDasharray="2 14"
                  animate={{ strokeDashoffset: [0, -32] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
                {/* port plugging into the photo border */}
                <motion.circle
                  cx={l.x2} cy={l.y2} r={5} fill="#FFE135"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 18 }}
                />
                <circle cx={l.x2} cy={l.y2} r={5} fill="none" stroke="#FFE135" strokeWidth={1}>
                  <animate attributeName="r" from="5" to="14" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>

          {/* LEFT cards */}
          {renderColumn(LEFT_IDS)}

          {/* CENTER photo (drop target) */}
          <div className="relative z-10 flex justify-center">
            <div className="relative">
              {/* rotating glow halo */}
              <motion.div
                aria-hidden
                className="absolute -inset-5 rounded-[2rem] pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(255,225,53,0), rgba(255,225,53,0.45), rgba(255,225,53,0), rgba(255,225,53,0.25), rgba(255,225,53,0))',
                  filter: 'blur(22px)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              />
            <motion.div
              ref={dropRef}
              animate={{
                boxShadow: pulse || dragOver
                  ? '0 0 0 6px rgba(255,225,53,0.4), 0 24px 70px rgba(0,0,0,0.6)'
                  : '0 0 0 2px rgba(255,225,53,0.2), 0 24px 60px rgba(0,0,0,0.45)',
                scale: pulse ? 1.04 : dragOver ? 1.025 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[310px] aspect-[3/4] rounded-3xl overflow-hidden bg-[#141414] border border-[#FFE135]/25"
            >
              <MorphImage src={centralImg} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none z-10" />

              {/* viewfinder corners */}
              {[
                'top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
                'top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
                'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
                'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
              ].map((c) => (
                <div key={c} className={`absolute w-5 h-5 border-[#FFE135]/70 pointer-events-none z-10 ${c}`} />
              ))}

              {/* drop hint ring while dragging over */}
              <AnimatePresence>
                {dragOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-2 rounded-2xl border-2 border-dashed border-[#FFE135] pointer-events-none z-10"
                  />
                )}
              </AnimatePresence>

              {/* AI badge */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono text-white/70">
                <Sparkles size={9} className="text-[#FFE135]" /> AI · 4K
              </div>

              {/* status */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-center">
                <div className="text-[11px] text-[#FFE135] font-mono">
                  {dragOver
                    ? 'Отпустите — наденем ✦'
                    : connected.length
                    ? `Образ из ${connected.length} вещей`
                    : 'Перетащите вещь сюда'}
                </div>
              </div>
            </motion.div>
            </div>
          </div>

          {/* RIGHT cards */}
          {renderColumn(RIGHT_IDS)}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex flex-wrap justify-center gap-2 min-h-[28px]">
            <AnimatePresence>
              {connected.map((id) => {
                const item = ITEMS.find((x) => x.id === id)!
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => disconnect(id)}
                    className="flex items-center gap-1.5 bg-[#FFE135]/15 border border-[#FFE135]/30 text-[#FFE135] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#FFE135]/25 transition-colors"
                  >
                    {item.label}
                    <X size={12} />
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          {connected.length > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <RotateCcw size={13} /> Сбросить образ
            </button>
          )}

          {/* CTA → рабочая область */}
          <motion.button
            onClick={() => navigate('/app')}
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,225,53,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 font-display font-bold text-base px-8 py-4 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2.5 transition-shadow"
          >
            Попробовать
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
