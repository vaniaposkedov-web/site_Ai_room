import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Sliders, Image as ImageIcon, Check, UploadCloud, ImagePlus, Copy, Sparkles,
  ArrowRight, ArrowLeft, Download, Share2, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle, Loader2, X, FileText,
} from 'lucide-react'
import WorkNav from '@/workspace/WorkNav'
import { useStudio, type Format } from '@/workspace/studioStore'
import { getTool } from '@/workspace/tools'
import { detectProduct, infographicIdea, generateImage, generateText, hasAIKey } from '@/lib/ai'

const GRID_BG = {
  backgroundColor: '#1c1c1c',
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
}
const ACCENT = '#F5C800'
const FORMATS: Format[] = ['9:16', '3:4', '1:1', '4:3', '4:5', '16:9']
const RES: { id: '1k' | '2k' | '4k'; label: string }[] = [{ id: '1k', label: '1К' }, { id: '2k', label: '2К' }, { id: '4k', label: '4К' }]
const RATIO: Record<Format, number> = { '9:16': 9 / 16, '3:4': 3 / 4, '1:1': 1, '4:3': 4 / 3, '4:5': 4 / 5, '16:9': 16 / 9 }
const RESPX: Record<string, number> = { '1k': 1024, '2k': 1536, '4k': 2048 }
const LOADER_MSGS = [
  'Анализируем композицию и параметры товара…',
  'Выравниваем студийный свет…',
  'Подбираем палитру под референс…',
  'Нейросеть генерирует изображение…',
  'Финальное улучшение детализации…',
]

const STEP_DEF = [
  { n: 1, label: 'Фото товара', icon: Upload },
  { n: 2, label: 'Параметры', icon: Sliders },
  { n: 3, label: 'Результат', icon: ImageIcon },
]

/* ── красивый индикатор шагов ── */
function Steps({ step }: { step: number }) {
  const cur = Math.floor(step)
  return (
    <div className="relative max-w-sm mx-auto px-5">
      <div className="absolute left-10 right-10 top-6 h-[3px] rounded bg-white/[0.08]" />
      <motion.div className="absolute left-10 top-6 h-[3px] rounded" style={{ background: ACCENT }}
        initial={false} animate={{ width: `calc((100% - 80px) * ${(cur - 1) / (STEP_DEF.length - 1)})` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      <div className="relative flex items-start justify-between">
        {STEP_DEF.map((s) => {
          const done = s.n < cur
          const active = s.n === cur
          const Icon = s.icon
          return (
            <div key={s.n} className="flex flex-col items-center gap-2 w-20">
              <motion.div
                animate={{
                  background: active || done ? ACCENT : '#242424',
                  scale: active ? 1.12 : 1,
                  boxShadow: active ? '0 0 0 6px rgba(245,200,0,0.12), 0 8px 24px rgba(245,200,0,0.25)' : '0 0 0 0 transparent',
                }}
                transition={{ duration: 0.35 }}
                className="w-12 h-12 rounded-full flex items-center justify-center border"
                style={{ borderColor: active || done ? ACCENT : 'rgba(255,255,255,0.08)', color: active || done ? '#111' : 'rgba(255,255,255,0.5)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span key={done ? 'c' : 'i'} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              <span className={`text-[12px] font-semibold text-center leading-tight ${active ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function readFile(file: File, cb: (url: string) => void) {
  const r = new FileReader(); r.onload = () => cb(r.result as string); r.readAsDataURL(file)
}

export default function Infographics() {
  const navigate = useNavigate()
  const s = useStudio()
  const tool = getTool(s.tool)
  const [step, setStep] = useState(1)
  const [detecting, setDetecting] = useState(false)
  const [ideaLoading, setIdeaLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loaderMsg, setLoaderMsg] = useState(LOADER_MSGS[0])
  const [feedback, setFeedback] = useState<'like' | null>(null)
  const [resultText, setResultText] = useState<string | null>(null)
  const productInput = useRef<HTMLInputElement>(null)
  const refInput = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!s.tool) navigate('/app') }, []) // eslint-disable-line

  const detect = async (dataUrl: string) => {
    if (!hasAIKey()) { s.setToast({ text: 'AI-ключ не задан — заполните вручную', icon: 'cpu' }); return }
    setDetecting(true)
    try {
      const d = await detectProduct(dataUrl)
      s.setCategory(d.category); s.setType(d.type); s.setSpecs(d.specs)
      if (!s.infographicText && d.advantages.length) s.setInfographicText(d.advantages.map((a) => `✦ ${a}`).join('\n'))
      s.setToast({ text: 'AI распознал товар!', icon: 'sparkles' })
    } catch { s.setToast({ text: 'Не удалось определить товар', icon: 'cpu' }) } finally { setDetecting(false) }
  }

  const onProduct = (f?: File | null) => f && readFile(f, (url) => { s.setProductImage(url); detect(url) })
  const onRef = (f?: File | null) => f && readFile(f, (url) => s.setRefImage(url))

  const aiIdea = async () => {
    if (!hasAIKey()) { s.setToast({ text: 'AI-ключ не задан', icon: 'cpu' }); return }
    setIdeaLoading(true)
    try { const t = await infographicIdea(s.category, s.type); if (t) s.setInfographicText(t); s.setToast({ text: 'AI предложил текст', icon: 'sparkles' }) }
    catch { s.setToast({ text: 'Не удалось сгенерировать', icon: 'cpu' }) } finally { setIdeaLoading(false) }
  }

  // запасная склейка на canvas, если image-генерация недоступна
  const compose = async (): Promise<string | null> => {
    const src = s.productImage; if (!src) return null
    const ratio = RATIO[s.format]; const long = RESPX[s.resolution]
    let W: number, H: number
    if (ratio < 1) { H = long; W = Math.round(H * ratio) } else { W = long; H = Math.round(W / ratio) }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H
    const ctx = cv.getContext('2d')!; ctx.fillStyle = '#1c1c1c'; ctx.fillRect(0, 0, W, H)
    const img = new Image()
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('img')); img.src = src })
    const r = Math.max(W / img.width, H / img.height); const dw = img.width * r, dh = img.height * r
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
    const g = ctx.createLinearGradient(0, H, 0, H * 0.45); g.addColorStop(0, 'rgba(0,0,0,0.88)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    const sc = W / 900; const pad = 56 * sc
    if (s.type) { ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.round(34 * sc)}px Unbounded, Inter, sans-serif`; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8 * sc; ctx.textBaseline = 'top'; ctx.fillText(s.type.slice(0, 26), pad, pad); ctx.shadowBlur = 0 }
    const lines = s.infographicText.split('\n').map((l) => l.replace(/^[✦•\-\s]+/, '').trim()).filter(Boolean).slice(0, 5)
    const fs = Math.round(26 * sc); const lh = fs * 1.7; let y = H - pad - lines.length * lh
    lines.forEach((line) => { ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(pad + fs * 0.35, y + fs * 0.6, fs * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `600 ${fs}px Onest, Inter, sans-serif`; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 6 * sc; ctx.textBaseline = 'top'; ctx.fillText(line.slice(0, 40), pad + fs * 1.1, y + fs * 0.12); ctx.shadowBlur = 0; y += lh })
    return cv.toDataURL('image/png')
  }

  const runGeneration = async () => {
    const cost = tool.kind === 'image' ? (s.tool === 'tool-2' ? 6 : 4) : 1
    if (s.balance < cost) { s.setToast({ text: 'Недостаточно звёзд', icon: 'cpu' }); return }
    s.deductBalance(cost)
    setStep(2.5); setLoading(true); setProgress(0); setFeedback(null); setResultText(null)
    let p = 0; const pi = window.setInterval(() => { p = Math.min(92, p + Math.random() * 7); setProgress(p) }, 450)
    let mi2 = 0; setLoaderMsg(LOADER_MSGS[0]); const mi = window.setInterval(() => { mi2 = Math.min(mi2 + 1, LOADER_MSGS.length - 1); setLoaderMsg(LOADER_MSGS[mi2]) }, 1300)
    const ctx = { type: s.type, category: s.category, specs: s.specs, text: s.infographicText, format: s.format, styleMode: s.styleMode, hasRef: !!s.refImage }
    try {
      if (!hasAIKey()) throw new Error('NO_KEY')
      if (tool.kind === 'image') {
        const inputs = s.productImage ? [s.productImage, ...(s.refImage ? [s.refImage] : [])] : []
        const img = await generateImage(tool.prompt(ctx), inputs)
        s.setResultImage(img); setResultText(null)
      } else {
        const txt = await generateText(tool.system ?? '', tool.prompt(ctx), { maxTokens: 600 })
        setResultText(txt); s.setResultImage(null)
      }
    } catch {
      if (tool.kind === 'image') { const c = await compose().catch(() => null); s.setResultImage(c); if (!c) s.setToast({ text: 'Не удалось сгенерировать', icon: 'cpu' }) }
      else { s.setToast({ text: 'Не удалось сгенерировать текст', icon: 'cpu' }) }
    } finally {
      window.clearInterval(pi); window.clearInterval(mi); setProgress(100)
      setLoading(false); setStep(3); s.setToast({ text: 'Готово!', icon: 'sparkles' })
    }
  }

  const startOver = () => { s.resetEditor(); setResultText(null); setStep(1); setFeedback(null); if (productInput.current) productInput.current.value = ''; if (refInput.current) refInput.current.value = '' }
  const download = () => { if (!s.resultImage) return; const a = document.createElement('a'); a.href = s.resultImage; a.download = 'airoom-card.png'; a.click() }

  const step1Ready = !!s.productImage
  const aspectCss = s.format.replace(':', '/')

  return (
    <div className="min-h-screen text-white font-['Onest']" style={GRID_BG}>
      <WorkNav backTo="/app" />
      <div className="pointer-events-none absolute top-[-100px] left-[20%] w-[600px] h-[600px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(245,200,0,0.04), transparent 70%)' }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F5C800]/25 bg-[#F5C800]/[0.06] px-3.5 py-1.5 text-[11px] tracking-wider text-[#F5C800]">
            <tool.icon size={13} /> {tool.name}
          </span>
        </div>
        <Steps step={step} />

        <div className="mt-10">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              {!s.productImage ? (
                <div onClick={() => productInput.current?.click()} className="rounded-2xl border-2 border-dashed border-white/12 hover:border-[#F5C800]/50 transition-colors py-16 flex flex-col items-center text-center cursor-pointer">
                  <UploadCloud size={40} className="text-[#F5C800] mb-4" />
                  <p className="font-['Unbounded'] font-bold text-lg">Загрузите фото товара</p>
                  <p className="text-white/45 text-sm mt-1">JPG, PNG, WEBP · до 20 МБ</p>
                  <span className="mt-5 bg-[#F5C800] text-[#111] font-semibold text-sm px-5 py-2.5 rounded-xl">Выбрать файл</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl border border-white/[0.08] bg-[#242424] p-3">
                    <div className="text-[11px] text-white/45 mb-2">Фото товара</div>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1c1c1c]">
                      <img src={s.productImage} alt="товар" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center"><Check size={13} className="text-white" strokeWidth={3} /></div>
                    </div>
                    <button onClick={() => { s.setProductImage(null); s.setRefImage(null) }} className="mt-2 w-full text-xs text-white/45 hover:text-white py-1.5 rounded-lg border border-white/10">Сбросить</button>
                  </div>
                  {!s.refImage ? (
                    <div onClick={() => refInput.current?.click()} className="relative rounded-2xl border-2 border-dashed border-white/12 hover:border-[#F5C800]/50 transition-colors p-3 flex flex-col items-center justify-center cursor-pointer">
                      <div className="self-start text-[11px] text-white/45 flex items-center gap-1.5 mb-2">Дизайн-референс <HelpCircle size={13} className="text-white/30" /></div>
                      <ImagePlus size={28} className="text-[#F5C800] mt-2" />
                      <span className="text-sm mt-2">Добавить референс</span>
                      <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50">{tool.needsRef ? 'Рекомендуется' : 'По желанию'}</span>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl border border-white/[0.08] bg-[#242424] p-3">
                      <div className="text-[11px] text-white/45 mb-2">Дизайн-референс</div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1c1c1c]">
                        <img src={s.refImage} alt="референс" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center"><Check size={13} className="text-white" strokeWidth={3} /></div>
                      </div>
                      <button onClick={() => s.setRefImage(null)} className="mt-2 w-full text-xs text-white/45 hover:text-white py-1.5 rounded-lg border border-white/10">Сбросить</button>
                    </div>
                  )}
                </div>
              )}
              <input ref={productInput} type="file" accept="image/*" className="hidden" onChange={(e) => { onProduct(e.target.files?.[0]); e.target.value = '' }} />
              <input ref={refInput} type="file" accept="image/*" className="hidden" onChange={(e) => { onRef(e.target.files?.[0]); e.target.value = '' }} />

              {step1Ready && s.refImage && (
                <div className="flex gap-3 mt-4">
                  {([['copy', 'Копировать стиль', Copy], ['inspire', 'Вдохновиться', Sparkles]] as const).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => s.setStyleMode(id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors"
                      style={{ borderColor: s.styleMode === id ? ACCENT : 'rgba(255,255,255,0.1)', color: s.styleMode === id ? ACCENT : 'rgba(255,255,255,0.7)', background: s.styleMode === id ? 'rgba(245,200,0,0.06)' : 'transparent' }}>
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>
              )}

              {s.productImage && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-white/[0.08] bg-[#242424] p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                    {detecting ? <Loader2 size={15} className="text-[#F5C800] animate-spin" /> : <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center"><Check size={12} className="text-white" strokeWidth={3} /></span>}
                    AI определил товар
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className="block text-[11px] text-white/45 mb-1.5">Категория</label><input value={s.category} onChange={(e) => s.setCategory(e.target.value)} placeholder={detecting ? 'Определяем…' : 'Категория'} className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5C800]/50" /></div>
                    <div><label className="block text-[11px] text-white/45 mb-1.5">Тип товара</label><input value={s.type} onChange={(e) => s.setType(e.target.value)} placeholder={detecting ? 'Определяем…' : 'Тип'} className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5C800]/50" /></div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end mt-6">
                <motion.button whileHover={{ scale: step1Ready ? 1.03 : 1 }} whileTap={{ scale: 0.97 }} disabled={!step1Ready} onClick={() => setStep(2)}
                  className="flex items-center gap-2 bg-[#F5C800] text-[#111] font-['Unbounded'] font-bold text-sm px-6 py-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">
                  Далее — Параметры <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <div className="text-center mb-6">
                <h2 className="font-['Unbounded'] font-bold text-2xl sm:text-3xl">Параметры</h2>
                <p className="text-white/50 text-sm mt-2">Проверьте детали и опишите, что показать на карточке</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {s.specs.length === 0 && Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-xl bg-white/[0.04] h-[68px] animate-pulse" />)}
                {s.specs.map((sp, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.08] bg-[#242424] p-3">
                    <label className="block text-[11px] text-white/45 mb-1.5">{sp.label}</label>
                    <input value={sp.value} onChange={(e) => s.updateSpec(i, { value: e.target.value })} className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F5C800]/50" />
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#242424] p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm">О чём рассказать на карточке</span>
                  <button onClick={aiIdea} disabled={ideaLoading} className="flex items-center gap-1 text-[12px] font-semibold text-[#F5C800] hover:underline disabled:opacity-50">{ideaLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ✦ AI идея</button>
                </div>
                <textarea value={s.infographicText} onChange={(e) => s.setInfographicText(e.target.value)} rows={4} placeholder={'Например:\n✦ Водонепроницаемый материал\n✦ Высокая прочность'}
                  className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5C800]/50 resize-none placeholder:text-white/25" />
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-white/45 mb-2">Формат кадра</div>
                  <div className="flex flex-wrap gap-2">{FORMATS.map((f) => <button key={f} onClick={() => s.setFormat(f)} className="px-3 py-2 rounded-lg border text-[13px] font-semibold transition-colors" style={{ borderColor: s.format === f ? ACCENT : 'rgba(255,255,255,0.1)', color: s.format === f ? ACCENT : 'rgba(255,255,255,0.6)' }}>{f}</button>)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/45 mb-2">Разрешение</div>
                  <div className="flex gap-2">{RES.map((r) => <button key={r.id} onClick={() => s.setResolution(r.id)} className="px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors" style={{ borderColor: s.resolution === r.id ? ACCENT : 'rgba(255,255,255,0.1)', color: s.resolution === r.id ? ACCENT : 'rgba(255,255,255,0.6)' }}>{r.label}{r.id === '2k' && <span className="ml-1 text-[9px] text-white/35">реком.</span>}</button>)}</div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 border border-white/10 text-white/70 text-sm px-5 py-3.5 rounded-xl hover:border-white/20"><ArrowLeft size={16} /> Назад</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={runGeneration} className="flex items-center gap-2 bg-[#F5C800] text-[#111] font-['Unbounded'] font-bold text-sm px-6 py-3.5 rounded-xl">Сгенерировать <Sparkles size={16} /></motion.button>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-16">
              <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><Sparkles size={42} className="text-[#F5C800] mb-5" /></motion.div>
              <h3 className="font-['Unbounded'] font-bold text-xl mb-5">Генерируем…</h3>
              <div className="w-full max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full bg-[#F5C800]" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} /></div>
              <AnimatePresence mode="wait"><motion.div key={loaderMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-white/45 text-sm mt-4">{loaderMsg}</motion.div></AnimatePresence>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && !loading && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] tracking-wider" style={{ border: '1px solid rgba(245,200,0,0.3)', background: 'rgba(245,200,0,0.06)', color: ACCENT }}>✦ ГОТОВО</span>
                <h2 className="font-['Unbounded'] font-bold text-2xl sm:text-3xl mt-4">Результат готов</h2>
              </div>

              {resultText ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#242424] p-5 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-[#F5C800] text-sm font-semibold mb-3"><FileText size={15} /> Текст</div>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{resultText}</p>
                  <button onClick={() => { navigator.clipboard?.writeText(resultText); s.setToast({ text: 'Текст скопирован', icon: 'copy' }) }} className="mt-4 flex items-center gap-2 bg-[#F5C800] text-[#111] font-semibold text-sm px-4 py-2.5 rounded-xl"><Copy size={15} /> Скопировать текст</button>
                </div>
              ) : (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-[#242424]" style={{ maxWidth: 440, aspectRatio: aspectCss }}>
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white/70 text-[10px] uppercase tracking-widest font-mono px-2 py-1 rounded"><Sparkles size={10} className="text-[#F5C800]" /> AI STUDIO</div>
                  {s.resultImage ? <img src={s.resultImage} alt="результат" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon size={28} /></div>}
                </motion.div>
              )}

              <div className="text-center mt-6">
                <div className="text-sm text-white/55 mb-2.5">Как вам результат?</div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => { setFeedback('like'); s.setToast({ text: 'Спасибо за оценку!', icon: 'thumbs-up' }) }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm transition-colors" style={{ borderColor: feedback === 'like' ? ACCENT : 'rgba(255,255,255,0.1)', color: feedback === 'like' ? ACCENT : 'rgba(255,255,255,0.7)' }}><ThumbsUp size={15} /> Отлично</button>
                  <button onClick={runGeneration} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:border-white/20"><ThumbsDown size={15} /> Переделать</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                {!resultText && <button onClick={download} className="flex items-center justify-center gap-2 bg-[#F5C800] text-[#111] font-['Unbounded'] font-bold text-sm py-3.5 rounded-xl"><Download size={16} /> Скачать</button>}
                <button onClick={() => { navigator.clipboard?.writeText(location.href); s.setToast({ text: 'Ссылка скопирована', icon: 'link-2' }) }} className="flex items-center justify-center gap-2 border border-white/10 text-white/80 text-sm py-3.5 rounded-xl hover:border-white/20"><Share2 size={16} /> Поделиться</button>
                <button onClick={startOver} className="flex items-center justify-center gap-2 border border-white/10 text-white/80 text-sm py-3.5 rounded-xl hover:border-white/20"><RefreshCw size={16} /> Создать ещё</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <StudioToast />
    </div>
  )
}

function StudioToast() {
  const toast = useStudio((s) => s.toast)
  const setToast = useStudio((s) => s.setToast)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t) }, [toast, setToast])
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-[#242424] px-4 py-3 shadow-2xl">
          <Sparkles size={15} className="text-[#F5C800]" />
          <span className="text-sm text-white/85">{toast.text}</span>
          <button onClick={() => setToast(null)} className="text-white/30 hover:text-white"><X size={13} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
