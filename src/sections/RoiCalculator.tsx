import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, Zap, ArrowRight } from 'lucide-react'

/* ─────────────────────────────────
   Model
───────────────────────────────── */
const SUPPORT_RATE  = 0.03   // 3% of GMV goes to support ops
const SUPPORT_SAVE  = 0.70   // AI saves 70% of support costs
const CONV_LIFT     = 0.024  // +2.4% extra conversion → revenue lift
const RETENTION_ADD = 0.08   // +8% repeat purchase uplift

function calc(gmv: number) {
  const supportSaved    = gmv * SUPPORT_RATE * SUPPORT_SAVE
  const convRevenue     = gmv * CONV_LIFT
  const retentionRevenue= gmv * RETENTION_ADD
  const totalBenefit    = supportSaved + convRevenue + retentionRevenue
  const aiCost          = Math.max(49_000, Math.round(gmv * 0.005 / 1000) * 1000)
  const roi             = ((totalBenefit - aiCost) / aiCost) * 100
  const paybackMonths   = Math.max(1, Math.round((aiCost / (totalBenefit / 12)) * 10) / 10)
  return { supportSaved, convRevenue, retentionRevenue, totalBenefit, aiCost, roi, paybackMonths }
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000)     return `${Math.round(n / 1000)} тыс ₽`
  return `${n} ₽`
}

/* ─────────────────────────────────
   Slider
───────────────────────────────── */
const MIN_LOG = Math.log10(1_000_000)
const MAX_LOG = Math.log10(100_000_000)

function toLog(v: number) { return (Math.log10(v) - MIN_LOG) / (MAX_LOG - MIN_LOG) }
function fromLog(t: number) {
  const raw = Math.pow(10, MIN_LOG + t * (MAX_LOG - MIN_LOG))
  const step = raw < 10_000_000 ? 500_000 : 5_000_000
  return Math.round(raw / step) * step
}

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function RoiCalculator() {
  const [gmv, setGmv] = useState(10_000_000)  // ₽10M default
  const r = calc(gmv)

  const bars = [
    { label: 'Экономия поддержки', value: r.supportSaved,     color: '#60A5FA', pct: r.supportSaved / r.totalBenefit * 100 },
    { label: 'Рост конверсии',     value: r.convRevenue,       color: '#FFE135', pct: r.convRevenue / r.totalBenefit * 100 },
    { label: 'Удержание клиентов', value: r.retentionRevenue,  color: '#4ADE80', pct: r.retentionRevenue / r.totalBenefit * 100 },
  ]

  return (
    <section id="calculator" className="relative py-24 px-6 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="badge mx-auto mb-5">
            <Calculator size={11} /> ROI-калькулятор
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Посчитайте окупаемость
            <br />
            <span className="text-gradient">для вашего бизнеса</span>
          </h2>
          <p className="text-white/40 mt-5 max-w-md mx-auto">
            Введите ежемесячный GMV — мы покажем реальные цифры на основе данных 34 брендов.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">

          {/* ── Left: input + bars ── */}
          <div className="glass-card p-7 md:p-8">
            <div className="mb-8">
              <div className="flex items-end justify-between mb-2">
                <label className="text-sm font-bold text-white/60">Ежемесячный GMV</label>
                <motion.div
                  key={gmv}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-black text-2xl text-brand-yellow"
                >
                  {fmt(gmv)}
                </motion.div>
              </div>

              {/* Logarithmic slider */}
              <div className="relative">
                <input
                  type="range" min={0} max={1} step={0.001}
                  value={toLog(gmv)}
                  onChange={e => setGmv(fromLog(parseFloat(e.target.value)))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FFE135 ${toLog(gmv) * 100}%, rgba(255,255,255,0.1) ${toLog(gmv) * 100}%)`,
                  }}
                />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px; height: 20px;
                    background: #FFE135;
                    border-radius: 50%;
                    box-shadow: 0 0 14px rgba(255,225,53,0.5);
                    cursor: pointer;
                  }
                `}</style>
              </div>

              <div className="flex justify-between mt-1.5 text-[10px] text-white/20">
                <span>₽1 млн</span>
                <span>₽100 млн</span>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-4">
              <div className="text-[10px] text-white/25 uppercase tracking-widest">Источники выгоды</div>
              {bars.map(b => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/55">{b.label}</span>
                    <motion.span
                      key={b.value.toFixed(0)}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-display font-bold text-sm"
                      style={{ color: b.color }}
                    >
                      +{fmt(b.value)}
                    </motion.span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: b.color }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: summary ── */}
          <div className="flex flex-col gap-4">
            {/* Total benefit */}
            <div className="glass-card p-6 glow-yellow relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,225,53,0.08), transparent 60%)' }} />
              <div className="relative">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Совокупная выгода / мес</div>
                <motion.div
                  key={r.totalBenefit.toFixed(0)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display font-black text-4xl text-brand-yellow"
                >
                  +{fmt(r.totalBenefit)}
                </motion.div>
                <div className="text-xs text-white/25 mt-1">при стоимости AI-платформы {fmt(r.aiCost)}/мес</div>
              </div>
            </div>

            {/* ROI + Payback */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <TrendingUp size={16} className="text-[#4ADE80] mb-2" />
                <div className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">ROI</div>
                <motion.div
                  key={r.roi.toFixed(0)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-black text-2xl text-[#4ADE80]"
                >
                  {Math.round(r.roi)}%
                </motion.div>
              </div>
              <div className="glass-card p-5">
                <Zap size={16} className="text-[#60A5FA] mb-2" />
                <div className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">Окупаемость</div>
                <motion.div
                  key={r.paybackMonths}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-black text-2xl text-[#60A5FA]"
                >
                  {r.paybackMonths} мес
                </motion.div>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 26px rgba(255,225,53,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold flex items-center justify-center gap-2.5 mt-auto"
            >
              Получить детальный расчёт
              <ArrowRight size={18} />
            </motion.button>
            <p className="text-center text-[10px] text-white/20">
              Расчёт основан на медианных данных 34 e-commerce брендов
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
