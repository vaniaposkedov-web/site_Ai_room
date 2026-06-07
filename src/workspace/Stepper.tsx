import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useWizard } from './store'

export const STEPS = [
  { n: 1, label: 'Загрузка' },
  { n: 2, label: 'Фон' },
  { n: 3, label: 'Дизайн' },
  { n: 4, label: 'Экспорт' },
]

export default function Stepper() {
  const step = useWizard((s) => s.step)
  const setStep = useWizard((s) => s.setStep)

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((s, i) => {
        const done = s.n < step
        const active = s.n === step
        return (
          <div key={s.n} className="flex items-center">
            <button
              onClick={() => s.n < step && setStep(s.n)}
              disabled={s.n > step}
              className={`flex items-center gap-2 rounded-full px-2 sm:px-3 py-1.5 transition-colors ${
                s.n <= step ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <motion.span
                animate={{
                  backgroundColor: active || done ? '#FFE135' : 'rgba(255,255,255,0.06)',
                  color: active || done ? '#262626' : 'rgba(255,255,255,0.5)',
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-black flex-shrink-0"
              >
                {done ? <Check size={13} strokeWidth={3} /> : s.n}
              </motion.span>
              <span className={`text-[13px] font-semibold hidden sm:inline ${active ? 'text-white' : 'text-white/40'}`}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="w-4 sm:w-8 h-px mx-0.5 sm:mx-1" style={{ background: done ? '#FFE135' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
