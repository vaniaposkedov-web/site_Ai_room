import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

const services = [
  {
    num: '01',
    title: 'AI Персонализация',
    short: 'Уникальный опыт для каждого покупателя на основе поведенческих данных',
    detail: 'Строим рекомендательные движки на базе collaborative filtering и LLM. Увеличиваем средний чек, глубину просмотра и retention. Интеграция с любой платформой за 2 недели.',
    tags: ['Recommender Systems', 'Real-time ML', 'A/B testing'],
    result: '+28% средний чек',
    clients: ['Ozon', 'Lamoda', 'Детский мир'],
    color: '#FFE135',
  },
  {
    num: '02',
    title: 'Контент-фабрика',
    short: 'Автоматическая генерация описаний, SEO-текстов и рекламных материалов',
    detail: 'Генерируем тысячи карточек товаров, email-кампаний и рекламных объявлений. GPT-4o, обученный на вашем tone-of-voice. Экономим 80% времени редакторов.',
    tags: ['GPT-4o Fine-tuning', 'SEO Optimization', 'Brand Voice AI'],
    result: '−80% время на контент',
    clients: ['Wildberries', 'СберМегаМаркет', 'Rendez-Vous'],
    color: '#60A5FA',
  },
  {
    num: '03',
    title: 'Таргетинг и ROAS',
    short: 'Предиктивный AI для управления рекламными ставками и аудиториями',
    detail: 'Автоматически оптимизируем ставки в Яндекс, VK, myTarget. Предсказываем LTV сегментов и бюджет под них. Снижаем CPO при сохранении объёма.',
    tags: ['Bid Management AI', 'LTV Prediction', 'Audience Segmentation'],
    result: '4.4× средний ROAS',
    clients: ['МВидео', 'Leroy Merlin', 'IKEA'],
    color: '#4ADE80',
  },
  {
    num: '04',
    title: 'Retention & CRM AI',
    short: 'Удерживаем покупателей: предиктивные триггеры, churn prevention, лояльность',
    detail: 'Определяем момент ухода клиента за 30 дней. Автоматически запускаем персональные офферы. Сегментируем базу и управляем программой лояльности через AI-агентов.',
    tags: ['Churn Prediction', 'Trigger Marketing', 'Loyalty AI'],
    result: '+40% retention rate',
    clients: ['Tinkoff', 'ВкусВилл', 'Lamoda'],
    color: '#F472B6',
  },
  {
    num: '05',
    title: 'AI Аналитика & Дашборды',
    short: 'Единая точка правды — от конверсий до P&L — с AI-инсайтами в реальном времени',
    detail: 'Строим data warehouse, подключаем все источники и создаём дашборды с автоаналитикой. AI сам находит аномалии и объясняет причины изменений метрик.',
    tags: ['Data Warehouse', 'Anomaly Detection', 'NL Insights'],
    result: '< 5 мин до инсайта',
    clients: ['Самокат', 'Hoff', 'Эльдорадо'],
    color: '#A78BFA',
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="services" className="py-28 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div ref={ref} className="grid lg:grid-cols-[1fr_360px] gap-10 mb-16 items-end">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="pill mb-5">
              Услуги
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
              className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Пять направлений,<br />
              <span className="ty">один результат</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .2 }}
            className="text-white/45 text-base leading-relaxed">
            Каждое направление — отдельная команда специалистов. Берём один фокус или
            строим комплексную AI-экосистему под ваш стек.
          </motion.p>
        </div>

        {/* Accordion list */}
        <div className="divide-y divide-white/[0.07]">
          {services.map((s, i) => {
            const isOpen = open === s.num
            return (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: .12 * i }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : s.num)}
                  className="w-full flex items-center gap-6 py-7 group text-left"
                >
                  {/* Number */}
                  <span className="font-display font-black text-4xl lg:text-5xl text-stroke w-16 shrink-0 leading-none"
                    style={{ WebkitTextStrokeColor: isOpen ? s.color : undefined, opacity: isOpen ? 1 : .7 }}>
                    {s.num}
                  </span>

                  {/* Title */}
                  <span className={`font-display font-bold text-xl lg:text-2xl flex-1 transition-colors ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {s.title}
                  </span>

                  {/* Short desc — hide on open */}
                  {!isOpen && (
                    <span className="hidden lg:block text-sm text-white/35 max-w-[320px] text-right leading-snug">
                      {s.short}
                    </span>
                  )}

                  {/* Result badge */}
                  <span className="hidden sm:block text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
                    style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}>
                    {s.result}
                  </span>

                  {/* Chevron */}
                  <ChevronDown size={18} className={`text-white/30 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#FFE135]' : ''}`} />
                </button>

                {/* Expand */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .35 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-0 lg:pl-22 grid lg:grid-cols-[1fr_280px] gap-8">
                        <div>
                          <p className="text-white/55 text-base leading-relaxed mb-5">{s.detail}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {s.tags.map(t => (
                              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] text-white/50 border border-white/[0.07]">{t}</span>
                            ))}
                          </div>
                          <button className="btn btn-y text-sm px-5 py-3 group">
                            Обсудить проект
                            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </button>
                        </div>
                        <div>
                          <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Клиенты по направлению</div>
                          <div className="flex flex-col gap-2">
                            {s.clients.map(c => (
                              <div key={c} className="flex items-center gap-3 text-sm font-medium text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
