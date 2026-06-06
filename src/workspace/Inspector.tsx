import { Trash2, Star } from 'lucide-react'
import { NODE_DEFS, PORT_COLORS, PORT_LABELS, STAR_TO_RUB } from './types'
import { useFlow } from './store'

export default function Inspector() {
  const selectedId = useFlow((s) => s.selectedId)
  const node = useFlow((s) => s.nodes.find((n) => n.id === s.selectedId))
  const setParam = useFlow((s) => s.setParam)
  const removeSelected = useFlow((s) => s.removeSelected)

  if (!node) {
    return (
      <aside className="w-72 flex-shrink-0 border-l border-white/[0.07] bg-[#161616] p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Инспектор</div>
        <div className="text-sm text-white/30 leading-relaxed">
          Выделите блок на холсте, чтобы открыть его настройки.
        </div>
      </aside>
    )
  }

  const def = NODE_DEFS[node.data.type]
  const Icon = def.icon

  return (
    <aside className="w-72 flex-shrink-0 border-l border-white/[0.07] bg-[#161616] overflow-y-auto no-scrollbar">
      <div className="px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center">
            <Icon size={16} className="text-brand-yellow" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">{def.label}</div>
            <div className="text-[10px] text-white/35">{def.category}</div>
          </div>
        </div>
        <p className="text-[12px] text-white/45 leading-relaxed mt-3">{def.description}</p>
      </div>

      {/* cost */}
      <div className="px-5 py-4 border-b border-white/[0.07]">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Стоимость блока</div>
        {def.cost > 0 ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-display font-black text-xl text-brand-yellow">
              {def.cost} <Star size={15} fill="currentColor" />
            </span>
            <span className="text-xs text-white/35">≈ {def.cost * STAR_TO_RUB} ₽ за запуск</span>
          </div>
        ) : (
          <div className="text-sm text-white/50">Бесплатно (на клиенте)</div>
        )}
      </div>

      {/* params */}
      {def.params && def.params.length > 0 && (
        <div className="px-5 py-4 border-b border-white/[0.07] space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-white/30">Настройки</div>
          {def.params.map((p) => (
            <div key={p.key}>
              <label className="block text-[11px] text-white/45 mb-1">{p.label}</label>
              {p.kind === 'select' ? (
                <select
                  value={node.data.params[p.key] ?? p.options?.[0] ?? ''}
                  onChange={(e) => setParam(node.id, p.key, e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40"
                >
                  {p.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  value={node.data.params[p.key] ?? ''}
                  placeholder={p.placeholder}
                  onChange={(e) => setParam(node.id, p.key, e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ports */}
      <div className="px-5 py-4 border-b border-white/[0.07]">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Порты</div>
        <div className="space-y-1.5">
          {def.inputs.map((p) => (
            <div key={`i-${p.id}`} className="flex items-center gap-2 text-[12px] text-white/55">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: PORT_COLORS[p.type] }} />
              Вход · {PORT_LABELS[p.type]} {p.required && <span className="text-[#EF4444]">*</span>}
            </div>
          ))}
          {def.outputs.map((p) => (
            <div key={`o-${p.id}`} className="flex items-center gap-2 text-[12px] text-white/55">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: PORT_COLORS[p.type] }} />
              Выход · {PORT_LABELS[p.type]}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={() => removeSelected()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#EF4444]/30 text-[#EF4444] text-sm font-semibold hover:bg-[#EF4444]/10 transition-colors"
          disabled={!selectedId}
        >
          <Trash2 size={15} /> Удалить блок
        </button>
      </div>
    </aside>
  )
}
