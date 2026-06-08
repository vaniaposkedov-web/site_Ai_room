import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, LayoutGrid } from 'lucide-react'
import WorkNav from '@/workspace/WorkNav'
import { useStudio } from '@/workspace/studioStore'
import { TOOLS } from '@/workspace/tools'

const GRID_BG = {
  backgroundColor: '#1c1c1c',
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
}

export default function ToolSelect() {
  const navigate = useNavigate()
  const setTool = useStudio((s) => s.setTool)
  const [picked, setPicked] = useState<string | null>(null)

  const choose = (id: string) => {
    if (picked) return
    setTool(id)
    setPicked(id)
    setTimeout(() => navigate('/app/create'), 1400)
  }

  return (
    <div className="min-h-screen text-white font-['Onest'] relative overflow-hidden" style={GRID_BG}>
      <WorkNav />
      <div className="pointer-events-none absolute top-[8%] -left-40 w-[500px] h-[500px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(245,200,0,0.06), transparent 70%)' }} />
      <div className="pointer-events-none absolute bottom-[10%] -right-40 w-[600px] h-[600px] rounded-full blur-[90px]" style={{ background: 'radial-gradient(circle, rgba(245,200,0,0.05), transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[11px] tracking-[0.1em] text-white/55">
            <LayoutGrid size={14} className="text-[#F5C800]" /> ВЫБЕРИТЕ ИНСТРУМЕНТ
          </span>
          <h1 className="font-['Unbounded'] font-bold text-4xl sm:text-5xl tracking-tight mt-5">Что будем создавать?</h1>
          <p className="text-white/55 mt-3.5 max-w-md mx-auto leading-relaxed">Выберите инструмент — мы сразу откроем рабочую область под ваш товар</p>
        </motion.div>

        {/* cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {TOOLS.map((t, i) => {
            const Icon = t.icon
            const on = picked === t.id
            const dim = picked && !on
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: dim ? 0.35 : 1, y: 0, scale: on ? 1.02 : 1 }}
                transition={{ duration: 0.5, delay: picked ? 0 : i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: picked ? 0 : -4 }}
                onClick={() => choose(t.id)}
                className="relative text-left rounded-2xl border p-6 transition-colors"
                style={{
                  background: on ? 'rgba(245,200,0,0.07)' : '#242424',
                  borderColor: on ? '#F5C800' : 'rgba(255,255,255,0.08)',
                  boxShadow: on ? '0 0 0 1px rgba(245,200,0,0.3), 0 16px 48px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                <span className="absolute right-4 top-3 font-['Unbounded'] text-[11px] font-bold text-white/20">{t.num}</span>
                <AnimatePresence>
                  {on && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-5 right-5 w-[22px] h-[22px] rounded-full bg-[#F5C800] flex items-center justify-center">
                      <Check size={12} className="text-[#111]" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-colors" style={{ background: on ? 'rgba(245,200,0,0.16)' : 'rgba(245,200,0,0.06)' }}>
                  <Icon size={22} className="text-[#F5C800]" />
                </div>
                <div className="font-['Unbounded'] font-bold text-[15px] leading-tight pr-6">{t.name}</div>
                <span className="inline-block mt-2.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: on ? 'rgba(245,200,0,0.15)' : 'rgba(255,255,255,0.04)', color: on ? '#F5C800' : 'rgba(255,255,255,0.55)' }}>
                  {t.tag}
                </span>
                <p className="text-[13.5px] text-white/55 leading-relaxed mt-3">{t.desc}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* init modal */}
      <AnimatePresence>
        {picked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-[#121212]/96 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center max-w-md px-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-[3px] border-white/[0.06] border-t-[#F5C800] animate-spin" />
              <h3 className="font-['Unbounded'] font-bold text-xl mb-3 flex items-center justify-center gap-2">Открываем «{TOOLS.find((t) => t.id === picked)?.name}» <ArrowRight size={18} className="text-[#F5C800]" /></h3>
              <p className="text-white/55 text-sm leading-relaxed">ИИ настраивает рабочее окружение под выбранный инструмент…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
