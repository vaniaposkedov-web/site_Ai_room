import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Wand2, Sparkles, Check, X, RotateCcw } from 'lucide-react'

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
   Cube-disintegration image
───────────────────────────────── */
const COLS = 5
const ROWS = 7
function CubeImage({ src }: { src: string }) {
  return (
    <div className="absolute inset-0" style={{ perspective: 700 }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={src}
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const c = i % COLS
            const r = Math.floor(i / COLS)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.25, rotateX: -65, z: -40 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, z: 0 }}
                exit={{ opacity: 0, scale: 0.25, rotateX: 65, z: -40 }}
                transition={{ duration: 0.5, delay: (c + r) * 0.022, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                }}
              />
            )
          })}
        </motion.div>
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

  // measure connection lines (card centre → photo centre), relative to stage
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current?.getBoundingClientRect()
      const photo = dropRef.current?.getBoundingClientRect()
      if (!stage || !photo) return
      const cx = photo.left + photo.width / 2 - stage.left
      const cy = photo.top + photo.height / 2 - stage.top
      const next: Line[] = []
      for (const id of connected) {
        const el = cardRefs.current[id]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const x1 = r.left + r.width / 2 - stage.left
        const y1 = r.top + r.height / 2 - stage.top
        next.push({ id, x1, y1, x2: cx, y2: cy, len: Math.hypot(cx - x1, cy - y1) })
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
          {/* connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {lines.map((l) => (
              <g key={l.id}>
                <motion.line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#FFE135" strokeWidth={2} strokeLinecap="round"
                  strokeDasharray={l.len}
                  initial={{ strokeDashoffset: l.len, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 0.7 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.circle
                  cx={l.x1} cy={l.y1} r={3} fill="#FFE135"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </g>
            ))}
          </svg>

          {/* LEFT cards */}
          {renderColumn(LEFT_IDS)}

          {/* CENTER photo (drop target) */}
          <div className="flex justify-center">
            <motion.div
              ref={dropRef}
              animate={{
                boxShadow: pulse || dragOver
                  ? '0 0 0 6px rgba(255,225,53,0.4), 0 24px 60px rgba(0,0,0,0.55)'
                  : '0 0 0 2px rgba(255,225,53,0.2), 0 24px 60px rgba(0,0,0,0.45)',
                scale: pulse ? 1.04 : dragOver ? 1.025 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[300px] aspect-[3/4] rounded-2xl overflow-hidden bg-[#141414] border border-[#FFE135]/20"
            >
              <CubeImage src={centralImg} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />

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
        </div>
      </div>
    </section>
  )
}
