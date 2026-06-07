import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2, Search, ShieldCheck } from 'lucide-react'
import OverlayCanvas, { DEFAULT_POS, buildItems } from '../OverlayCanvas'
import { useWizard } from '../store'
import { analyzeCompetitor, hasAIKey } from '@/lib/ai'

const MOCK_REPORT =
  'У конкурента нет инфографики. Ваши сгенерированные преимущества выгодно выделяют товар в выдаче и повышают кликабельность карточки.'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function Step4Export() {
  const productData = useWizard((s) => s.productData)
  const design = useWizard((s) => s.design)
  const setToast = useWizard((s) => s.setToast)

  const [downloading, setDownloading] = useState(false)
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [report, setReport] = useState<string | null>(null)

  const compose = async () => {
    const bg = productData.finalImage || productData.originalImage
    if (!bg) return
    setDownloading(true)
    try {
      const W = 900, H = 1200
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#141414'
      ctx.fillRect(0, 0, W, H)

      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((res, rej) => {
        img.onload = () => res()
        img.onerror = () => rej(new Error('img'))
        img.src = bg
      })
      const ratio = Math.max(W / img.width, H / img.height)
      const dw = img.width * ratio, dh = img.height * ratio
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)

      const scale = W / 420 // превью ~420px шириной
      ctx.textBaseline = 'top'
      ctx.shadowColor = design.color === '#FFFFFF' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)'
      ctx.shadowBlur = 8
      buildItems(productData.title, productData.features).forEach((it) => {
        const p = design.positions[it.id] ?? DEFAULT_POS[it.id] ?? { x: 6, y: 6 }
        const fs = (it.kind === 'title' ? design.fontSize * 1.5 : design.fontSize) * scale
        ctx.font = `${it.kind === 'title' ? '800' : '600'} ${fs}px Inter, system-ui, sans-serif`
        ctx.fillStyle = design.color
        const x = (p.x / 100) * W
        const y = (p.y / 100) * H
        if (it.kind === 'feature') {
          ctx.save(); ctx.shadowBlur = 0
          ctx.fillStyle = '#FFE135'
          ctx.beginPath(); ctx.arc(x + fs * 0.3, y + fs * 0.55, fs * 0.18, 0, Math.PI * 2); ctx.fill()
          ctx.restore()
          ctx.fillStyle = design.color
          ctx.fillText(it.text, x + fs * 0.8, y)
        } else {
          ctx.fillText(it.text, x, y)
        }
      })

      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'airoom-card.png'
      a.click()
    } catch {
      setToast('Не удалось склеить изображение (CORS). Скачиваем фон отдельно.')
      window.open(productData.finalImage || productData.originalImage || '', '_blank')
    } finally {
      setDownloading(false)
    }
  }

  const analyze = async () => {
    setReport(null)
    setAnalyzing(true)
    try {
      if (hasAIKey()) {
        const text = await analyzeCompetitor(url, { title: productData.title, features: productData.features })
        setReport(text || MOCK_REPORT)
      } else {
        await sleep(1500)
        setReport(MOCK_REPORT)
      }
    } catch {
      setReport(MOCK_REPORT)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* final card */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Готовая карточка</div>
        <OverlayCanvas />
        <button
          onClick={compose}
          disabled={downloading || !productData.finalImage}
          className="mt-4 w-full max-w-[420px] mx-auto flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {downloading ? 'Готовим файл…' : 'Скачать PNG'}
        </button>
      </div>

      {/* competitor analysis */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Анализ конкурента</div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5">
          <p className="text-sm text-white/50 mb-4 leading-relaxed">
            Вставьте ссылку на товар конкурента — сравним карточки и подсветим ваши преимущества.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL товара (Wildberries / Ozon)"
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
            />
            <button
              onClick={analyze}
              disabled={analyzing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-yellow text-brand-dark font-display font-bold text-sm disabled:opacity-50"
            >
              {analyzing ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              Анализировать
            </button>
          </div>

          {analyzing && (
            <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
              <Loader2 size={15} className="animate-spin text-brand-yellow" /> Сканируем карточку конкурента…
            </div>
          )}

          {report && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-[#4ADE80]/30 bg-[#4ADE80]/[0.06] p-4"
            >
              <div className="flex items-center gap-2 text-[#4ADE80] font-semibold text-sm mb-2">
                <ShieldCheck size={16} /> Отчёт
              </div>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{report}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
