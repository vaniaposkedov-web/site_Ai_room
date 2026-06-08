import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UploadCloud, Wand2, Loader2, Star, Images, Check } from 'lucide-react'
import { useWizard } from './store'

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=320&q=80`

const MODEL_LIB = [
  u('1492447166138-50c3889fccb1'), u('1488161628813-04466f872be2'), u('1524504388940-b1c1722653e1'),
  u('1529626455594-4ff0802cfb7e'), u('1534528741775-53994a69daeb'), u('1506794778202-cad84cf45f1d'),
]
const ENV_LIB = [
  u('1493663284031-b7e3aefcae8e'), u('1505691938895-1758d7feb511'), u('1586023492125-27b2c045efd7'),
  u('1618221195710-dd6b41faaea6'), u('1469334031218-e382a71b716b'), u('1505740420928-5e560c06d30e'),
]

const GEN_COST = 2

export default function AssetPicker({
  kind,
  onClose,
  onPick,
}: {
  kind: 'model' | 'env' | null
  onClose: () => void
  onPick: (url: string) => void
}) {
  const balance = useWizard((s) => s.balance)
  const deductBalance = useWizard((s) => s.deductBalance)
  const setToast = useWizard((s) => s.setToast)

  const [tab, setTab] = useState<'library' | 'upload' | 'generate'>('library')
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const lib = kind === 'model' ? MODEL_LIB : ENV_LIB
  const title = kind === 'model' ? 'Фото модели' : 'Фото окружения'

  const onFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { onPick(reader.result as string); onClose() }
    reader.readAsDataURL(file)
  }

  const generate = () => {
    if (busy) return
    if (balance < GEN_COST) { setToast('Недостаточно звёзд для генерации'); return }
    deductBalance(GEN_COST)
    setBusy(true)
    setTimeout(() => {
      const pick = lib[Math.floor(Math.random() * lib.length)]
      setBusy(false)
      onPick(pick)
      onClose()
    }, 2200)
  }

  return (
    <AnimatePresence>
      {kind && (
        <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#1A1A1A] p-6 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
              <X size={17} />
            </button>
            <h3 className="font-display font-black text-xl text-white mb-1">{title}</h3>
            <p className="text-white/40 text-sm mb-4">Выберите из библиотеки, загрузите своё или сгенерируйте.</p>

            {/* tabs */}
            <div className="flex gap-1 p-1 bg-[#141414] rounded-xl mb-4">
              {([['library', 'Библиотека', Images], ['upload', 'Загрузить', UploadCloud], ['generate', 'Сгенерировать', Wand2]] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                  style={{ background: tab === id ? '#FFE135' : 'transparent', color: tab === id ? '#262626' : 'rgba(255,255,255,0.6)' }}
                >
                  <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {tab === 'library' && (
              <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto no-scrollbar">
                {lib.map((url) => (
                  <button key={url} onClick={() => { onPick(url); onClose() }} className="relative aspect-square rounded-xl overflow-hidden bg-[#141414] group">
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Check size={20} className="text-brand-yellow opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {tab === 'upload' && (
              <div
                onClick={() => fileRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-white/15 hover:border-brand-yellow/50 transition-colors py-12 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                <UploadCloud size={28} className="text-brand-yellow mb-3" />
                <div className="font-display font-bold text-white">Загрузите фото</div>
                <div className="text-white/40 text-sm mt-1">JPG, PNG</div>
              </div>
            )}

            {tab === 'generate' && (
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder={kind === 'model' ? 'Девушка-модель, нейтральный фон, дневной свет…' : 'Лофт с большими окнами, тёплый свет…'}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20 resize-none mb-3"
                />
                <button
                  onClick={generate}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold disabled:opacity-50"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                  {busy ? 'Генерация…' : <span className="flex items-center gap-1">Сгенерировать ({GEN_COST} <Star size={12} fill="currentColor" />)</span>}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
