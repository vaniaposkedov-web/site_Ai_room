import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Loader2, Check, ChevronDown, Wand2, Sparkles, Home, Camera, User, Type,
  Image as ImageIcon, LayoutGrid, Video, Plus, X, Play,
} from 'lucide-react'
import { useWizard, type GenMode, type GenType, type AspectRatio, type Resolution } from '../store'
import { improvePrompt, hasAIKey } from '@/lib/ai'
import AssetPicker from '../AssetPicker'

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
const GEN_TYPES: { id: GenType; label: string; icon: typeof ImageIcon }[] = [
  { id: 'photo', label: 'Фото', icon: ImageIcon },
  { id: 'card', label: 'Карточка', icon: LayoutGrid },
  { id: 'video', label: 'Видео', icon: Video },
]
const ASPECTS: AspectRatio[] = ['9:16', '3:4', '1:1', '4:3', '16:9']
const RES: Resolution[] = ['1K', '2K', '4K']
const STYLES: { id: 'commercial' | 'home'; label: string }[] = [
  { id: 'commercial', label: 'Коммерческий' },
  { id: 'home', label: 'Домашний' },
]
const LIGHTS: { id: 'auto' | 'left' | 'right' | 'top'; label: string }[] = [
  { id: 'auto', label: 'Авто' }, { id: 'left', label: 'Слева' }, { id: 'right', label: 'Справа' }, { id: 'top', label: 'Сверху' },
]
const RATIO_CSS: Record<AspectRatio, string> = { '9:16': '9/16', '3:4': '3/4', '1:1': '1/1', '4:3': '4/3', '16:9': '16/9' }
const BASE_COST: Record<GenType, number> = { photo: 3, card: 4, video: 8 }
const RES_FACTOR: Record<Resolution, number> = { '1K': 1, '2K': 1.3, '4K': 1.6 }

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
  const [picker, setPicker] = useState<'model' | 'env' | null>(null)

  const cost = Math.ceil(BASE_COST[g.genType] * RES_FACTOR[g.resolution]) + (g.variants - 1)
  const ratioCss = RATIO_CSS[g.aspectRatio]

  const generate = () => {
    if (busy) return
    if (balance < cost) { setToast('Недостаточно звёзд. Пополните баланс.'); return }
    deductBalance(cost)
    setBusy(true)
    setTimeout(() => {
      const pool = POOLS[g.mode]
      const batch = [...pool].sort(() => Math.random() - 0.5).slice(0, g.variants)
      setResults([...batch, ...results].slice(0, 16))
      setBusy(false)
    }, 2600)
  }

  const improve = async () => {
    if (!hasAIKey()) { setToast('AI-ключ не задан'); return }
    setIdeaLoading(true)
    try {
      const improved = await improvePrompt(g.prompt, g.mode)
      if (improved) setGen({ prompt: improved })
    } catch { setToast('Не удалось улучшить промпт') } finally { setIdeaLoading(false) }
  }

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      {/* ── SIDEBAR ── */}
      <div className="flex flex-col gap-4">
        {/* generation type */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#141414] rounded-xl">
          {GEN_TYPES.map((t) => {
            const Icon = t.icon
            const active = g.genType === t.id
            return (
              <button key={t.id} onClick={() => setGen({ genType: t.id })}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                style={{ background: active ? '#FFE135' : 'transparent', color: active ? '#262626' : 'rgba(255,255,255,0.6)' }}>
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* mode cards with example photos */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Как показать товар</div>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((m) => {
              const Icon = m.icon
              const active = g.mode === m.id
              return (
                <button key={m.id} onClick={() => setGen({ mode: m.id })}
                  className="relative rounded-xl overflow-hidden aspect-[16/10] border"
                  style={{ borderColor: active ? '#FFE135' : 'rgba(255,255,255,0.1)' }}>
                  <img src={POOLS[m.id][0]} alt={m.label} className="absolute inset-0 w-full h-full object-cover opacity-60" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1.5">
                    <Icon size={13} className={active ? 'text-brand-yellow' : 'text-white/70'} />
                    <span className={`text-[12px] font-semibold ${active ? 'text-brand-yellow' : 'text-white/80'}`}>{m.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* prompt */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] uppercase tracking-widest text-white/30">Пожелания (промпт)</label>
            <button onClick={improve} disabled={ideaLoading} className="flex items-center gap-1 text-[11px] font-semibold text-brand-yellow hover:underline disabled:opacity-50">
              {ideaLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Идея
            </button>
          </div>
          <textarea value={g.prompt} onChange={(e) => setGen({ prompt: e.target.value })} rows={3}
            placeholder="Товар на мраморной столешнице, мягкий свет из окна…"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20 resize-none" />
        </div>

        {/* reference photos: model + env */}
        <div className="grid grid-cols-2 gap-2">
          <RefSlot label="Фото модели" url={g.modelRef} onAdd={() => setPicker('model')} onClear={() => setGen({ modelRef: null })} />
          <RefSlot label="Окружение" url={g.envRef} onAdd={() => setPicker('env')} onClear={() => setGen({ envRef: null })} />
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
                <div className="px-4 pb-4 space-y-3.5">
                  {/* photo style */}
                  <Segmented label="Стиль фотографии" options={STYLES.map((s) => ({ id: s.id, label: s.label }))} value={g.photoStyle} onChange={(v) => setGen({ photoStyle: v as 'commercial' | 'home' })} cols={2} />
                  {/* aspect ratio */}
                  <div>
                    <div className="text-[11px] text-white/40 mb-1.5">Формат фото</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {ASPECTS.map((a) => (
                        <button key={a} onClick={() => setGen({ aspectRatio: a })} className="py-1.5 rounded-lg border text-[11px] font-semibold transition-colors"
                          style={{ borderColor: g.aspectRatio === a ? '#FFE135' : 'rgba(255,255,255,0.1)', color: g.aspectRatio === a ? '#FFE135' : 'rgba(255,255,255,0.55)' }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* resolution */}
                  <Segmented label="Разрешение" options={RES.map((r) => ({ id: r, label: r }))} value={g.resolution} onChange={(v) => setGen({ resolution: v as Resolution })} cols={3} />
                  {/* variants */}
                  <div>
                    <div className="text-[11px] text-white/40 mb-1.5">Количество вариантов</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((n) => (
                        <button key={n} onClick={() => setGen({ variants: n })} className="py-1.5 rounded-lg border text-[13px] font-bold transition-colors"
                          style={{ borderColor: g.variants === n ? '#FFE135' : 'rgba(255,255,255,0.1)', color: g.variants === n ? '#FFE135' : 'rgba(255,255,255,0.55)' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* lighting */}
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5">Освещение</label>
                    <select value={g.lighting} onChange={(e) => setGen({ lighting: e.target.value as typeof g.lighting })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40">
                      {LIGHTS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                  </div>
                  {/* negative */}
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5">Негативный промпт</label>
                    <input value={g.negativePrompt} onChange={(e) => setGen({ negativePrompt: e.target.value })} placeholder="люди, текст, лишние предметы…"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* generate */}
        <button onClick={generate} disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold disabled:opacity-50 disabled:cursor-not-allowed">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
          Сгенерировать <span className="opacity-70">· {g.variants} вар.</span>
          <span className="flex items-center gap-0.5">({cost} <Star size={12} fill="currentColor" />)</span>
        </button>
      </div>

      {/* ── RESULTS ── */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Результаты {results.length > 0 && `· ${results.length}`}</div>
        {results.length === 0 && !busy ? (
          <div className="rounded-2xl border border-dashed border-white/10 h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <Wand2 size={28} className="text-white/20 mb-3" />
            <div className="text-white/40 text-sm">Настройте сцену слева и нажмите «Сгенерировать»</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {busy && Array.from({ length: g.variants }).map((_, i) => (
              <div key={`sk-${i}`} className="rounded-xl bg-white/[0.04] animate-pulse relative overflow-hidden" style={{ aspectRatio: ratioCss }}>
                <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={20} className="text-brand-yellow/60 animate-spin" /></div>
              </div>
            ))}
            {results.map((url, i) => {
              const active = url === selectedResult
              return (
                <button key={url + i} onClick={() => setSelectedResult(url)}
                  className="relative rounded-xl overflow-hidden bg-[#141414] group" style={{ aspectRatio: ratioCss, boxShadow: active ? '0 0 0 2px #FFE135' : '0 0 0 1px rgba(255,255,255,0.08)' }}>
                  <img src={url} alt={`результат ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  {g.genType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center"><Play size={16} className="text-white ml-0.5" fill="white" /></div>
                    </div>
                  )}
                  {active && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFE135] flex items-center justify-center"><Check size={13} className="text-[#262626]" strokeWidth={3} /></div>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <AssetPicker
        kind={picker}
        onClose={() => setPicker(null)}
        onPick={(url) => setGen(picker === 'model' ? { modelRef: url } : { envRef: url })}
      />
    </div>
  )
}

function RefSlot({ label, url, onAdd, onClear }: { label: string; url: string | null; onAdd: () => void; onClear: () => void }) {
  return (
    <div>
      <div className="text-[11px] text-white/40 mb-1.5">{label}</div>
      {url ? (
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#141414] group">
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <button onClick={onClear} className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={11} /></button>
        </div>
      ) : (
        <button onClick={onAdd} className="w-full aspect-[16/10] rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 text-white/40 hover:border-brand-yellow/50 hover:text-brand-yellow transition-colors">
          <Plus size={16} /> <span className="text-[11px]">Добавить</span>
        </button>
      )}
    </div>
  )
}

function Segmented({ label, options, value, onChange, cols }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (v: string) => void; cols: number }) {
  return (
    <div>
      <div className="text-[11px] text-white/40 mb-1.5">{label}</div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {options.map((o) => (
          <button key={o.id} onClick={() => onChange(o.id)} className="py-1.5 rounded-lg border text-[12px] font-semibold transition-colors"
            style={{ borderColor: value === o.id ? '#FFE135' : 'rgba(255,255,255,0.1)', color: value === o.id ? '#FFE135' : 'rgba(255,255,255,0.55)' }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
