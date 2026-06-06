import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UploadCloud, ImagePlus, Eraser, Sun, LayoutGrid, FileText, ArrowLeft, Sparkles } from 'lucide-react'
import { useModal } from '@/components/ModalProvider'

const TOOLS = [
  { icon: Eraser, label: 'Чистый фон' },
  { icon: Sun, label: 'Свет и цвет' },
  { icon: LayoutGrid, label: 'Инфографика' },
  { icon: FileText, label: 'Описание' },
]

export default function Workspace() {
  const { openLogin } = useModal()
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const pick = () => fileRef.current?.click()
  const onFile = (f?: File | null) => f && setFileName(f.name)

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#1A1A1A]/80 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-xl tracking-tight text-white">
            AI<span className="text-brand-yellow">ROOM</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-white/55 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={15} /> На сайт
            </Link>
            <button
              onClick={openLogin}
              className="font-display font-bold text-sm px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-dark"
            >
              Войти
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <div className="badge mb-5">
          <Sparkles size={11} /> Рабочая область · beta
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight mb-2">
          Загрузите фото товара
        </h1>
        <p className="text-white/45 mb-8 max-w-xl">
          Нейросеть очистит фон, выровняет свет, добавит инфографику и описание —
          и соберёт готовую карточку для маркетплейса.
        </p>

        {/* Dropzone */}
        <div
          onClick={pick}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files?.[0]) }}
          className="relative cursor-pointer rounded-3xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center py-16 px-6"
          style={{
            borderColor: dragOver ? 'rgba(255,225,53,0.7)' : 'rgba(255,255,255,0.12)',
            background: dragOver ? 'rgba(255,225,53,0.05)' : 'rgba(255,255,255,0.015)',
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <motion.div
            animate={{ y: dragOver ? -4 : 0 }}
            className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center mb-4"
          >
            <UploadCloud size={28} className="text-brand-yellow" />
          </motion.div>
          {fileName ? (
            <div className="flex items-center gap-2 text-white">
              <ImagePlus size={16} className="text-brand-yellow" />
              <span className="font-semibold">{fileName}</span>
            </div>
          ) : (
            <>
              <div className="font-display font-bold text-white text-lg">Перетащите фото сюда</div>
              <div className="text-white/40 text-sm mt-1">или нажмите, чтобы выбрать файл · JPG, PNG до 25 МБ</div>
            </>
          )}
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            disabled={!fileName}
            className="font-display font-bold px-7 py-3.5 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={17} /> Обработать карточку
          </button>
          {fileName && (
            <button onClick={() => setFileName(null)} className="text-sm text-white/40 hover:text-white/70 transition-colors">
              Очистить
            </button>
          )}
          <span className="text-white/25 text-xs sm:ml-auto">Первая карточка — для теста</span>
        </div>

        {/* What happens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {TOOLS.map((t) => {
            const Icon = t.icon
            return (
              <div key={t.label} className="glass-card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-brand-yellow" />
                </div>
                <span className="text-sm font-semibold text-white/80">{t.label}</span>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
