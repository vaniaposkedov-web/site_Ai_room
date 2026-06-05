import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Sparkles,
  TrendingUp,
  Bot,
  Target,
  Image as ImageIcon,
  Layers,
  Zap,
  Ruler,
  ShoppingBag,
  Eye,
  Tag,
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
type PresetId = 'ecom' | 'fashion' | 'beauty' | 'b2b'

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
  { id: 'ecom',    label: 'E-commerce', hint: 'Маркетплейсы и онлайн-магазины' },
  { id: 'fashion', label: 'Fashion',    hint: 'Одежда, lookbook, lifestyle'    },
  { id: 'beauty',  label: 'Beauty',     hint: 'Косметика, уход, парфюмерия'    },
  { id: 'b2b',     label: 'B2B SaaS',   hint: 'Корпоративные AI-агенты'        },
]

const SUITS = {
  spade:   { icon: Spade,   color: '#FFE135' },
  heart:   { icon: Heart,   color: '#FF6F6F' },
  diamond: { icon: Diamond, color: '#FFE135' },
  club:    { icon: Club,    color: '#A3A3A3' },
} as const

const DECKS: Record<PresetId, FlipCardData[]> = {
  ecom: [
    { icon: Sparkles,   suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A',  title: 'AI Контент-студия', metric: '×12',  metricLabel: 'к скорости',  back: 'Тысячи карточек товаров за день — фото, описание, инфографика.' },
    { icon: TrendingUp, suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K',  title: 'AI Прайсинг',        metric: '+90%', metricLabel: 'маржи',       back: 'Динамические цены с учётом конкурентов и спроса в реальном времени.' },
    { icon: Bot,        suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q',  title: 'AI Поддержка 24/7',  metric: '−65%', metricLabel: 'тикетов',     back: 'Многоязычный чат-бот, который ведёт сделку до оплаты.' },
    { icon: Target,     suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J',  title: 'AI Ретаргет',        metric: '×3.2', metricLabel: 'ROAS',        back: 'Сегменты по поведению + автоматические креативы для каждого.' },
  ],
  fashion: [
    { icon: ImageIcon, suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A',  title: 'Виртуальная съёмка', metric: '−85%', metricLabel: 'на студию',  back: 'Любой образ на модели за 12 секунд — без аренды и логистики.' },
    { icon: Layers,    suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K',  title: 'AI Lookbook',         metric: '×8',   metricLabel: 'к коллажам', back: 'Готовые сеты из 5–7 вещей с фоном и аксессуарами.' },
    { icon: Ruler,     suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q',  title: 'Размерный AI',        metric: '−42%', metricLabel: 'возвратов',  back: 'Точная рекомендация размера по антропометрии покупателя.' },
    { icon: ShoppingBag,suit: SUITS.club.icon,   suitColor: SUITS.club.color,    rank: 'J',  title: 'AI Стилист',          metric: '+58%', metricLabel: 'AOV',        back: 'Подбор сочетающихся вещей в чате и на карточке товара.' },
  ],
  beauty: [
    { icon: Eye,         suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'Try-On зеркало',  metric: '×4.1',  metricLabel: 'к конверсии', back: 'Помада, тени, тон — примерка через камеру за секунду.' },
    { icon: Sparkles,    suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'AI Уход-диагноз', metric: '+72%',  metricLabel: 'к LTV',       back: 'Опросник + фото → персональный rouitne и рекомендации.' },
    { icon: MessageCircle,suit: SUITS.diamond.icon,suitColor: SUITS.diamond.color, rank: 'Q', title: 'AI Консьерж',     metric: '24/7',  metricLabel: 'ответы',      back: 'Эксперт по ингредиентам и противопоказаниям в один клик.' },
    { icon: Tag,         suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI Naming',       metric: '×6',    metricLabel: 'к запускам',  back: 'Тестируем нейминг и упаковку до релиза — по сегментам.' },
  ],
  b2b: [
    { icon: Bot,        suit: SUITS.spade.icon,   suitColor: SUITS.spade.color,   rank: 'A', title: 'AI Sales Copilot', metric: '+34%', metricLabel: 'win-rate',     back: 'Контекст по сделке, follow-up и подсказки в реальном времени.' },
    { icon: Layers,     suit: SUITS.heart.icon,   suitColor: SUITS.heart.color,   rank: 'K', title: 'RAG Knowledge',    metric: '×9',   metricLabel: 'к скорости',   back: 'Ответы по внутренней документации с цитатами и источниками.' },
    { icon: TrendingUp, suit: SUITS.diamond.icon, suitColor: SUITS.diamond.color, rank: 'Q', title: 'AI Аналитик',      metric: '−70%', metricLabel: 'к репортам',   back: 'SQL-запросы и дашборды на естественном языке.' },
    { icon: Zap,        suit: SUITS.club.icon,    suitColor: SUITS.club.color,    rank: 'J', title: 'AI Workflow',      metric: '×5',   metricLabel: 'продуктивности', back: 'Автономные агенты для триажа, эскалации и тикетов.' },
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
  const [presetId, setPresetId] = useState<PresetId>('ecom')
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
            Колода AI-сценариев
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Каждая настройка — <span className="text-gradient">новый расклад</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Выберите индустрию — четыре карты перевернутся по очереди, как в покере, и покажут самые
            эффективные AI-механики для вас.
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
