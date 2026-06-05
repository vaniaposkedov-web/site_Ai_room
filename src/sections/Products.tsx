import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Brain, BarChart3, Workflow, MessageSquare,
  FileText, Search, ArrowUpRight, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react'

/* ─── mock products ─── */
const products = [
  {
    id: 'assistant',
    icon: Brain,
    accentColor: '#FFE135',
    tag: 'AI Core',
    name: 'AIROOM Assistant',
    tagline: 'Умный помощник для вашей команды',
    description: 'GPT-4o агент, обученный на ваших данных. Отвечает на вопросы, создаёт документы, управляет задачами.',
    features: ['Обучение на корпоративных данных', 'Интеграция с любым мессенджером', 'История и память контекста', 'Ролевые разграничения'],
    metrics: [
      { label: 'Ответов в день', value: '48K' },
      { label: 'Точность', value: '98.4%' },
      { label: 'Языков', value: '52' },
    ],
    preview: 'chat',
    badge: 'Хит продаж',
    users: 2140,
  },
  {
    id: 'analytics',
    icon: BarChart3,
    accentColor: '#60a5fa',
    tag: 'Analytics',
    name: 'AIROOM Analytics',
    tagline: 'Аналитика в реальном времени',
    description: 'Дашборды с AI-прогнозами. Автоматические отчёты, аномалии, предсказания трендов.',
    features: ['200+ готовых дашбордов', 'SQL & no-code запросы', 'Автоотчёты на email', 'Прогнозирование трендов'],
    metrics: [
      { label: 'Источников данных', value: '300+' },
      { label: 'Задержка', value: '< 0.5с' },
      { label: 'Отчётов/мес', value: '50K' },
    ],
    preview: 'chart',
    badge: null,
    users: 890,
  },
  {
    id: 'automation',
    icon: Workflow,
    accentColor: '#4ade80',
    tag: 'Automation',
    name: 'AIROOM Flow',
    tagline: 'No-code автоматизация процессов',
    description: 'Визуальный конструктор workflow. Автоматизируйте любые бизнес-процессы без разработчика.',
    features: ['Drag-and-drop редактор', '300+ триггеров и действий', 'Conditional logic & loops', 'Версионирование workflow'],
    metrics: [
      { label: 'Шаблонов', value: '500+' },
      { label: 'Запусков/сутки', value: '10K' },
      { label: 'Настройка', value: '5 мин' },
    ],
    preview: 'flow',
    badge: 'Новое',
    users: 1340,
  },
  {
    id: 'support',
    icon: MessageSquare,
    accentColor: '#f472b6',
    tag: 'Support',
    name: 'AIROOM Support',
    tagline: 'AI-поддержка клиентов 24/7',
    description: 'Умный чат-бот для вашего сайта и приложения. Закрывает 80% обращений без участия человека.',
    features: ['Омниканальность: web, TG, WA', 'Передача оператору с контекстом', 'Обучение на базе знаний', 'CSAT аналитика'],
    metrics: [
      { label: 'Закрывает без агента', value: '80%' },
      { label: 'Время ответа', value: '< 1с' },
      { label: 'CSat', value: '4.9 / 5' },
    ],
    preview: 'support',
    badge: null,
    users: 3210,
  },
  {
    id: 'docs',
    icon: FileText,
    accentColor: '#a78bfa',
    tag: 'Docs AI',
    name: 'AIROOM Docs',
    tagline: 'Генерация и анализ документов',
    description: 'Создавайте, анализируйте и суммаризируйте документы. Извлекайте данные из PDF, Word, таблиц.',
    features: ['PDF/Word/Excel парсинг', 'Автогенерация по шаблонам', 'Суммаризация и QA', 'Электронная подпись'],
    metrics: [
      { label: 'Форматов', value: '40+' },
      { label: 'Обработка файла', value: '3 сек' },
      { label: 'Точность OCR', value: '99.1%' },
    ],
    preview: 'docs',
    badge: null,
    users: 560,
  },
  {
    id: 'search',
    icon: Search,
    accentColor: '#fb923c',
    tag: 'Search',
    name: 'AIROOM Search',
    tagline: 'Семантический поиск по базе знаний',
    description: 'Векторный поиск по всем корпоративным данным. Находит нужное по смыслу, а не по ключевым словам.',
    features: ['Vector embeddings', 'Поиск по 1M+ документам', 'Мультиязычный', 'Интеграция с Confluence / Notion'],
    metrics: [
      { label: 'Результат', value: '< 100мс' },
      { label: 'Точность', value: '96%' },
      { label: 'Индексирует', value: '1M+ doc' },
    ],
    preview: 'search',
    badge: 'Beta',
    users: 320,
  },
]

/* ─── Preview components ─── */
function ChatPreview({ color }: { color: string }) {
  const msgs = [
    { r: true, t: 'Покажи отчёт за эту неделю' },
    { r: false, t: 'Выручка: $48K (+12%). Топ: Product A ($18K). Хотите детали?' },
    { r: true, t: 'Да, сравни с прошлым месяцем' },
  ]
  return (
    <div className="space-y-2 p-3">
      {msgs.map((m, i) => (
        <div key={i} className={`flex ${m.r ? 'justify-end' : 'justify-start'}`}>
          <div className={`text-[11px] px-3 py-1.5 rounded-xl max-w-[85%] leading-relaxed ${
            m.r ? 'font-medium' : 'bg-white/6 text-white/70'}`}
            style={m.r ? { background: color, color: '#262626' } : {}}>
            {m.t}
          </div>
        </div>
      ))}
      <div className="flex gap-1 pl-1 mt-1">
        {[0,1,2].map(i=>(
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/25"
            animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:1, delay:i*0.2 }} />
        ))}
      </div>
    </div>
  )
}

function ChartPreview({ color }: { color: string }) {
  const bars = [55, 70, 45, 88, 60, 95, 72, 80]
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white/40">Revenue · Week</span>
        <span className="text-[10px] font-bold" style={{ color }}>+23%</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {bars.map((v, i) => (
          <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${v}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }}
            className="flex-1 rounded-t-sm"
            style={{ background: i === bars.length - 1 ? color : `${color}33` }} />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Today'].map(d=>(
          <span key={d} className="text-[8px] text-white/20">{d.slice(0,1)}</span>
        ))}
      </div>
    </div>
  )
}

function FlowPreview({ color }: { color: string }) {
  const nodes = [
    { label: 'Webhook', x: 8, y: 12 },
    { label: 'Filter', x: 48, y: 4 },
    { label: 'AI Agent', x: 48, y: 28 },
    { label: 'Slack', x: 82, y: 12 },
  ]
  return (
    <div className="relative h-16 p-2">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 48">
        <path d="M18 18 Q34 18 48 12" stroke={`${color}50`} strokeWidth="1" fill="none" />
        <path d="M18 18 Q34 18 48 36" stroke={`${color}50`} strokeWidth="1" fill="none" />
        <path d="M58 12 Q72 12 80 20" stroke={`${color}80`} strokeWidth="1" fill="none" />
        <path d="M58 36 Q72 36 80 28" stroke={`${color}50`} strokeWidth="1" fill="none" />
        {nodes.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width="20" height="12" rx="3" fill={`${color}18`} stroke={`${color}40`} strokeWidth="0.5" />
            <text x={n.x + 10} y={n.y + 8} textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="4">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function DocsPreview() {
  return (
    <div className="p-3 space-y-1.5">
      {['Договор_Q3_2024.pdf', 'Отчёт_продажи.xlsx', 'NDA_партнёр.docx'].map((f, i) => (
        <div key={f} className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-1.5">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold ${
            ['bg-red-500/20 text-red-400', 'bg-green-500/20 text-green-400', 'bg-blue-500/20 text-blue-400'][i]}`}>
            {['PDF','XLS','DOC'][i]}
          </div>
          <span className="text-[11px] text-white/60 truncate flex-1">{f}</span>
          <CheckCircle2 size={11} className="text-[#4ade80] flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

function SearchPreview({ color }: { color: string }) {
  const results = ['Политика возврата товаров', 'Инструкция по онбордингу', 'Q3 Revenue Report 2024']
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 bg-white/6 rounded-lg px-2.5 py-1.5 mb-2">
        <Search size={11} className="text-white/30" />
        <span className="text-[11px] text-white/25">как оформить возврат...</span>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${color}25`, color }}>AI</span>
      </div>
      {results.map((r, i) => (
        <div key={r} className="flex items-center gap-2 py-1.5 border-b border-white/4 last:border-0">
          <div className="w-1 h-1 rounded-full" style={{ background: color, opacity: 1 - i * 0.25 }} />
          <span className="text-[11px] text-white/60">{r}</span>
        </div>
      ))}
    </div>
  )
}

function SupportPreview({ color }: { color: string }) {
  const tickets = [
    { id: '#4821', text: 'Не могу войти в аккаунт', status: 'AI', statusColor: color },
    { id: '#4820', text: 'Как отменить подписку?', status: 'AI', statusColor: color },
    { id: '#4819', text: 'Нужен счёт на оплату', status: 'Агент', statusColor: '#94a3b8' },
  ]
  return (
    <div className="p-3 space-y-1.5">
      {tickets.map(t => (
        <div key={t.id} className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-1.5">
          <span className="text-[9px] text-white/25 font-mono w-10 flex-shrink-0">{t.id}</span>
          <span className="text-[11px] text-white/60 flex-1 truncate">{t.text}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: `${t.statusColor}20`, color: t.statusColor }}>{t.status}</span>
        </div>
      ))}
    </div>
  )
}

function ProductPreview({ product }: { product: (typeof products)[0] }) {
  const c = product.accentColor
  return (
    <div className="bg-[#111] rounded-xl overflow-hidden border border-white/[0.05] min-h-[120px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04] bg-[#0d0d0d]">
        <div className="flex gap-1">
          {[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
        </div>
        <div className="flex-1 h-3.5 bg-white/5 rounded text-[9px] text-white/20 flex items-center px-2">
          {product.id}.airoom.io
        </div>
      </div>
      {product.preview === 'chat' && <ChatPreview color={c} />}
      {product.preview === 'chart' && <ChartPreview color={c} />}
      {product.preview === 'flow' && <FlowPreview color={c} />}
      {product.preview === 'docs' && <DocsPreview />}
      {product.preview === 'search' && <SearchPreview color={c} />}
      {product.preview === 'support' && <SupportPreview color={c} />}
    </div>
  )
}

/* ─── Main section ─── */
export default function Products() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(products[0].id)
  const current = products.find(p => p.id === active)!

  return (
    <section id="products" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1e1e1e]" />
      <div className="absolute inset-0 dot-bg opacity-25" />
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#FFE135]/4 blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex mb-4">
            <span className="section-tag"><Sparkles size={11} />Продукты</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Шесть инструментов —<br />
            <span className="text-gradient-yellow">одна экосистема</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-lg mx-auto"
          >
            Каждый продукт работает самостоятельно или в связке с остальными
          </motion.p>
        </div>

        {/* Product tabs + detail */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Tab list */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {products.map(p => (
              <button key={p.id} onClick={() => setActive(p.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 flex-shrink-0 lg:flex-shrink
                  border ${active === p.id
                    ? 'bg-[#262626] border-[rgba(255,225,53,0.2)]'
                    : 'border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]'}`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: active === p.id ? `${p.accentColor}20` : 'rgba(255,255,255,0.04)' }}>
                  <p.icon size={17} style={{ color: active === p.id ? p.accentColor : 'rgba(255,255,255,0.35)' }} />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${active === p.id ? 'text-white' : 'text-white/50'}`}>
                    {p.name}
                  </div>
                  <div className="text-[11px] text-white/30 truncate">{p.tagline}</div>
                </div>
                {p.badge && (
                  <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${p.accentColor}20`, color: p.accentColor }}>
                    {p.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/[0.07] bg-[#1a1a1a] p-6 lg:p-8 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left info */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${current.accentColor}18`, border: `1px solid ${current.accentColor}30` }}>
                      <current.icon size={22} style={{ color: current.accentColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white text-lg">{current.name}</span>
                        {current.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${current.accentColor}20`, color: current.accentColor }}>
                            {current.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/40">{current.tag}</span>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6">{current.description}</p>

                  <ul className="space-y-2.5 mb-6">
                    {current.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 size={14} style={{ color: current.accentColor }} className="flex-shrink-0" />
                        <span className="text-white/65">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4">
                    <button className="btn-primary text-sm px-5 py-2.5 group"
                      style={{ background: current.accentColor, color: '#262626' }}>
                      Попробовать
                      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    <button className="text-sm text-white/45 hover:text-white flex items-center gap-1 transition-colors">
                      Подробнее <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right preview + metrics */}
                <div className="flex flex-col gap-4">
                  <ProductPreview product={current} />

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-3">
                    {current.metrics.map(m => (
                      <div key={m.label} className="bg-[#141414] rounded-xl p-3 text-center border border-white/[0.04]">
                        <div className="font-display text-base font-bold" style={{ color: current.accentColor }}>
                          {m.value}
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* User count */}
                  <div className="flex items-center gap-2 text-sm text-white/35">
                    <div className="flex -space-x-1.5">
                      {['#E8845A','#5A9EE8','#5AE89A'].map(c=>(
                        <div key={c} className="w-5 h-5 rounded-full border-2 border-[#1a1a1a]" style={{ background: c }} />
                      ))}
                    </div>
                    <span>{current.users.toLocaleString('ru')}+ пользователей уже работают</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
