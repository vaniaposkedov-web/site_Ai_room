import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Plus, ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react'
import { useWizard } from '@/workspace/store'
import Stepper, { STEPS } from '@/workspace/Stepper'
import Toaster from '@/workspace/Toaster'
import Step1Upload from '@/workspace/steps/Step1Upload'
import Step2Studio from '@/workspace/steps/Step2Studio'
import Step3Editor from '@/workspace/steps/Step3Editor'
import Step4Export from '@/workspace/steps/Step4Export'

const TITLES: Record<number, { title: string; sub: string }> = {
  1: { title: 'Загрузка и AI-разметка', sub: 'Загрузите фото — нейросеть определит категорию, название и преимущества' },
  2: { title: 'AI-студия', sub: 'Выберите фон — нейросеть пересоберёт сцену вокруг товара' },
  3: { title: 'Дизайн карточки', sub: 'Разместите инфографику поверх изображения' },
  4: { title: 'Экспорт и анализ', sub: 'Скачайте карточку и сравните с конкурентом' },
}

export default function Workspace() {
  const [booting, setBooting] = useState(true)
  const step = useWizard((s) => s.step)
  const balance = useWizard((s) => s.balance)
  const productData = useWizard((s) => s.productData)
  const nextStep = useWizard((s) => s.nextStep)
  const prevStep = useWizard((s) => s.prevStep)
  const topUp = useWizard((s) => s.topUp)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500)
    return () => clearTimeout(t)
  }, [])

  const canNext =
    step === 1 ? !!productData.originalImage && productData.title.trim().length > 0
      : step === 2 ? !!productData.finalImage
        : true

  const meta = TITLES[step]

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white">
      <Toaster />

      {/* Boot */}
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center gap-6"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="font-display font-black text-3xl tracking-tight">
              AI<span className="text-brand-yellow">ROOM</span>
            </motion.div>
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-brand-yellow" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.3, ease: 'easeInOut' }} />
            </div>
            <div className="text-white/40 text-xs">Загружаем мастер карточек…</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.07] bg-[#1A1A1A]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link to="/" className="font-display font-black text-xl tracking-tight flex-shrink-0">
            AI<span className="text-brand-yellow">ROOM</span>
          </Link>
          <Link to="/" className="hidden sm:flex items-center gap-1.5 text-sm text-white/45 hover:text-white px-2 py-1.5 rounded-lg transition-colors">
            <ArrowLeft size={15} /> На сайт
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <Stepper />
          </div>

          <div className="ml-auto md:ml-0 flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl pl-3 pr-1.5 py-1.5">
            <span className="text-xs text-white/40 hidden sm:inline">Баланс</span>
            <motion.span key={balance} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="flex items-center gap-1 font-display font-black text-brand-yellow tabular-nums">
              {balance} <Star size={13} fill="currentColor" />
            </motion.span>
            <button onClick={() => topUp(50)} title="Пополнить (демо +50)" className="flex items-center gap-1 text-xs font-semibold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/25 rounded-lg px-2 py-1 hover:bg-brand-yellow/25 transition-colors">
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* mobile stepper */}
        <div className="md:hidden border-t border-white/[0.06] px-4 py-2 overflow-x-auto no-scrollbar">
          <Stepper />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{meta.title}</h1>
          <p className="text-white/45 text-sm mt-1">{meta.sub}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && <Step1Upload />}
            {step === 2 && <Step2Studio />}
            {step === 3 && <Step3Editor />}
            {step === 4 && <Step4Export />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-white/[0.07] bg-[#1A1A1A]/80 backdrop-blur-md sticky bottom-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:border-white/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Назад
          </button>

          <div className="text-[11px] text-white/30">Шаг {step} из {STEPS.length}</div>

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Далее <ArrowRight size={16} />
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:border-white/25 transition-colors">
              Готово
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
