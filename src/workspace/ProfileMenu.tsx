import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Images, BarChart3, Star, FileText, Shield } from 'lucide-react'
import { useStudio } from './studioStore'
import { getTool } from './tools'

export default function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const history = useStudio((s) => s.history)
  const stats = useStudio((s) => s.stats)
  const toggleLike = useStudio((s) => s.toggleLike)

  const liked = history.filter((h) => h.liked)
  const mostId = Object.entries(stats.byTool).sort((a, b) => b[1] - a[1])[0]?.[0]
  const most = mostId ? getTool(mostId).name : '—'

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="w-9 h-9 rounded-full bg-[#F5C800]/15 border border-[#F5C800]/30 flex items-center justify-center text-[#F5C800] hover:bg-[#F5C800]/25 transition-colors" aria-label="Профиль">
        <User size={17} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[1099]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-[1100] w-80 max-w-[90vw] rounded-2xl border border-white/[0.1] bg-[#1f1f1f] shadow-2xl overflow-hidden"
            >
              {/* header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/[0.07]">
                <div className="w-10 h-10 rounded-full bg-[#F5C800] flex items-center justify-center text-[#111]"><User size={18} /></div>
                <div className="flex-1">
                  <div className="font-['Unbounded'] font-bold text-sm text-white">Мой профиль</div>
                  <div className="text-[11px] text-white/40">Гость · AIROOM</div>
                </div>
              </div>

              {/* stats */}
              <div className="grid grid-cols-2 gap-2.5 p-4">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35 mb-1"><BarChart3 size={12} /> Всего генераций</div>
                  <div className="font-['Unbounded'] font-bold text-xl text-[#F5C800]">{stats.total}</div>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35 mb-1"><Heart size={12} /> Понравилось</div>
                  <div className="font-['Unbounded'] font-bold text-xl text-[#F5C800]">{stats.liked}</div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35 mb-1"><Star size={12} /> Наиболее используемое</div>
                  <div className="font-semibold text-sm text-white">{most}</div>
                </div>
              </div>

              {/* liked thumbs */}
              {liked.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/35 mb-2 flex items-center gap-1.5"><Heart size={12} className="text-[#F5C800]" /> Понравившееся</div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {liked.slice(0, 8).map((h) => (
                      <div key={h.id} className="w-12 h-14 rounded-lg overflow-hidden bg-[#141414] flex-shrink-0 flex items-center justify-center">
                        {h.image ? <img src={h.image} alt="" className="w-full h-full object-cover" /> : <FileText size={16} className="text-white/40" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* history */}
              <div className="px-4 pb-4">
                <div className="text-[10px] uppercase tracking-wider text-white/35 mb-2 flex items-center gap-1.5"><Images size={12} className="text-[#F5C800]" /> История генераций</div>
                {history.length === 0 ? (
                  <div className="text-[12px] text-white/30">Пока пусто — сгенерируйте первую карточку.</div>
                ) : (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar">
                    {history.slice(0, 12).map((h) => (
                      <div key={h.id} className="flex items-center gap-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] p-1.5">
                        <div className="w-9 h-10 rounded-md overflow-hidden bg-[#141414] flex-shrink-0 flex items-center justify-center">
                          {h.image ? <img src={h.image} alt="" className="w-full h-full object-cover" /> : <FileText size={14} className="text-white/40" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] text-white/80 truncate">{h.toolName}</div>
                          <div className="text-[10px] text-white/30">{new Date(h.ts).toLocaleString('ru', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <button onClick={() => toggleLike(h.id)} className="p-1.5 text-white/30 hover:text-[#F5C800]"><Heart size={14} className={h.liked ? 'text-[#F5C800] fill-[#F5C800]' : ''} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.07] text-[12px] text-white/45 hover:text-white transition-colors">
                <Shield size={13} /> Админ-панель
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
