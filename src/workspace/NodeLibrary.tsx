import { Star } from 'lucide-react'
import { NODE_LIST, PORT_COLORS } from './types'

export default function NodeLibrary() {
  return (
    <aside className="w-60 flex-shrink-0 border-r border-white/[0.07] bg-[#161616] overflow-y-auto no-scrollbar">
      <div className="px-4 py-3 border-b border-white/[0.07] sticky top-0 bg-[#161616] z-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/40">Библиотека нодов</div>
        <div className="text-[10px] text-white/25 mt-0.5">Перетащите на холст</div>
      </div>
      <div className="p-3 space-y-2">
        {NODE_LIST.map((def) => {
          const Icon = def.icon
          return (
            <div
              key={def.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/airoom-node', def.type)
                e.dataTransfer.effectAllowed = 'move'
              }}
              className="relative group cursor-grab active:cursor-grabbing rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-3 hover:border-brand-yellow/40 transition-colors"
            >
              {/* cost badge */}
              <div className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold rounded-md px-1.5 py-0.5"
                style={{
                  color: def.cost ? '#FFE135' : 'rgba(255,255,255,0.35)',
                  background: def.cost ? 'rgba(255,225,53,0.1)' : 'rgba(255,255,255,0.05)',
                  border: def.cost ? '1px solid rgba(255,225,53,0.2)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {def.cost || 0} <Star size={9} fill="currentColor" />
              </div>

              <div className="flex items-center gap-2 mb-1.5 pr-10">
                <div className="w-7 h-7 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-brand-yellow" />
                </div>
                <div className="text-[13px] font-display font-bold text-white leading-tight">{def.label}</div>
              </div>
              <div className="text-[10px] text-white/30 mb-2">{def.category}</div>

              {/* port type dots */}
              <div className="flex items-center gap-1">
                {[...def.inputs, ...def.outputs].map((p, i) => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ background: PORT_COLORS[p.type] }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
