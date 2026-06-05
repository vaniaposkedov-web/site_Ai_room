import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Upload, Settings2, Rocket, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Подключите источники',
    description: 'Интегрируйте CRM, базы данных, Slack, документы — за 5 минут без программирования.',
    features: ['OAuth 2.0 авторизация', 'Автосинхронизация', 'Поддержка 300+ источников'],
    color: '#FFE135',
  },
  {
    step: '02',
    icon: Settings2,
    title: 'Настройте AI-агентов',
    description: 'Создайте персонализированных AI-агентов под задачи вашей команды с помощью no-code конструктора.',
    features: ['Визуальный редактор', 'Готовые шаблоны', 'Обучение на ваших данных'],
    color: '#FFE135',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Запустите и масштабируйте',
    description: 'Запустите платформу и наблюдайте, как AI оптимизирует процессы и экономит часы работы.',
    features: ['Запуск за 1 день', 'Авто-масштабирование', 'ROI с первой недели'],
    color: '#FFE135',
  },
]

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="glass-card glass-card-hover p-8 relative overflow-hidden">
        {/* Step number watermark */}
        <div
          className="absolute -top-4 -right-2 font-display text-8xl font-black pointer-events-none select-none"
          style={{ color: 'rgba(255,225,53,0.04)' }}
        >
          {step.step}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE135] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,225,53,0.4)] transition-shadow duration-300">
                <step.icon size={24} className="text-[#262626]" strokeWidth={2} />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#262626] border-2 border-[#FFE135] flex items-center justify-center">
                <span className="text-[8px] font-black text-[#FFE135]">{index + 1}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-white/25 font-mono mb-0.5">ШАГ {step.step}</div>
              <h3 className="font-display text-xl font-bold text-white">{step.title}</h3>
            </div>
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-6">{step.description}</p>

          <ul className="space-y-2.5">
            {step.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 size={15} className="text-[#FFE135] flex-shrink-0" />
                <span className="text-white/60">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Arrow connector — only between items */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute top-1/2 -right-6 z-20 items-center justify-center w-12 h-12 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[rgba(255,225,53,0.2)] flex items-center justify-center">
            <ArrowRight size={14} className="text-[#FFE135]" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function HowItWorks() {
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="py-28 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#1e1e1e]" />
        <div className="absolute inset-0 dot-bg opacity-30" />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FFE135]/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FFE135]/3 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex mb-4"
          >
            <span className="section-tag">
              <Sparkles size={11} />
              Быстрый старт
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Три шага до
            <br />
            <span className="text-gradient-yellow">AI-трансформации</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-md mx-auto"
          >
            Запустите платформу за один рабочий день без технических знаний
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <StepCard key={step.step} step={step} index={i} />
          ))}
        </div>

        {/* Timeline bar (desktop) */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="hidden lg:block mt-8 h-px bg-gradient-to-r from-transparent via-[rgba(255,225,53,0.3)] to-transparent origin-left"
        />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-14"
        >
          <button className="btn-primary text-base px-8 py-4 group">
            Начать бесплатный старт
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-white/30 text-sm mt-4">Без кредитной карты · Бесплатно 14 дней · Отмена в любой момент</p>
        </motion.div>
      </div>
    </section>
  )
}
