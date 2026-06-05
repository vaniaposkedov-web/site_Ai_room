import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Sparkles,
  Image as ImageIcon,
  Layers,
  MessageCircle,
  Spade,
  Heart,
  Diamond,
  Club,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ─────────────────────────────────
   Data
───────────────────────────────── */
type PresetId = 'clothes' | 'beauty' | 'electronics' | 'home'

interface FlipCardData {
  icon: LucideIcon
  suit: LucideIcon
  suitColor: string
  rank: string
  title: string
  metric: string
  metricLabel: string
  back: string
}

const PRESETS: { id: PresetId; label: string; hint: string }[] = [
  { id: 'clothes',     label: 'Одежда',      hint: 'Одежда, обувь и аксессуары' },
  { id: 'beauty',      label: 'Косметика',   hint: 'Косметика, уход и парфюм'   },
  { id: 'electronics', label: 'Электроника', hint: 'Гаджеты и техника'          },
  { id: 'home',        label: 'Для дома',    hint: 'Товары для дома и интерьер' },
]

const SUITS = {
  spade:   { icon: Spade,   color: '#FFE135' },
  heart:   { icon: Heart,   color: '#FF6F6F' },
  diamond: { icon: Diamond, color: '#FFE135' },
  club:    { icon: Club,    color: '#A3A3A3' },
} as const

const DECKS: Record<PresetId, FlipCardData[]> = {
  clothes: [
    { icon: ImageIcon,    suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'Студийное фото',  metric: '×20',  metricLabel: 'к скорости',  back: 'Фотосессия одежды без студии и моделей — за секунды.' },
    { icon: Layers,       suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'Замена фона',     metric: '−90%', metricLabel: 'на ретушь',   back: 'Чистый белый или lifestyle-фон карточки в один клик.' },
    { icon: Sparkles,     suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q', title: 'Инфографика',     metric: '+35%', metricLabel: 'к CTR',       back: 'Преимущества, состав и размеры прямо на фото товара.' },
    { icon: MessageCircle,suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI-описание',     metric: '×8',   metricLabel: 'к выдаче',    back: 'Продающий текст с SEO-ключами под Wildberries и Ozon.' },
  ],
  beauty: [
    { icon: ImageIcon,    suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'Макро-съёмка',    metric: '×15',  metricLabel: 'к скорости',  back: 'Текстуры и упаковка крупным планом без фотографа.' },
    { icon: Layers,       suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'Чистый фон',      metric: '−85%', metricLabel: 'на ретушь',   back: 'Аккуратный фон и мягкие блики под бьюти-полку.' },
    { icon: Sparkles,     suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q', title: 'Состав на фото',  metric: '+28%', metricLabel: 'к доверию',   back: 'Ключевые компоненты и эффект — прямо на карточке.' },
    { icon: MessageCircle,suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI-описание',     metric: '×7',   metricLabel: 'к охвату',    back: 'Тексты с ключами «сыворотка», «уход», «крем» и т.д.' },
  ],
  electronics: [
    { icon: ImageIcon,    suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'Ракурсы товара',  metric: '×12',  metricLabel: 'к скорости',  back: 'Несколько чистых ракурсов гаджета из одного фото.' },
    { icon: Layers,       suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'Фон и тени',      metric: '−80%', metricLabel: 'на студию',   back: 'Студийный фон и мягкие тени за секунды.' },
    { icon: Sparkles,     suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q', title: 'Характеристики',  metric: '+30%', metricLabel: 'к CTR',       back: 'Главные характеристики выносим на обложку карточки.' },
    { icon: MessageCircle,suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI-описание',     metric: '×9',   metricLabel: 'к выдаче',    back: 'Описание с моделью, портами и параметрами товара.' },
  ],
  home: [
    { icon: ImageIcon,    suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'Lifestyle-сцена', metric: '×18',  metricLabel: 'к скорости',  back: 'Товар в интерьере без выездной съёмки.' },
    { icon: Layers,       suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'Замена фона',     metric: '−88%', metricLabel: 'на ретушь',   back: 'Под каталог или под уютную домашнюю сцену.' },
    { icon: Sparkles,     suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q', title: 'Инфографика',     metric: '+33%', metricLabel: 'к CTR',       back: 'Размеры, материал и уход — прямо на фото.' },
    { icon: MessageCircle,suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI-описание',     metric: '×8',   metricLabel: 'к выдаче',    back: 'Тексты под поисковые запросы маркетплейса.' },
  ],
}

/* ─────────────────────────────────
   Single flippable card
───────────────────────────────── */
function FlipCard({
  card,
  index,
  presetId,
  isFlipped,
  onClick,
}: {
  card: FlipCardData
  index: number
  presetId: PresetId
  isFlipped: boolean
  onClick: () => void
}) {
  const Icon = card.icon
  const Suit = card.suit

  // Combined flip: 180 if back-side, 0 if front; key on preset forces re-mount + entry animation
  return (
    <div className="relative perspective-1200 w-full aspect-[3/4]">
      <AnimatePresence mode="wait">
        <motion.div
          key={presetId}
          initial={{ rotateY: -180, opacity: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1 }}
          exit={{ rotateY: 180, opacity: 0 }}
          transition={{
            duration: 0.7,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full h-full preserve-3d cursor-pointer"
          onClick={onClick}
          whileHover={{ y: -6 }}
        >
          {/* FRONT face */}
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden">
            {/* Card corners — rank + suit */}
            <div className="absolute top-3 left-3 flex flex-col items-center">
              <span className="font-display font-black text-2xl leading-none" style={{ color: card.suitColor }}>
                {card.rank}
              </span>
              <Suit size={14} fill={card.suitColor} stroke={card.suitColor} />
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col items-center rotate-180">
              <span className="font-display font-black text-2xl leading-none" style={{ color: card.suitColor }}>
                {card.rank}
              </span>
              <Suit size={14} fill={card.suitColor} stroke={card.suitColor} />
            </div>

            {/* Subtle texture */}
            <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

            {/* Center icon disk */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                className="w-14 h-14 rounded-2xl bg-[#FFE135] flex items-center justify-center mb-3"
                style={{ boxShadow: '0 8px 22px rgba(255,225,53,0.25)' }}
              >
                <Icon size={24} className="text-[#262626]" strokeWidth={2.2} />
              </motion.div>
              <div className="font-display font-bold text-white text-sm tracking-tight leading-tight max-w-[160px]">
                {card.title}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl" style={{ color: card.suitColor }}>
                  {card.metric}
                </span>
                <span className="text-[10px] text-white/40">{card.metricLabel}</span>
              </div>
              <div className="mt-4 text-[9px] uppercase tracking-widest font-mono text-white/25">
                tap to flip
              </div>
            </div>
          </div>

          {/* BACK face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-[#FFE135]/30"
            style={{
              background:
                'linear-gradient(135deg, #1f1f1f 0%, #161616 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(255,225,53,0.08)',
            }}
          >
            {/* Diamond pattern */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #FFE135 0 2px, transparent 2px 18px), repeating-linear-gradient(-45deg, #FFE135 0 2px, transparent 2px 18px)',
              }}
            />

            <div className="absolute inset-0 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#FFE135]/80">
                  Деталь
                </span>
                <Suit size={16} fill={card.suitColor} stroke={card.suitColor} />
              </div>
              <div className="font-display font-bold text-white text-sm leading-tight mb-2">
                {card.title}
              </div>
              <p className="text-white/65 text-[11px] leading-relaxed">{card.back}</p>
              <div className="mt-auto pt-4 border-t border-white/[0.08]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-xl" style={{ color: card.suitColor }}>
                    {card.metric}
                  </span>
                  <span className="text-[10px] text-white/40">{card.metricLabel}</span>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-widest font-mono text-white/25 rotate-180">
                tap to flip
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function FlipDeck() {
  const [presetId, setPresetId] = useState<PresetId>('clothes')
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const [autoCycle, setAutoCycle] = useState(true)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, amount: 0.25 })

  // Auto-shuffle presets every few seconds (pauses when user is interacting)
  useEffect(() => {
    if (!autoCycle || !inView) return
    const id = setInterval(() => {
      setPresetId((prev) => {
        const ids = PRESETS.map((p) => p.id)
        const i = ids.indexOf(prev)
        return ids[(i + 1) % ids.length]
      })
      setFlippedCards({})
    }, 5500)
    return () => clearInterval(id)
  }, [autoCycle, inView])

  const onPresetChange = (id: PresetId) => {
    setPresetId(id)
    setFlippedCards({})
    setAutoCycle(false)
  }

  const onCardClick = (i: number) =>
    setFlippedCards((m) => ({ ...m, [i]: !m[i] }))

  const deck = DECKS[presetId]

  return (
    <section id="flip-deck" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      {/* CSS grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/4 left-0 w-[420px] h-[420px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge mx-auto mb-5"
          >
            <Sparkles size={11} />
            Что умеет нейросеть
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Полный набор <span className="text-gradient">для карточки</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Выберите категорию товара — четыре карты покажут, что нейросеть
            сделает с вашей карточкой: фото, фон, инфографика и описание.
          </motion.p>
        </div>

        {/* Preset switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-1 p-1 bg-[#1A1A1A] border border-white/[0.07] rounded-2xl flex-wrap justify-center">
            {PRESETS.map((p) => {
              const isActive = p.id === presetId
              return (
                <button
                  key={p.id}
                  onClick={() => onPresetChange(p.id)}
                  className="relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors"
                  style={{ color: isActive ? '#262626' : 'rgba(255,255,255,0.55)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="flip-deck-tab"
                      className="absolute inset-0 rounded-xl bg-[#FFE135]"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {deck.map((card, i) => (
            <FlipCard
              key={`${presetId}-${i}`}
              card={card}
              index={i}
              presetId={presetId}
              isFlipped={!!flippedCards[i]}
              onClick={() => onCardClick(i)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-center gap-3 mt-10 text-[11px] text-white/35">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE135] animate-pulse" />
            {PRESETS.find((p) => p.id === presetId)?.hint}
          </span>
          <span className="w-px h-3 bg-white/15" />
          <button
            onClick={() => setAutoCycle((v) => !v)}
            className="text-white/45 hover:text-[#FFE135] transition-colors"
          >
            {autoCycle ? '⏸ Остановить автосмену' : '▶ Запустить автосмену'}
          </button>
        </div>
      </div>
    </section>
  )
}
