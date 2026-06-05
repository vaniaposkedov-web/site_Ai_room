import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion'
import {
  Check,
  Send,
  Sparkles,
  Wand2,
  User,
  Heart,
  Bookmark,
  Shuffle,
} from 'lucide-react'

/* ─────────────────────────────────
   Data
───────────────────────────────── */
interface Item {
  id: string
  label: string
  img: string
}

const ITEMS: Item[] = [
  {
    id: 'skirt',
    label: 'Плиссированная юбка',
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d05?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'turtleneck',
    label: 'Чёрная водолазка',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'blazer',
    label: 'Шерстяной пиджак',
    img: 'https://images.unsplash.com/photo-1591047139756-eb2746e3f9f5?auto=format&fit=crop&w=400&q=80',
  },
]

interface LookCard {
  id: string
  img: string
  title: string
  setting: string
}

const LOOKS: LookCard[] = [
  {
    id: 'look-1',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=720&q=80',
    title: 'Образ #1',
    setting: 'Loft · мягкий свет окна',
  },
  {
    id: 'look-2',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=720&q=80',
    title: 'Образ #2',
    setting: 'Loft · кирпичная стена',
  },
  {
    id: 'look-3',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&q=80',
    title: 'Образ #3',
    setting: 'Loft · бетон + неон',
  },
  {
    id: 'look-4',
    img: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=720&q=80',
    title: 'Образ #4',
    setting: 'Loft · panorama view',
  },
]

const BENEFITS = [
  'Образы за 12 секунд',
  'Без аренды студии и моделей',
  '4К разрешение для маркетплейсов',
  'Соблюдение цвета и фактуры тканей',
]

const PROMPT = 'Хочу фотосессию в лофт-студии с этим образом'

/* ─────────────────────────────────
   Floating item card — draggable
───────────────────────────────── */
function FloatingItem({
  item,
  index,
  onPick,
}: {
  item: Item
  index: number
  onPick: (id: string) => void
}) {
  return (
    <motion.button
      drag
      dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
      dragElastic={0.35}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 18 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPick(item.id)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="relative w-full cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'none' }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: index * 0.6, ease: 'easeInOut' }}
        className="bg-[#1A1A1A] border border-white/[0.07] rounded-2xl p-2.5 flex items-center gap-3 hover:border-[#FFE135]/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#141414] flex-shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-[11px] font-display font-bold text-white truncate">{item.label}</div>
          <div className="text-[9px] text-white/35 mt-0.5 font-mono uppercase tracking-wider">drag · click</div>
        </div>
      </motion.div>
    </motion.button>
  )
}

/* ─────────────────────────────────
   Look card deck — swipeable
───────────────────────────────── */
function LookDeck({ deck, onSwipe }: { deck: LookCard[]; onSwipe: () => void }) {
  return (
    <div className="relative w-full max-w-[280px] aspect-[3/4] mx-auto">
      {deck
        .slice(0, 4)
        .reverse()
        .map((card, i, arr) => {
          const depth = arr.length - 1 - i
          const isTop = depth === 0
          return isTop ? (
            <TopSwipeCard key={card.id} card={card} onSwipe={onSwipe} />
          ) : (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                scale: 1 - depth * 0.045,
                y: depth * 14,
                opacity: 1 - depth * 0.2,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.06]"
              style={{ zIndex: 10 - depth }}
            >
              <img src={card.img} alt={card.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </motion.div>
          )
        })}
    </div>
  )
}

function TopSwipeCard({ card, onSwipe }: { card: LookCard; onSwipe: () => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18])
  const likeOpacity = useTransform(x, [40, 140], [0, 1])
  const dislikeOpacity = useTransform(x, [-140, -40], [1, 0])

  return (
    <motion.div
      drag="x"
      style={{ x, rotate, zIndex: 20, touchAction: 'pan-y' }}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 500) {
          onSwipe()
        }
      }}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.08] cursor-grab"
    >
      <img src={card.img} alt={card.title} className="w-full h-full object-cover pointer-events-none" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 pointer-events-none" />

      {/* Like / dislike pills */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-4 left-4 bg-[#FFE135] text-[#262626] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-[#FFE135]"
      >
        Сохранить
      </motion.div>
      <motion.div
        style={{ opacity: dislikeOpacity }}
        className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-white/20"
      >
        Ещё вариант
      </motion.div>

      {/* AI watermark */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono text-white/70">
        <Sparkles size={9} className="text-[#FFE135]" />
        AI · 4K
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
        <div className="text-[10px] text-[#FFE135] font-mono">{card.setting}</div>
        <div className="text-white font-display font-bold text-base mt-0.5">{card.title}</div>
        <div className="text-white/45 text-[10px] mt-1">Swipe ←/→ или кликни кнопки</div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────
   Typing prompt input
───────────────────────────────── */
function TypingPrompt() {
  const [typed, setTyped] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    let i = 0
    setTyped('')
    const tick = setInterval(() => {
      i += 1
      setTyped(PROMPT.slice(0, i))
      if (i >= PROMPT.length) clearInterval(tick)
    }, 45)
    return () => clearInterval(tick)
  }, [inView])

  return (
    <div ref={ref} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-3 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-[#FFE135]/15 border border-[#FFE135]/30 flex items-center justify-center flex-shrink-0">
        <User size={14} className="text-[#FFE135]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono mb-0.5">Вы</div>
        <div className="text-[12px] text-white leading-snug min-h-[16px]">
          {typed}
          <span className="text-[#FFE135] animate-pulse">|</span>
        </div>
      </div>
      <button
        className="w-9 h-9 rounded-xl bg-[#FFE135] text-[#262626] flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
        aria-label="Отправить"
      >
        <Send size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function TryOnSimulator() {
  const [deck, setDeck] = useState<LookCard[]>(LOOKS)
  const [picked, setPicked] = useState<string[]>(['skirt', 'turtleneck'])

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  const cycleDeck = () =>
    setDeck((d) => {
      const [first, ...rest] = d
      return [...rest, first]
    })

  const togglePick = (id: string) =>
    setPicked((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]))

  return (
    <section id="try-on" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      {/* CSS grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-1/3 w-[460px] h-[460px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
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
            Соберите образ <span className="text-gradient">за минуту</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Перетащите или кликните вещи, опишите сцену — AIROOM сгенерирует
            готовую фотосессию, которую можно листать как карточки.
          </motion.p>
        </div>

        {/* Studio */}
        <div className="grid lg:grid-cols-[1fr_1.1fr_1fr] gap-5 lg:gap-6">
          {/* LEFT — items + prompt */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/30">Гардероб</div>
              <div className="text-[10px] text-[#FFE135]/80 font-mono">{picked.length} вещей</div>
            </div>

            {ITEMS.map((item, i) => {
              const isPicked = picked.includes(item.id)
              return (
                <div key={item.id} className="relative">
                  <FloatingItem item={item} index={i} onPick={togglePick} />
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isPicked ? 1 : 0,
                      scale: isPicked ? 1 : 0.5,
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FFE135] border-2 border-[#262626] flex items-center justify-center pointer-events-none"
                  >
                    <Check size={10} className="text-[#262626]" strokeWidth={3} />
                  </motion.div>
                </div>
              )
            })}

            <div className="mt-2">
              <TypingPrompt />
            </div>
          </div>

          {/* CENTER — deck */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/30 mb-4 self-start">
              Превью образов
            </div>
            <LookDeck deck={deck} onSwipe={cycleDeck} />

            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={cycleDeck}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors"
                aria-label="Пропустить"
              >
                <Shuffle size={15} className="text-white/55" />
              </button>
              <button
                onClick={cycleDeck}
                className="w-12 h-12 rounded-full bg-[#FFE135] text-[#262626] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_24px_rgba(255,225,53,0.45)]"
                aria-label="Сохранить"
              >
                <Heart size={17} strokeWidth={2.6} />
              </button>
              <button
                onClick={cycleDeck}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors"
                aria-label="В коллекцию"
              >
                <Bookmark size={15} className="text-white/55" />
              </button>
            </div>
          </div>

          {/* RIGHT — benefits */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/30 mb-3">Что вы получаете</div>
            <div className="glass-card p-5">
              <ul className="space-y-3 mb-5">
                {BENEFITS.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#FFE135]/15 border border-[#FFE135]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-[#FFE135]" strokeWidth={3} />
                    </div>
                    <span className="text-[13px] text-white/80 leading-snug">{b}</span>
                  </motion.li>
                ))}
              </ul>

              <PulseButton />

              <div className="text-[10px] text-white/30 mt-3 text-center">
                Первые 3 образа — бесплатно
              </div>
            </div>

            <div className="mt-4 bg-[#141414] border border-white/[0.06] rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-mono text-white/30 mb-2">
                <Sparkles size={9} className="text-[#FFE135]" /> Live · сейчас
              </div>
              <div className="text-[12px] text-white/70 leading-snug">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={deck[0].id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    Сгенерирован <b className="text-white">{deck[0].title}</b> · {deck[0].setting}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────
   Pulsing CTA button
───────────────────────────────── */
function PulseButton() {
  return (
    <button className="group relative w-full overflow-hidden rounded-xl bg-[#FFE135] text-[#262626] py-3 font-display font-black tracking-tight flex items-center justify-center gap-2">
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles size={15} strokeWidth={2.5} />
        Создать образ
      </span>
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: '0 0 0 4px rgba(255,225,53,0.18), 0 0 32px rgba(255,225,53,0.55)',
          animation: 'pulse-ring 1.6s ease-out infinite',
        }}
      />
    </button>
  )
}
