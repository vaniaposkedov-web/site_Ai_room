import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Loader2, Check, ChevronDown, Wand2, Sparkles, Home, Camera, User, Type } from 'lucide-react'
import { useWizard, type GenMode } from '../store'
import { improvePrompt, hasAIKey } from '@/lib/ai'

const COST = 3
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=80`

const POOLS: Record<GenMode, string[]> = {
  interior: [u('1493663284031-b7e3aefcae8e'), u('1490481651871-ab68de25d43d'), u('1505691938895-1758d7feb511'), u('1586023492125-27b2c045efd7')],
  studio: [u('1600185365926-3a2ce3cdb9eb'), u('1483985988355-763728e1935b'), u('1618221195710-dd6b41faaea6'), u('1492447166138-50c3889fccb1')],
  person: [u('1469334031218-e382a71b716b'), u('1490481651871-ab68de25d43d'), u('1492447166138-50c3889fccb1'), u('1483985988355-763728e1935b')],
  custom: [u('1535223289827-42f1e9919769'), u('1505740420928-5e560c06d30e'), u('1600185365926-3a2ce3cdb9eb'), u('1618221195710-dd6b41faaea6')],
}

const MODES: { id: GenMode; label: string; icon: typeof Home }[] = [
  { id: 'interior', label: 'В интерьере', icon: Home },
  { id: 'studio', label: 'Студия', icon: Camera },
  { id: 'person', label: 'На модели', icon: User },
  { id: 'custom', label: 'Свой фон', icon: Type },
]

const ASPECTS: { id: '3:4' | '1:1' | '16:9'; label: string }[] = [
  { id: '3:4', label: '3:4 · WB' },
  { id: '1:1', label: '1:1 · Ozon' },
  { id: '16:9', label: '16:9' },
]
const LIGHTS: { id: 'auto' | 'left' | 'right' | 'top'; label: string }[] = [
  { id: 'auto', label: 'Авто' },
  { id: 'left', label: 'Слева' },
  { id: 'right', label: 'Справа' },
  { id: 'top', label: 'Сверху' },
]

export default function Step2Studio() {
  const g = useWizard((s) => s.generationSettings)
  const setGen = useWizard((s) => s.setGenSettings)
  const balance = useWizard((s) => s.balance)
  const deductBalance = useWizard((s) => s.deductBalance)
  const results = useWizard((s) => s.generatedResults)
  const setResults = useWizard((s) => s.setGeneratedResults)
  const selectedResult = useWizard((s) => s.selectedResult)
  const setSelectedResult = useWizard((s) => s.setSelectedResult)
  const setToast = useWizard((s) => s.setToast)

  const [busy, setBusy] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [ideaLoading, setIdeaLoading] = useState(false)

  const ratioClass = g.aspectRatio === '1:1' ? 'aspect-square' : g.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[3/4]'

  const generate = () => {
    if (busy) return
    if (balance < COST) { setToast('Недостаточно звёзд. Пополните баланс.'); return }
    deductBalance(COST)
    setBusy(true)
    setTimeout(() => {
      const pool = POOLS[g.mode]
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      setResults([...shuffled, ...results].slice(0, 12))
      setBusy(false)
    }, 2600)
  }

  const improve = async () => {
    if (!hasAIKey()) { setToast('AI-ключ не задан'); return }
    setIdeaLoading(true)
    try {
      const improved = await improvePrompt(g.prompt, g.mode)
      if (improved) setGen({ prompt: improved })
    } catch {
      setToast('Не удалось улучшить промпт')
    } finally {
      setIdeaLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      {/* ── SIDEBAR ── */}
      <div className="flex flex-col gap-4">
        {/* mode tabs */}
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => {
            const Icon = m.icon
            const active = g.mode === m.id
            return (
              <button
                key={m.id}
                onClick={() => setGen({ mode: m.id })}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
                style={{
                  borderColor: active ? '#FFE135' : 'rgba(255,255,255,0.1)',
                  background: active ? 'rgba(255,225,53,0.12)' : 'transparent',
                  color: active ? '#FFE135' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={15} /> {m.label}
              </button>
            )
          })}
        </div>

        {/* prompt */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] uppercase tracking-widest text-white/30">Пожелания (промпт)</label>
            <button
              onClick={improve}
              disabled={ideaLoading}
              className="flex items-center gap-1 text-[11px] font-semibold text-brand-yellow hover:underline disabled:opacity-50"
            >
              {ideaLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Идея
            </button>
          </div>
          <textarea
            value={g.prompt}
            onChange={(e) => setGen({ prompt: e.target.value })}
            rows={4}
            placeholder={g.mode === 'person' ? 'Товар в руках модели, естественный свет…' : 'Товар на мраморной столешнице, мягкий свет из окна…'}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20 resize-none"
          />
        </div>

        {/* advanced */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] overflow-hidden">
          <button onClick={() => setAdvanced((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/70 hover:text-white">
            Продвинутые настройки
            <motion.span animate={{ rotate: advanced ? 180 : 0 }}><ChevronDown size={16} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {advanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3">
                  {/* aspect ratio */}
                  <div>
                    <div className="text-[11px] text-white/40 mb-1.5">Соотношение сторон</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {ASPECTS.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setGen({ aspectRatio: a.id })}
                          className="py-2 rounded-lg border text-[12px] font-semibold transition-colors"
                          style={{
                            borderColor: g.aspectRatio === a.id ? '#FFE135' : 'rgba(255,255,255,0.1)',
                            color: g.aspectRatio === a.id ? '#FFE135' : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* lighting */}
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5">Освещение</label>
                    <select
                      value={g.lighting}
                      onChange={(e) => setGen({ lighting: e.target.value as typeof g.lighting })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40"
                    >
                      {LIGHTS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                  </div>
                  {/* negative */}
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5">Негативный промпт</label>
                    <input
                      value={g.negativePrompt}
                      onChange={(e) => setGen({ negativePrompt: e.target.value })}
                      placeholder="люди, текст, лишние предметы…"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* generate */}
        <button
          onClick={generate}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold disabled:opacity-50 disabled:cursor-not-allowed lg:sticky lg:bottom-4"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
          Сгенерировать <span className="flex items-center gap-0.5">({COST} <Star size={12} fill="currentColor" />)</span>
        </button>
      </div>

      {/* ── RESULTS GRID ── */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Результаты {results.length > 0 && `· ${results.length}`}</div>
        {results.length === 0 && !busy ? (
          <div className="rounded-2xl border border-dashed border-white/10 h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <Wand2 size={28} className="text-white/20 mb-3" />
            <div className="text-white/40 text-sm">Настройте сцену слева и нажмите «Сгенерировать»</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {busy && Array.from({ length: 3 }).map((_, i) => (
              <div key={`sk-${i}`} className={`${ratioClass} rounded-xl bg-white/[0.04] animate-pulse relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={20} className="text-brand-yellow/60 animate-spin" />
                </div>
              </div>
            ))}
            {results.map((url, i) => {
              const active = url === selectedResult
              return (
                <button
                  key={url + i}
                  onClick={() => setSelectedResult(url)}
                  className={`relative ${ratioClass} rounded-xl overflow-hidden bg-[#141414] group`}
                  style={{ boxShadow: active ? '0 0 0 2px #FFE135' : '0 0 0 1px rgba(255,255,255,0.08)' }}
                >
                  <img src={url} alt={`результат ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  {active && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFE135] flex items-center justify-center">
                      <Check size={13} className="text-[#262626]" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
