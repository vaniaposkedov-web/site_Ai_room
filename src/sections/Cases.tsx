import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const cases = [
  {
    client: 'Ozon',
    industry: 'Маркетплейс',
    challenge: 'Низкая конверсия карточек товаров на поиске, высокий CAC в перформанс-рекламе',
    solution: 'AI-рекомендательный движок + автогенерация SEO-описаний для 4M+ SKU',
    results: [
      { metric: '+340%', label: 'конверсия в корзину' },
      { metric: '−48%', label: 'стоимость клика' },
      { metric: '+$12M', label: 'доп. выручка / квартал' },
    ],
    period: '4 месяца',
    bgFrom: '#1a1a2e',
    accent: '#3B82F6',
    tags: ['Персонализация', 'SEO AI', 'Performance'],
  },
  {
    client: 'Wildberries',
    industry: 'Маркетплейс',
    challenge: 'Дорогое удержание клиентов, падение LTV у когорт после 6 месяцев',
    solution: 'Churn-prediction модель + AI-триггерные коммуникации с персональными офферами',
    results: [
      { metric: '+62%', label: 'retention 12 мес' },
      { metric: '−55%', label: 'CAC когорты' },
      { metric: '3.8×', label: 'LTV / CAC ratio' },
    ],
    period: '6 месяцев',
    bgFrom: '#1a1200',
    accent: '#FFE135',
    tags: ['Retention AI', 'CRM', 'Churn Prevention'],
  },
  {
    client: 'Lamoda',
    industry: 'Fashion e-com',
    challenge: 'Неэффективный ROAS в диджитал-рекламе, ручное управление ставками',
    solution: 'AI Bid Management + предиктивная сегментация аудиторий по LTV-тирам',
    results: [
      { metric: '4.4×', label: 'средний ROAS' },
      { metric: '−61%', label: 'CPO кампаний' },
      { metric: '+$3.1M', label: 'эффект за год' },
    ],
    period: '3 месяца',
    bgFrom: '#1a0d1a',
    accent: '#F472B6',
    tags: ['ROAS Optimization', 'Bid AI', 'Targeting'],
  },
  {
    client: 'СберМегаМаркет',
    industry: 'Омниканальный ритейл',
    challenge: 'Огромный каталог без релевантного поиска, падение конверсии на поиске −34%',
    solution: 'Семантический поиск на LLM-эмбеддингах + AI-ранжирование выдачи',
    results: [
      { metric: '+87%', label: 'CTR в поиске' },
      { metric: '+29%', label: 'конверсия поиска' },
      { metric: '×2.1', label: 'глубина сессии' },
    ],
    period: '5 месяцев',
    bgFrom: '#0d1a0d',
    accent: '#4ADE80',
    tags: ['Semantic Search', 'Ranking AI', 'UX'],
  },
]

function CaseCard({ c, i }: { c: (typeof cases)[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .55, delay: i * .1 }}
      className="card card-hover group overflow-hidden cursor-pointer"
    >
      {/* Top color band */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />

      <div className="p-7">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="font-display font-black text-2xl text-white">{c.client}</div>
              <ArrowUpRight size={16} className="text-white/20 group-hover:text-[#FFE135] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="text-xs text-white/35">{c.industry} · {c.period}</div>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[160px]">
            {c.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: `${c.accent}15`, color: c.accent }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Challenge */}
        <div className="mb-4">
          <div className="text-[10px] text-white/25 uppercase tracking-widest mb-1.5">Задача</div>
          <p className="text-sm text-white/55 leading-relaxed">{c.challenge}</p>
        </div>

        {/* Solution */}
        <div className="mb-6">
          <div className="text-[10px] text-white/25 uppercase tracking-widest mb-1.5">Решение</div>
          <p className="text-sm text-white/70 leading-relaxed">{c.solution}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.07] pt-5">
          <div className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Результаты</div>
          <div className="grid grid-cols-3 gap-3">
            {c.results.map(r => (
              <div key={r.label} className="text-center p-2.5 rounded-xl"
                style={{ background: `${c.accent}08`, border: `1px solid ${c.accent}20` }}>
                <div className="font-display font-black text-lg leading-none mb-1" style={{ color: c.accent }}>
                  {r.metric}
                </div>
                <div className="text-[10px] text-white/35 leading-tight">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Cases() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section id="cases" className="py-28 px-6 bg-[#1e1e1e]">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="pill mb-5">Кейсы</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
              className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Реальные бренды —<br /><span className="ty">измеримые результаты</span>
            </motion.h2>
          </div>
          <motion.button initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .3 }}
            className="btn btn-ghost text-sm shrink-0">
            Все кейсы <ArrowUpRight size={15} />
          </motion.button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((c, i) => <CaseCard key={c.client} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}
