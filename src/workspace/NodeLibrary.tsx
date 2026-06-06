import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Search, ChevronDown } from 'lucide-react'
import { NODE_LIST, CATEGORY_ORDER, PORT_COLORS, type Category, type NodeDef } from './types'

function NodeChip({ def }: { def: NodeDef }) {
  const Icon = def.icon
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/airoom-node', def.type)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="relative group cursor-grab active:cursor-grabbing rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-3 hover:border-brand-yellow/40 transition-colors"
    >
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
      <div className="flex items-center gap-1">
        {[...def.inputs, ...def.outputs].map((p, i) => (
          <span key={i} className="w-2 h-2 rounded-full" style={{ background: PORT_COLORS[p.type] }} />
        ))}
      </div>
    </div>
  )
}

export default function NodeLibrary() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({ Источники: true })

  const q = query.trim().toLowerCase()
  const matches = useMemo(
    () =>
      NODE_LIST.filter(
        (d) => !q || d.label.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q)),
      ),
    [q],
  )

  const byCat = (cat: Category) => matches.filter((d) => d.category === cat)
  const isOpen = (cat: Category) => (q ? byCat(cat).length > 0 : !!open[cat])

  return (
    <aside className="w-60 flex-shrink-0 border-r border-white/[0.07] bg-[#161616] flex flex-col">
      {/* sticky search */}
      <div className="sticky top-0 z-10 bg-[#161616] border-b border-white/[0.07] p-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">Библиотека</div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1A] px-2.5 py-2 focus-within:border-brand-yellow/40">
          <Search size={14} className="text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск нодов…"
            className="flex-1 bg-transparent text-sm text-white/85 outline-none placeholder:text-white/25"
          />
        </div>
      </div>

      {/* accordion */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        {CATEGORY_ORDER.map((cat) => {
          const items = byCat(cat)
          if (q && items.length === 0) return null
          const opened = isOpen(cat)
          return (
            <div key={cat}>
              <button
                onClick={() => setOpen((o) => ({ ...o, [cat]: !o[cat] }))}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors"
              >
                <motion.span animate={{ rotate: opened ? 0 : -90 }} className="text-white/40">
                  <ChevronDown size={15} />
                </motion.span>
                <span className="text-[13px] font-display font-bold text-white/80 flex-1">{cat}</span>
                <span className="text-[10px] text-white/30">{items.length}</span>
              </button>
              <AnimatePresence initial={false}>
                {opened && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-1 py-1.5">
                      {items.map((d) => <NodeChip key={d.type} def={d} />)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        {q && matches.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-white/30">Ничего не найдено</div>
        )}
      </div>
    </aside>
  )
}
