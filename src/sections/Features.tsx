import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react'

/* ─── Mini chart sparkline ─── */
function Sparkline({ data, color = '#FFE135' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#sg-${color.replace('#', '')})`}
        stroke="none"
      />
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ─── Radial gauge ─── */
function Gauge({ value, label }: { value: number; label: string }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke="#FFE135" strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
        <text x="26" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
          {value}%
        </text>
      </svg>
      <span className="text-[10px] text-white/35 text-center leading-tight">{label}</span>
    </div>
  )
}

/* ─── Activity bar chart ─── */
function BarChart({ bars }: { bars: number[] }) {
  const max = Math.max(...bars)
  return (
    <div className="flex items-end gap-1 h-8">
      {bars.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          viewport={{ once: true }}
          style={{ background: i === bars.length - 1 ? '#FFE135' : `rgba(255,225,53,${0.15 + (v / max) * 0.35})` }}
          className="w-3 rounded-sm min-h-[3px]"
        />
      ))}
    </div>
  )
}

/* ─── Live pulse dot ─── */
function PulseDot({ color = '#4ade80' }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
        style={{ background: color }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: color }} />
    </span>
  )
}

/* ─── Feature cards data ─── */
const cards = [
  {
    tag: 'Neural Engine',
    title: 'Нейронный анализ',
    desc: 'Предсказывает тренды по историческим паттернам',
    wide: true,
    visual: 'chart',
    chartData: [30, 45, 28, 60, 52, 75, 68, 90, 82, 95, 88, 100],
    metric: { value: '+34%', label: 'рост точности за 30 дней' },
    live: true,
  },
  {
    tag: 'Automation',
    title: 'No-code автоматизация',
    desc: 'Визуальный редактор workflow без кода',
    wide: false,
    visual: 'gauge',
    gauges: [{ value: 92, label: 'Uptime' }, { value: 78, label: 'Эфф-сть' }],
    metric: { value: '10K+', label: 'задач/сутки' },
  },
  {
    tag: 'Real-time',
    title: 'Живая аналитика',
    desc: 'Дашборды обновляются каждые 500мс',
    wide: false,
    visual: 'bars',
    barsData: [40, 65, 45, 80, 55, 70, 90, 60, 85, 75],
    metric: { value: '< 0.5с', label: 'задержка данных' },
    live: true,
  },
  {
    tag: 'AI Chat',
    title: 'Умный ассистент',
    desc: 'Отвечает на вопросы и создаёт контент 24/7',
    wide: false,
    visual: 'chat',
    metric: { value: '4.9★', label: 'оценка пользователей' },
  },
  {
    tag: 'Integrations',
    title: '300+ коннекторов',
    desc: 'Slack, Notion, Jira, Salesforce и другие',
    wide: false,
    visual: 'integrations',
    metric: { value: '5 мин', label: 'до первой интеграции' },
  },
  {
    tag: 'Security',
    title: 'SOC2 · GDPR · E2E',
    desc: 'Корпоративный уровень безопасности',
    wide: false,
    visual: 'security',
    metric: { value: '99.99%', label: 'uptime SLA' },
  },
]

const integrationLogos = [
  { name: 'Slack', color: '#4A154B', letter: 'S' },
  { name: 'Notion', color: '#000', letter: 'N' },
  { name: 'Jira', color: '#0052CC', letter: 'J' },
  { name: 'Figma', color: '#F24E1E', letter: 'F' },
  { name: 'HubSpot', color: '#FF7A59', letter: 'H' },
  { name: '+295', color: '#262626', letter: '…' },
]

function CardVisual({ card }: { card: (typeof cards)[0] }) {
  if (card.visual === 'chart') {
    return (
      <div className="mt-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-[10px] text-white/30 font-mono">Revenue forecast</span>
          <span className="text-[10px] text-[#4ade80] flex items-center gap-1">
            <TrendingUp size={10} /> +34%
          </span>
        </div>
        <Sparkline data={card.chartData!} />
        <div className="flex justify-between mt-1">
          {['Jan', 'Mar', 'Jun', 'Sep', 'Dec'].map(m => (
            <span key={m} className="text-[9px] text-white/20 font-mono">{m}</span>
          ))}
        </div>
      </div>
    )
  }
  if (card.visual === 'gauge') {
    return (
      <div className="mt-4 flex gap-4">
        {card.gauges!.map(g => <Gauge key={g.label} value={g.value} label={g.label} />)}
        <div className="flex-1 flex flex-col justify-end gap-1">
          <div className="text-[10px] text-white/30">Workflow steps</div>
          {[85, 60, 92].map((v, i) => (
            <div key={i} className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${v}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full rounded-full bg-[#FFE135]/70"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (card.visual === 'bars') {
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/30 font-mono">Events / hour</span>
          <div className="flex items-center gap-1.5">
            <PulseDot />
            <span className="text-[10px] text-[#4ade80]">Live</span>
          </div>
        </div>
        <BarChart bars={card.barsData!} />
      </div>
    )
  }
  if (card.visual === 'chat') {
    return (
      <div className="mt-4 space-y-1.5">
        {[
          { user: true, text: 'Создай отчёт за Q3' },
          { user: false, text: 'Готово! Выручка +34% ↑' },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.user ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`text-[11px] px-2.5 py-1.5 rounded-lg max-w-[75%] ${
                m.user ? 'bg-[#FFE135] text-[#262626] font-medium' : 'bg-white/8 text-white/70'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div className="flex gap-1 pl-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-white/30"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }
  if (card.visual === 'integrations') {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {integrationLogos.map(({ name, color, letter }) => (
          <div
            key={name}
            title={name}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/10"
            style={{ background: color === '#000' ? '#1a1a1a' : color }}
          >
            {letter}
          </div>
        ))}
      </div>
    )
  }
  if (card.visual === 'security') {
    return (
      <div className="mt-4 space-y-2">
        {[
          { label: 'SOC2 Type II', ok: true },
          { label: 'GDPR Compliant', ok: true },
          { label: 'E2E Encryption', ok: true },
          { label: 'ISO 27001', ok: true },
        ].map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-2 text-[11px]">
            <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#4ade80]' : 'bg-white/20'}`} />
            <span className={ok ? 'text-white/60' : 'text-white/25'}>{label}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-64 h-64 rounded-full bg-[#FFE135]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex mb-4">
            <span className="section-tag"><Sparkles size={11} />Возможности</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Всё для <span className="text-gradient-yellow">AI-трансформации</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="text-white/50 text-lg max-w-xl mx-auto">
            Платформа объединяет AI, аналитику и автоматизацию в одном интерфейсе
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className={`group relative rounded-2xl p-6 border border-white/[0.06] bg-[#1a1a1a] overflow-hidden
                hover:border-[rgba(255,225,53,0.2)] hover:-translate-y-1 transition-all duration-300
                ${i === 0 ? 'lg:col-span-2' : ''}`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(255,225,53,0.04), transparent 40%)' }}
              />

              <div className="flex items-start justify-between">
                <span className="section-tag text-[10px] px-2.5 py-1">{card.tag}</span>
                {card.live && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#4ade80]">
                    <PulseDot />
                    live
                  </div>
                )}
              </div>

              <h3 className="font-display text-lg font-bold text-white mt-3">{card.title}</h3>
              <p className="text-sm text-white/40 mt-1 leading-relaxed">{card.desc}</p>

              <CardVisual card={card} />

              <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <div>
                  <span className="font-display text-lg font-bold text-[#FFE135]">{card.metric.value}</span>
                  <span className="text-[11px] text-white/30 ml-1.5">{card.metric.label}</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center
                  group-hover:bg-[#FFE135]/10 group-hover:border-[#FFE135]/30 border border-white/[0.06]
                  transition-all duration-200">
                  <ArrowUpRight size={13} className="text-white/30 group-hover:text-[#FFE135] transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom tag row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mt-10"
        >
          {['API-first', 'GPT-4o', 'Мультиязычность', 'Serverless', 'White-label', 'SSO / SAML'].map(t => (
            <span key={t}
              className="text-xs px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] text-white/40
                hover:border-[rgba(255,225,53,0.25)] hover:text-white/70 transition-all duration-200 cursor-default"
            >
              {t}
            </span>
          ))}
          <span className="text-xs text-[#FFE135]/50 cursor-pointer hover:text-[#FFE135] transition-colors">
            И ещё 40+ →
          </span>
        </motion.div>
      </div>

      {/* Inject mouse-tracking glow via JS */}
      <style>{`
        .group { --mouse-x: 50%; --mouse-y: 50%; }
      `}</style>
    </section>
  )
}
