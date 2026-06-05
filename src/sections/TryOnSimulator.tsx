import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, type PanInfo } from 'framer-motion'
import { Wand2, Sparkles, Check, X, RotateCcw } from 'lucide-react'

/* ─────────────────────────────────
   Data — wardrobe items around the model
───────────────────────────────── */
interface Item {
  id: string
  label: string
  thumb: string
  look: string // central photo shown when this item is connected
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

// slot position in % around the circle (0deg = top, clockwise)
const slotPos = (i: number, total: number) => {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2
  const R = 42 // radius in % of container
  return { x: 50 + R * Math.cos(angle), y: 50 + R * Math.sin(angle) }
}

/* ─────────────────────────────────
   Draggable wardrobe card
───────────────────────────────── */
/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function TryOnSimulator() {
  const [connected, setConnected] = useState<string[]>([])
  const [lastApplied, setLastApplied] = useState<string | null>(null)
  const [pulse, setPulse] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const dropRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  // курсор над центральным фото (с прощающим отступом)?
  const isOverDrop = (info: PanInfo) => {
    const r = dropRef.current?.getBoundingClientRect()
    if (!r) return false
    const pad = 56 // запас вокруг фото, чтобы попадать было легко
    return (
      info.point.x >= r.left - pad &&
      info.point.x <= r.right + pad &&
      info.point.y >= r.top - pad &&
      info.point.y <= r.bottom + pad
    )
  }

  // живая подсветка зоны, пока тянем карточку
  const handleDragMove = (info: PanInfo) => setDragOver(isOverDrop(info))

  const handleDrop = (id: string) => (info: PanInfo) => {
    setDragOver(false)
    if (!isOverDrop(info)) return
    setConnected((arr) => (arr.includes(id) ? arr : [...arr, id]))
    setLastApplied(id)
    setPulse(true)
    setTimeout(() => setPulse(false), 600)
  }

  const disconnect = (id: string) => {
    setConnected((arr) => arr.filter((x) => x !== id))
    setLastApplied((prev) => {
      if (prev !== id) return prev
      const rest = connected.filter((x) => x !== id)
      return rest.length ? rest[rest.length - 1] : null
    })
  }

  const reset = () => {
    setConnected([])
    setLastApplied(null)
  }

  const centralImg = lastApplied ? ITEMS.find((i) => i.id === lastApplied)!.look : BASE_LOOK

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
            и снимок меняется в реальном времени.
          </motion.p>
        </div>

        {/* Stage */}
        <div className="relative mx-auto w-full max-w-[560px] aspect-square">
          {/* connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {ITEMS.map((item, i) => {
              if (!connected.includes(item.id)) return null
              const p = slotPos(i, ITEMS.length)
              return (
                <line
                  key={item.id}
                  x1={p.x} y1={p.y} x2={50} y2={50}
                  stroke="#FFE135" strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>

          {/* Central photo (drop target) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44%] aspect-[3/4] z-10">
            <motion.div
              ref={dropRef}
              animate={{
                boxShadow: pulse || dragOver
                  ? '0 0 0 6px rgba(255,225,53,0.4), 0 20px 50px rgba(0,0,0,0.5)'
                  : '0 0 0 2px rgba(255,225,53,0.18), 0 20px 50px rgba(0,0,0,0.45)',
                scale: pulse ? 1.05 : dragOver ? 1.03 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full rounded-2xl overflow-hidden bg-[#141414] border border-[#FFE135]/20"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={centralImg}
                  src={centralImg}
                  alt="Образ"
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* AI badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono text-white/70">
                <Sparkles size={9} className="text-[#FFE135]" /> AI · 4K
              </div>

              {/* Counter */}
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <div className="text-[10px] text-[#FFE135] font-mono">
                  {dragOver
                    ? 'Отпустите — наденем ✦'
                    : connected.length
                    ? `Образ из ${connected.length} вещей`
                    : 'Перетащите вещь сюда'}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Wardrobe cards around the circle */}
          {ITEMS.map((item, i) => (
            <WardrobeCard
              key={item.id}
              item={item}
              pos={slotPos(i, ITEMS.length)}
              connected={connected.includes(item.id)}
              onDragMove={handleDragMove}
              onDrop={handleDrop(item.id)}
              onDisconnect={() => disconnect(item.id)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* connected chips */}
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

/* ─────────────────────────────────
   Draggable wardrobe card
───────────────────────────────── */
function WardrobeCard({
  item,
  pos,
  connected,
  onDragMove,
  onDrop,
  onDisconnect,
}: {
  item: Item
  pos: { x: number; y: number }
  connected: boolean
  onDragMove: (info: PanInfo) => void
  onDrop: (info: PanInfo) => void
  onDisconnect: () => void
}) {
  const [dragging, setDragging] = useState(false)

  return (
    <motion.div
      className="absolute z-20 w-[104px] sm:w-[120px]"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.16}
        dragMomentum={false}
        whileDrag={{ scale: 1.08 }}
        onDragStart={() => setDragging(true)}
        onDrag={(_e, info: PanInfo) => onDragMove(info)}
        onDragEnd={(_e, info: PanInfo) => {
          setDragging(false)
          onDrop(info)
        }}
        onClick={() => connected && onDisconnect()}
        className="relative w-full cursor-grab active:cursor-grabbing select-none rounded-2xl border bg-[#1A1A1A] p-2 flex flex-col gap-1.5"
        style={{
          touchAction: 'none',
          zIndex: dragging ? 50 : 20,
          borderColor: connected ? 'rgba(255,225,53,0.9)' : 'rgba(255,255,255,0.08)',
          boxShadow: dragging
            ? '0 18px 40px rgba(0,0,0,0.5)'
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
        <div className="text-[11px] font-display font-bold text-white text-center truncate">{item.label}</div>
        <div className="text-[8px] uppercase tracking-wider text-white/30 font-mono text-center">
          {connected ? 'клик — снять' : 'тяни к фото'}
        </div>
      </motion.div>
    </motion.div>
  )
}
