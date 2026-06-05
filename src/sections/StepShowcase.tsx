import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Upload, Wand2, Sparkles, CheckCircle2 } from 'lucide-react'

/* ─────────────────────────────────
   Data
───────────────────────────────── */
type ConceptId = 'studio' | 'interior' | 'composition'
type ProductId = 'dress' | 'serum' | 'chair'

interface ProductData {
  id: ProductId
  label: string
  caption: string
  raw: string
  concepts: Record<ConceptId, string>
  final: { img: string; tags: string[] }
}

const PRODUCTS: ProductData[] = [
  {
    id: 'dress',
    label: 'Платье',
    caption: 'Sundress · 38 RU',
    raw: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=720&q=80',
    concepts: {
      studio:      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=720&q=80',
      interior:    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=720&q=80',
      composition: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=720&q=80',
    },
    final: {
      img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=720&q=80',
      tags: ['Летнее платье', 'Комфорт и легкость', 'Идеально для теплых дней'],
    },
  },
  {
    id: 'serum',
    label: 'Сыворотка',
    caption: 'Vitamin C · 30 мл',
    raw: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=720&q=80',
    concepts: {
      studio:      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=720&q=80',
      interior:    'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=720&q=80',
      composition: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=720&q=80',
    },
    final: {
      img: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=720&q=80',
      tags: ['Антиоксидантная защита', 'Витамин C 15%', 'Сияние с первого применения'],
    },
  },
  {
    id: 'chair',
    label: 'Стул',
    caption: 'Oak Chair · scandi',
    raw: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=720&q=80',
    concepts: {
      studio:      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=720&q=80',
      interior:    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=720&q=80',
      composition: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=720&q=80',
    },
    final: {
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=720&q=80',
      tags: ['Скандинавский стиль', 'Натуральный дуб', 'Эргономика сидения'],
    },
  },
]

const CONCEPTS: { id: ConceptId; label: string; sub: string }[] = [
  { id: 'studio',      label: 'Студия',     sub: 'Чистый фон, мягкий свет' },
  { id: 'interior',    label: 'Интерьер',   sub: 'Уютная домашняя сцена'   },
  { id: 'composition', label: 'Композиция', sub: 'Flat-lay с аксессуарами' },
]

const STEPS = [
  { num: '01', label: 'Загрузка',   icon: Upload,    title: 'Загрузите товар',       desc: 'Любое бытовое фото — на вешалке, на столе, на полу.' },
  { num: '02', label: 'Концепция',  icon: Wand2,     title: 'Выберите концепцию',    desc: 'AIROOM подбирает свет, фон и реквизит за вас.' },
  { num: '03', label: 'Результат',  icon: Sparkles,  title: 'Получите карточку',     desc: 'Готовый визуал и инфографика для маркетплейса.' },
] as const

/* ─────────────────────────────────
   Step shell — numbered badge + title
───────────────────────────────── */
function StepShell({
  step,
  active,
  index,
  children,
}: {
  step: (typeof STEPS)[number]
  active: boolean
  index: number
  children: React.ReactNode
}) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Top badge */}
      <div className="flex items-center gap-3 mb-5">
        <motion.div
          animate={{
            borderColor: active ? 'rgba(255,225,53,0.85)' : 'rgba(255,255,255,0.08)',
            boxShadow: active
              ? '0 0 0 4px rgba(255,225,53,0.08), 0 0 24px rgba(255,225,53,0.35)'
              : '0 0 0 0 rgba(255,225,53,0)',
          }}
          transition={{ duration: 0.4 }}
          className="w-12 h-12 rounded-full bg-[#1A1A1A] border flex items-center justify-center"
        >
          <span className="font-display font-black text-sm text-white tracking-tight">{step.num}</span>
        </motion.div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30 font-mono">
            <Icon size={11} className="text-[#FFE135]" />
            {step.label}
          </div>
          <div className="font-display font-bold text-white text-base leading-tight mt-0.5">
            {step.title}
          </div>
        </div>
      </div>

      <p className="text-white/45 text-[13px] leading-relaxed mb-4 max-w-[260px]">{step.desc}</p>

      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────
   Step 1 — product picker
───────────────────────────────── */
function Step1({
  productId,
  setProductId,
}: {
  productId: ProductId
  setProductId: (id: ProductId) => void
}) {
  const active = PRODUCTS.find((p) => p.id === productId)!

  return (
    <div className="grid grid-cols-[64px_1fr] gap-3">
      {/* Mini gallery */}
      <div className="flex flex-col gap-2.5">
        {PRODUCTS.map((p) => {
          const isOn = p.id === productId
          return (
            <button
              key={p.id}
              onClick={() => setProductId(p.id)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#141414] group"
              aria-label={p.label}
            >
              <img src={p.raw} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
              <motion.div
                initial={false}
                animate={{
                  opacity: isOn ? 1 : 0,
                  boxShadow: isOn
                    ? 'inset 0 0 0 2px #FFE135, 0 0 18px rgba(255,225,53,0.45)'
                    : 'inset 0 0 0 0 transparent',
                }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 rounded-xl pointer-events-none"
              />
              <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white/80 bg-black/45 backdrop-blur-sm px-1 py-0.5 rounded-md text-center truncate">
                {p.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#141414] aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={active.raw}
              alt={active.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-widest font-mono bg-black/55 backdrop-blur-md px-2 py-1 rounded-md text-white/70">
          RAW · оригинал
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <div className="text-[10px] text-[#FFE135] font-mono">{active.caption}</div>
          <div className="text-sm font-display font-bold text-white">{active.label}</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Step 2 — concept picker
───────────────────────────────── */
function Step2({
  productId,
  conceptId,
  setConceptId,
}: {
  productId: ProductId
  conceptId: ConceptId
  setConceptId: (id: ConceptId) => void
}) {
  const product = PRODUCTS.find((p) => p.id === productId)!
  const imgSrc = product.concepts[conceptId]

  return (
    <div className="grid grid-cols-[96px_1fr] gap-3">
      {/* Concept list */}
      <div className="flex flex-col gap-2">
        {CONCEPTS.map((c) => {
          const isOn = c.id === conceptId
          return (
            <button
              key={c.id}
              onClick={() => setConceptId(c.id)}
              className="relative w-full text-left px-2.5 py-2 rounded-xl bg-[#141414] overflow-hidden group"
            >
              {isOn && (
                <motion.span
                  layoutId="concept-ring"
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    boxShadow:
                      'inset 0 0 0 1.5px #FFE135, 0 0 18px rgba(255,225,53,0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                />
              )}
              <div
                className={`text-[11px] font-display font-bold ${
                  isOn ? 'text-[#FFE135]' : 'text-white/85'
                }`}
              >
                {c.label}
              </div>
              <div className="text-[9px] text-white/35 leading-snug mt-0.5">{c.sub}</div>
            </button>
          )
        })}
      </div>

      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#141414] aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${productId}-${conceptId}`}
            initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img src={imgSrc} alt={conceptId} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-widest font-mono bg-[#FFE135]/15 border border-[#FFE135]/30 backdrop-blur-md px-2 py-1 rounded-md text-[#FFE135] font-bold">
          AI · {CONCEPTS.find((c) => c.id === conceptId)!.label}
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <div className="text-[10px] text-[#FFE135] font-mono">Концепция применена</div>
          <div className="text-sm font-display font-bold text-white">
            {product.label} · {CONCEPTS.find((c) => c.id === conceptId)!.label.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Step 3 — final card + infographic
───────────────────────────────── */
function Step3({ productId }: { productId: ProductId }) {
  const product = PRODUCTS.find((p) => p.id === productId)!

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#141414] aspect-[4/5]">
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={product.final.img} alt="result" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Top status pill */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#FFE135] text-[#262626] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md"
      >
        <Sparkles size={10} strokeWidth={2.5} />
        Готово
      </motion.div>

      {/* Infographic plates */}
      <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-1.5">
        {product.final.tags.map((tag, i) => (
          <motion.div
            key={`${product.id}-${tag}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg"
          >
            <CheckCircle2 size={12} className="text-[#FFE135] flex-shrink-0" />
            <span className="text-[11px] font-medium text-white leading-tight">{tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function StepShowcase() {
  const [productId, setProductId] = useState<ProductId>('dress')
  const [conceptId, setConceptId] = useState<ConceptId>('studio')

  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="step-showcase" className="relative py-24 px-6 overflow-hidden">
      {/* CSS grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-32 right-0 w-[420px] h-[420px] rounded-full bg-[#FFE135]/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-[#FFE135]/[0.03] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            className="badge mx-auto mb-5"
          >
            <Sparkles size={11} />
            Live-демо
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            3 шага <span className="text-gradient">— и готово</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            className="text-white/45 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Поэкспериментируйте сами — выбирайте товар и концепцию, наблюдайте,
            как готовая карточка собирается в реальном времени.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          <div className="glass-card p-5">
            <StepShell step={STEPS[0]} index={0} active>
              <Step1 productId={productId} setProductId={setProductId} />
            </StepShell>
          </div>
          <div className="glass-card p-5">
            <StepShell step={STEPS[1]} index={1} active>
              <Step2
                productId={productId}
                conceptId={conceptId}
                setConceptId={setConceptId}
              />
            </StepShell>
          </div>
          <div className="glass-card p-5">
            <StepShell step={STEPS[2]} index={2} active>
              <Step3 productId={productId} />
            </StepShell>
          </div>
        </div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-white/30 text-xs"
        >
          Подсказка: щёлкните по миниатюре товара или концепции — карточка перерисуется автоматически.
        </motion.div>
      </div>
    </section>
  )
}
