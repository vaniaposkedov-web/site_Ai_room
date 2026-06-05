import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles, TrendingUp, Clock, Zap, RotateCcw } from 'lucide-react'

/* ─────────────────────────────────
   Step data
───────────────────────────────── */
const NICHES = [
  { id: 'fashion',    emoji: '👗', label: 'Одежда и обувь'   },
  { id: 'electronics',emoji: '💻', label: 'Электроника'      },
  { id: 'beauty',     emoji: '💄', label: 'Косметика'        },
  { id: 'home',       emoji: '🏠', label: 'Товары для дома'  },
  { id: 'sport',      emoji: '🏋️', label: 'Спорт'            },
  { id: 'food',       emoji: '🍎', label: 'Продукты'         },
]

const PROBLEMS = [
  { id: 'conversion', label: 'Низкая конверсия в корзину',     icon: '📉' },
  { id: 'content',    label: 'Медленное создание контента',     icon: '✍️'  },
  { id: 'support',    label: 'Перегруженная поддержка',        icon: '💬' },
  { id: 'retention',  label: 'Клиенты не возвращаются',        icon: '🔄' },
  { id: 'pricing',    label: 'Ценообразование «на глазок»',    icon: '💰' },
]

type Recommendation = {
  title: string
  desc: string
  roi: string
  payback: string
  steps: string[]
}

const RECS: Record<string, Record<string, Recommendation>> = {
  fashion: {
    conversion: { title: 'AI Контент-студия', desc: 'Генерируем студийные фото и описания для всего каталога за 48 ч.', roi: '+320%', payback: '3 нед', steps: ['Загрузка каталога','AI-съёмка','A/B тест','Публикация'] },
    content:    { title: 'AI Копирайтер',     desc: 'Автоматические SEO-описания с уникальным стилем бренда.', roi: '+180%', payback: '2 нед', steps: ['Анализ стиля','Обучение','Генерация','Публикация'] },
    support:    { title: 'Fashion-Бот',       desc: 'Консультирует по размерной сетке, возвратам и сочетаемости.', roi: '-65%', payback: '1 нед', steps: ['База знаний','Интеграция','Тест','Запуск'] },
    retention:  { title: 'Loyalty AI',        desc: 'Персональные луки и промо на основе истории покупок.', roi: '+240%', payback: '4 нед', steps: ['Анализ CRM','Сегменты','Кампании','Автопилот'] },
    pricing:    { title: 'Dynamic Pricing',   desc: 'Ценообразование в режиме реального времени по конкурентам.', roi: '+90%',  payback: '2 нед', steps: ['Парсинг','Модель','Правила','Go-live'] },
  },
}

function getRec(niche: string, problem: string): Recommendation {
  return (
    RECS[niche]?.[problem] ??
    RECS['fashion']?.['conversion'] ?? {
      title: 'AI-решение', desc: 'Индивидуальное решение для вашего бизнеса.', roi: '+200%', payback: '3 нед',
      steps: ['Аудит','Внедрение','Тест','Запуск'],
    }
  )
}

/* ─────────────────────────────────
   Sub-components
───────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              width:      i < current ? 20 : i === current ? 28 : 8,
              background: i < current ? '#4ADE80' : i === current ? '#FFE135' : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="h-[5px] rounded-full"
          />
        </div>
      ))}
      <span className="text-[10px] text-white/25 ml-1">{current + 1}/{total}</span>
    </div>
  )
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function AgentConfigurator() {
  const [step,    setStep]    = useState(0)
  const [niche,   setNiche]   = useState('')
  const [problem, setProblem] = useState('')
  const totalSteps = 3

  const rec = niche && problem ? getRec(niche, problem) : null

  const reset = () => { setStep(0); setNiche(''); setProblem('') }

  return (
    <section id="configurator" className="relative py-24 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="badge mx-auto mb-5">
            <Sparkles size={11} /> AI-конфигуратор
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Подберите агента
            <br />
            <span className="text-gradient">за 30 секунд</span>
          </h2>
          <p className="text-white/40 mt-5 max-w-md mx-auto">
            Ответьте на два вопроса — получите персональную рекомендацию и прогноз ROI.
          </p>
        </motion.div>

        {/* Wizard card */}
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          {/* Subtle glow corner */}
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, rgba(255,225,53,0.05), transparent 70%)' }} />

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            <StepIndicator current={step} total={totalSteps} />
            {step > 0 && (
              <button onClick={reset}
                className="text-[11px] text-white/25 hover:text-white/50 flex items-center gap-1 transition-colors">
                <RotateCcw size={10} /> Начать заново
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Step 0: niche ── */}
            {step === 0 && (
              <motion.div key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display font-bold text-xl text-white mb-2">Ваша ниша</h3>
                <p className="text-sm text-white/35 mb-6">Выберите категорию товаров</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NICHES.map(n => (
                    <motion.button
                      key={n.id}
                      onClick={() => { setNiche(n.id); setStep(1) }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-brand-yellow/30 hover:bg-brand-yellow/[0.04] transition-all text-left"
                    >
                      <span className="text-2xl">{n.emoji}</span>
                      <span className="font-medium text-sm text-white/70">{n.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Step 1: problem ── */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display font-bold text-xl text-white mb-2">Главная боль</h3>
                <p className="text-sm text-white/35 mb-6">Что мешает росту прямо сейчас?</p>
                <div className="flex flex-col gap-2.5">
                  {PROBLEMS.map(p => (
                    <motion.button
                      key={p.id}
                      onClick={() => { setProblem(p.id); setStep(2) }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-brand-yellow/30 hover:bg-brand-yellow/[0.04] transition-all text-left group"
                    >
                      <span className="text-xl w-8 text-center flex-shrink-0">{p.icon}</span>
                      <span className="font-medium text-sm text-white/70 flex-1">{p.label}</span>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-brand-yellow/60 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Step 2: result ── */}
            {step === 2 && rec && (
              <motion.div key="step2"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center flex-shrink-0">
                    <Sparkles size={22} className="text-brand-dark" />
                  </div>
                  <div>
                    <div className="text-[11px] text-brand-yellow/70 font-bold uppercase tracking-widest mb-1">Рекомендация AIROOM</div>
                    <h3 className="font-display font-black text-2xl text-white">{rec.title}</h3>
                  </div>
                </div>

                <p className="text-white/55 text-sm leading-relaxed mb-6">{rec.desc}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: TrendingUp, label: 'Прогноз ROI',     value: rec.roi,     color: '#4ADE80' },
                    { icon: Clock,      label: 'Окупаемость',      value: rec.payback, color: '#60A5FA' },
                  ].map(m => {
                    const Icon = m.icon
                    return (
                      <div key={m.label} className="border border-white/[0.07] rounded-xl p-4 bg-white/[0.02]">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={13} style={{ color: m.color }} />
                          <span className="text-[10px] text-white/30">{m.label}</span>
                        </div>
                        <div className="font-display font-black text-2xl" style={{ color: m.color }}>
                          {m.value}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Steps */}
                <div className="mb-8">
                  <div className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Этапы внедрения</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {rec.steps.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full"
                        >
                          <span className="text-[10px] text-brand-yellow/80 font-bold">{i + 1}</span>
                          <span className="text-[11px] text-white/55">{s}</span>
                        </motion.div>
                        {i < rec.steps.length - 1 && <ChevronRight size={10} className="text-white/20" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(255,225,53,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold text-base flex items-center justify-center gap-2.5"
                >
                  <Zap size={18} strokeWidth={2.5} />
                  Запустить {rec.title}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
