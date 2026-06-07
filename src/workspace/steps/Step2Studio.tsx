import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Loader2, Check, Sparkles, ChevronDown, Eye, Pipette, Wand2 } from 'lucide-react'
import { useWizard } from '../store'

const COST = 3
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&q=80`

const A = u('1483985988355-763728e1935b')
const B = u('1493663284031-b7e3aefcae8e')
const C = u('1535223289827-42f1e9919769')
const D = u('1600185365926-3a2ce3cdb9eb')
const E = u('1469334031218-e382a71b716b')
const F = u('1618221195710-dd6b41faaea6')
const G = u('1490481651871-ab68de25d43d')
const H = u('1492447166138-50c3889fccb1')
const I = u('1505740420928-5e560c06d30e')

const PRESETS = [
  { id: 'podium', label: 'Подиум', imgs: [A, H] },
  { id: 'home', label: 'Уютный дом', imgs: [B, G] },
  { id: 'cyber', label: 'Киберпанк', imgs: [C, I] },
  { id: 'studio', label: 'Студия', imgs: [D, A] },
  { id: 'nature', label: 'Природа', imgs: [E, B] },
  { id: 'marble', label: 'Мрамор', imgs: [F, G] },
]
const POOL = [A, B, C, D, E, F, G, H, I]

const SWATCHES = ['#EF4444', '#22C55E', '#3B82F6', '#111111', '#FFFFFF', '#D9C8A9']
const STATUSES = ['Анализ геометрии…', 'Расчёт освещения…', 'Рендеринг фона…']

const LIGHT = ['Слева', 'Справа', 'Сверху', 'Рассеянный']
const ANGLE = ['Прямо', 'Сверху (Flatlay)', 'Снизу']

const CHECKER = {
  backgroundImage:
    'repeating-conic-gradient(#242424 0% 25%, #1a1a1a 0% 50%)',
  backgroundSize: '22px 22px',
}

export default function Step2Studio() {
  const productData = useWizard((s) => s.productData)
  const balance = useWizard((s) => s.balance)
  const deductBalance = useWizard((s) => s.deductBalance)
  const updateProductData = useWizard((s) => s.updateProductData)
  const addHistory = useWizard((s) => s.addHistory)
  const history = useWizard((s) => s.history)
  const setToast = useWizard((s) => s.setToast)

  const [busy, setBusy] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  // controls
  const [prompt, setPrompt] = useState('')
  const [accent, setAccent] = useState('#22C55E')
  const [advanced, setAdvanced] = useState(false)
  const [light, setLight] = useState(LIGHT[3])
  const [angle, setAngle] = useState(ANGLE[0])
  const [negative, setNegative] = useState('')
  const [scale, setScale] = useState(100)

  const product = productData.processedImage || productData.originalImage

  // cycling status text while generating
  useEffect(() => {
    if (!busy) return
    setStatusIdx(0)
    const id = setInterval(() => setStatusIdx((i) => Math.min(i + 1, STATUSES.length - 1)), 1000)
    return () => clearInterval(id)
  }, [busy])

  const generate = (imgs: string[], presetId?: string) => {
    if (busy) return
    if (balance < COST) {
      setToast('Недостаточно звёзд. Пополните баланс.')
      return
    }
    if (presetId) setSelected(presetId)
    deductBalance(COST)
    setBusy(true)
    setTimeout(() => {
      const current = productData.finalImage
      const opts = imgs.filter((i) => i !== current)
      const pick = (opts.length ? opts : imgs)[Math.floor(Math.random() * (opts.length || imgs.length))]
      updateProductData({ finalImage: pick })
      addHistory(pick)
      setShowOriginal(false)
      setBusy(false)
    }, 3000)
  }

  const pickHistory = (url: string) => {
    updateProductData({ finalImage: url })
    setShowOriginal(false)
  }

  const mainSrc = showOriginal ? product : productData.finalImage

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* ── LEFT: preview + history ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest text-white/30">Превью</div>
          {productData.finalImage && !busy && (
            <button
              onClick={() => setShowOriginal((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-brand-yellow transition-colors"
            >
              <Eye size={13} /> {showOriginal ? 'Показать результат' : 'Показать оригинал (До)'}
            </button>
          )}
        </div>

        <div className="relative w-full max-w-[440px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08]" style={CHECKER}>
          {/* base layer */}
          {productData.finalImage ? (
            <img src={mainSrc || ''} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : product ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img
                src={product}
                alt="product"
                style={{ transform: `scale(${scale / 100})` }}
                className="max-w-full max-h-full object-contain transition-transform drop-shadow-2xl"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">Нет изображения</div>
          )}

          {/* badges */}
          {productData.finalImage && !busy && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#FFE135] text-[#262626] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
              {showOriginal ? 'До' : <><Sparkles size={10} /> AI Studio</>}
            </div>
          )}
          {!productData.finalImage && product && !busy && (
            <div className="absolute top-2.5 left-2.5 bg-black/55 backdrop-blur-md text-white/70 text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md">
              Товар · до фона
            </div>
          )}

          {/* scanning animation */}
          <AnimatePresence>
            {busy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center overflow-hidden"
              >
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-brand-yellow"
                  style={{ boxShadow: '0 0 16px 4px rgba(255,225,53,0.7)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'linear-gradient(rgba(255,225,53,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,225,53,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                />
                <Loader2 size={26} className="text-brand-yellow animate-spin mb-3 relative z-10" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={statusIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-brand-yellow text-sm font-mono relative z-10"
                  >
                    {STATUSES[statusIdx]}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* product size slider (до генерации) */}
        {!productData.finalImage && (
          <div className="max-w-[440px] mx-auto mt-4">
            <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
              <span>Размер товара в кадре</span>
              <span className="text-brand-yellow font-semibold">{scale}%</span>
            </div>
            <input type="range" min={50} max={130} step={1} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[#FFE135] cursor-pointer" />
          </div>
        )}

        {/* history gallery */}
        {history.length > 0 && (
          <div className="max-w-[440px] mx-auto mt-5">
            <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">История генераций</div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {history.map((url, i) => {
                const active = url === productData.finalImage
                return (
                  <button
                    key={url + i}
                    onClick={() => pickHistory(url)}
                    className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-[#141414]"
                    style={{ boxShadow: active ? '0 0 0 2px #FFE135' : '0 0 0 1px rgba(255,255,255,0.08)' }}
                  >
                    <img src={url} alt={`вариант ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    {active && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FFE135] flex items-center justify-center">
                        <Check size={10} className="text-[#262626]" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: controls ── */}
      <div className="space-y-5">
        {/* custom prompt */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-white/30 mb-2">Свой промпт (опционально)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Товар стоит на деревянном столе у окна, падают утренние лучи солнца…"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20 resize-none"
          />
          <button
            onClick={() => generate(POOL)}
            disabled={busy}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-yellow text-brand-dark font-display font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
            Сгенерировать <span className="flex items-center gap-0.5">({COST} <Star size={11} fill="currentColor" />)</span>
          </button>
        </div>

        {/* presets */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Готовые сцены</div>
          <div className="grid grid-cols-3 gap-2.5">
            {PRESETS.map((p) => {
              const isSel = selected === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => generate(p.imgs, p.id)}
                  disabled={busy}
                  className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#141414] border disabled:cursor-not-allowed"
                  style={{ borderColor: isSel ? '#FFE135' : 'rgba(255,255,255,0.08)' }}
                >
                  <img src={p.imgs[0]} alt={p.label} className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
                  <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white drop-shadow truncate">{p.label}</span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#262626] bg-[#FFE135] px-1 py-0.5 rounded">
                      {COST}<Star size={7} fill="currentColor" />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* color palette */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Цветовая гамма</div>
          <div className="flex items-center gap-2 flex-wrap">
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{ background: c, borderColor: accent === c ? '#FFE135' : 'rgba(255,255,255,0.15)' }}
                aria-label={c}
              />
            ))}
            <label className="relative w-7 h-7 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-brand-yellow/50" title="Своя пипетка">
              <Pipette size={13} className="text-white/50" />
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
            <span className="text-[11px] text-white/40 ml-1">{accent}</span>
          </div>
        </div>

        {/* advanced accordion */}
        <div className="rounded-xl border border-white/[0.08] bg-[#161616] overflow-hidden">
          <button onClick={() => setAdvanced((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/70 hover:text-white">
            Продвинутые настройки
            <motion.span animate={{ rotate: advanced ? 180 : 0 }}><ChevronDown size={16} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {advanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3">
                  <Select label="Направление света" value={light} onChange={setLight} options={LIGHT} />
                  <Select label="Ракурс камеры" value={angle} onChange={setAngle} options={ANGLE} />
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5">Негативный промпт</label>
                    <textarea
                      value={negative}
                      onChange={(e) => setNegative(e.target.value)}
                      rows={2}
                      placeholder="люди, текст, лишние предметы…"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[11px] text-white/30">Каждая генерация — {COST} ⭐. Удачные варианты сохраняются в историю слева.</p>
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-[11px] text-white/40 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
