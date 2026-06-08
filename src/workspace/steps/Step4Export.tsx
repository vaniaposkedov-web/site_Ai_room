import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Loader2, Save, Bookmark, Trash2, Check, ImageDown, Plus } from 'lucide-react'
import OverlayCanvas, { DEFAULT_POS, buildItems } from '../OverlayCanvas'
import { useWizard, defaultStyle } from '../store'

export default function Step4Export() {
  const productData = useWizard((s) => s.productData)
  const selectedResult = useWizard((s) => s.selectedResult)
  const design = useWizard((s) => s.design)
  const adjust = useWizard((s) => s.adjust)
  const setToast = useWizard((s) => s.setToast)
  const styleTemplates = useWizard((s) => s.styleTemplates)
  const saveStyleTemplate = useWizard((s) => s.saveStyleTemplate)
  const applyStyleTemplate = useWizard((s) => s.applyStyleTemplate)
  const deleteStyleTemplate = useWizard((s) => s.deleteStyleTemplate)
  const savedPhotos = useWizard((s) => s.savedPhotos)
  const addSavedPhoto = useWizard((s) => s.addSavedPhoto)

  const [busy, setBusy] = useState<'download' | 'save' | null>(null)
  const [tplName, setTplName] = useState('')

  const bg = selectedResult || productData.images[0]

  const buildDataUrl = async (): Promise<string | null> => {
    if (!bg) return null
    const W = 900, H = 1200
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#141414'
    ctx.fillRect(0, 0, W, H)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('img')); img.src = bg })

    ctx.filter = `brightness(${adjust.brightness}%) contrast(${adjust.contrast}%) saturate(${adjust.saturation}%)`
    const ratio = Math.max(W / img.width, H / img.height)
    const dw = img.width * ratio, dh = img.height * ratio
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
    ctx.filter = 'none'

    const scale = W / 440
    ctx.textBaseline = 'top'
    buildItems(productData.title, productData.features).forEach((it) => {
      const p = design.positions[it.id] ?? DEFAULT_POS[it.id] ?? { x: 6, y: 6 }
      const st = { ...defaultStyle(it.id), ...design.styles[it.id] }
      const fs = st.fontSize * scale
      ctx.font = `${it.kind === 'title' ? '800' : '600'} ${fs}px Inter, system-ui, sans-serif`
      const x = (p.x / 100) * W
      const y = (p.y / 100) * H
      ctx.save()
      ctx.shadowColor = st.color.toUpperCase() === '#FFFFFF' ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.45)'
      ctx.shadowBlur = 8
      if (it.kind === 'feature') {
        ctx.shadowBlur = 0
        ctx.fillStyle = '#FFE135'
        ctx.beginPath(); ctx.arc(x + fs * 0.3, y + fs * 0.55, fs * 0.2, 0, Math.PI * 2); ctx.fill()
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8
        ctx.fillStyle = st.color
        ctx.fillText(it.text, x + fs * 0.85, y)
      } else {
        ctx.fillStyle = st.color
        ctx.fillText(it.text, x, y)
      }
      ctx.restore()
    })
    return canvas.toDataURL('image/png')
  }

  const download = async () => {
    if (!bg) return
    setBusy('download')
    try {
      const url = await buildDataUrl()
      if (!url) return
      const a = document.createElement('a')
      a.href = url
      a.download = 'airoom-card.png'
      a.click()
    } catch {
      setToast('Не удалось склеить изображение (CORS). Открываем фон отдельно.')
      window.open(bg, '_blank')
    } finally {
      setBusy(null)
    }
  }

  const saveToReady = async () => {
    if (!bg) return
    setBusy('save')
    try {
      const url = await buildDataUrl()
      if (url) { addSavedPhoto(url); setToast('Карточка сохранена в готовые') }
    } catch {
      setToast('Не удалось сохранить (CORS)')
    } finally {
      setBusy(null)
    }
  }

  const saveTpl = () => {
    const name = tplName.trim() || `Стиль ${styleTemplates.length + 1}`
    saveStyleTemplate(name)
    setTplName('')
    setToast('Шаблон стиля сохранён')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* final card + actions */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Готовая карточка</div>
        <OverlayCanvas />
        <div className="max-w-[440px] mx-auto mt-4 grid grid-cols-2 gap-2.5">
          <button onClick={download} disabled={busy !== null || !bg}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold disabled:opacity-40 disabled:cursor-not-allowed">
            {busy === 'download' ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />} Скачать PNG
          </button>
          <button onClick={saveToReady} disabled={busy !== null || !bg}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/80 font-display font-bold hover:border-brand-yellow/40 transition-colors disabled:opacity-40">
            {busy === 'save' ? <Loader2 size={17} className="animate-spin" /> : <ImageDown size={17} />} В готовые
          </button>
        </div>
      </div>

      {/* templates + saved photos */}
      <div className="space-y-6">
        {/* style templates */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5">
          <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-3">
            <Bookmark size={15} className="text-brand-yellow" /> Шаблоны стиля
          </div>
          <div className="flex gap-2 mb-3">
            <input
              value={tplName}
              onChange={(e) => setTplName(e.target.value)}
              placeholder="Название шаблона…"
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
            />
            <button onClick={saveTpl} className="flex items-center gap-1.5 px-3 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-sm font-semibold hover:bg-brand-yellow/25 transition-colors">
              <Save size={14} /> Сохранить
            </button>
          </div>
          {styleTemplates.length === 0 ? (
            <div className="text-[12px] text-white/30">Сохраните текущее оформление как шаблон — и применяйте его к другим карточкам.</div>
          ) : (
            <div className="space-y-1.5">
              {styleTemplates.map((t) => (
                <div key={t.id} className="flex items-center gap-2 rounded-lg bg-[#1A1A1A] border border-white/[0.06] px-3 py-2">
                  <span className="flex-1 text-sm text-white/75 truncate">{t.name}</span>
                  <button onClick={() => { applyStyleTemplate(t.id); setToast('Шаблон применён') }} className="flex items-center gap-1 text-[12px] text-brand-yellow hover:underline">
                    <Check size={13} /> Применить
                  </button>
                  <button onClick={() => deleteStyleTemplate(t.id)} className="text-white/25 hover:text-[#EF4444]"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ready photos */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5">
          <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-3">
            <ImageDown size={15} className="text-brand-yellow" /> Готовые фотографии {savedPhotos.length > 0 && <span className="text-white/30">· {savedPhotos.length}</span>}
          </div>
          {savedPhotos.length === 0 ? (
            <div className="text-[12px] text-white/30 flex items-center gap-1.5"><Plus size={13} /> Нажмите «В готовые», чтобы сохранить карточку в галерею.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              <AnimatePresence>
                {savedPhotos.map((url, i) => (
                  <motion.a
                    key={url.slice(-24) + i}
                    href={url}
                    download={`airoom-${i + 1}.png`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#141414] group"
                  >
                    <img src={url} alt={`готовое ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Download size={16} className="text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
