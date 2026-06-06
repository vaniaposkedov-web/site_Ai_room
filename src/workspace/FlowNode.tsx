import { useEffect, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X, Star, Loader2 } from 'lucide-react'
import { NODE_DEFS, PORT_COLORS } from './types'
import { useFlow, type FNode } from './store'

const HEADER_H = 36
const ROW_TOP = (i: number) => HEADER_H + 16 + i * 22

export default function FlowNode({ id, data, selected }: NodeProps<FNode>) {
  const def = NODE_DEFS[data.type]
  const edges = useFlow((s) => s.edges)
  const status = data.status
  const cost = def.cost

  const [float, setFloat] = useState(false)
  useEffect(() => {
    if (status === 'done' && cost > 0) {
      setFloat(true)
      const t = setTimeout(() => setFloat(false), 1100)
      return () => clearTimeout(t)
    }
  }, [status, cost])

  const connected = (handleId: string) => edges.some((e) => e.target === id && e.targetHandle === handleId)

  // необязательный порт скрываем, если значение задано в инспекторе и связь не подключена
  const inputs = def.inputs.filter((p) => {
    if (p.required) return true
    const paramFilled = (data.params[p.id] ?? '').trim().length > 0
    return connected(p.id) || !paramFilled
  })

  const missing = def.inputs.some((p) => p.required && !connected(p.id))

  const rows = Math.max(inputs.length, def.outputs.length, 1)
  const height = ROW_TOP(rows - 1) + 32

  const ring =
    status === 'error'
      ? '0 0 0 2px #EF4444'
      : status === 'done'
        ? '0 0 0 2px #4ADE80'
        : missing
          ? '0 0 0 2px #EF4444'
          : selected
            ? '0 0 0 2px #FFE135'
            : '0 0 0 1px rgba(255,255,255,0.10)'

  const Icon = def.icon

  return (
    <motion.div
      animate={
        status === 'processing'
          ? { boxShadow: ['0 0 0 2px rgba(255,225,53,0.9)', '0 0 0 6px rgba(255,225,53,0.15)', '0 0 0 2px rgba(255,225,53,0.9)'] }
          : { boxShadow: ring }
      }
      transition={status === 'processing' ? { duration: 1.1, repeat: Infinity } : { duration: 0.2 }}
      className="relative rounded-xl bg-[#1A1A1A] text-white"
      style={{ width: 210, height, border: missing ? '1px dashed rgba(239,68,68,0.5)' : '1px solid transparent' }}
    >
      {/* billing float */}
      <AnimatePresence>
        {float && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -34, scale: 1 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 1 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 flex items-center gap-1 text-[#EF4444] font-display font-black text-sm pointer-events-none"
          >
            −{cost} <Star size={13} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* header */}
      <div className="flex items-center gap-2 px-2.5 h-[36px] border-b border-white/[0.07]">
        <div className="w-5 h-5 rounded-md bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center flex-shrink-0">
          <Icon size={12} className="text-brand-yellow" />
        </div>
        <span className="text-[12px] font-display font-bold truncate flex-1">{def.label}</span>
        {cost > 0 ? (
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-1.5 py-0.5 rounded-md">
            {cost} <Star size={9} fill="currentColor" />
          </span>
        ) : (
          <span className="text-[9px] text-white/35 uppercase tracking-wider">free</span>
        )}
      </div>

      {/* status indicator */}
      <div className="absolute right-2.5 top-[42px] z-10">
        {status === 'processing' && <Loader2 size={13} className="text-brand-yellow animate-spin" />}
        {status === 'done' && <CheckCircle2 size={14} className="text-[#4ADE80]" />}
        {status === 'error' && <X size={14} className="text-[#EF4444]" />}
      </div>

      {/* inputs */}
      {inputs.map((p, i) => (
        <div key={p.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={p.id}
            style={{ top: ROW_TOP(i), width: 12, height: 12, background: PORT_COLORS[p.type], border: '2px solid #1A1A1A' }}
          />
          <span className="absolute left-3 text-[10px] text-white/90 font-semibold flex items-center gap-1" style={{ top: ROW_TOP(i) - 7 }}>
            {p.label}
            {p.required && <span className="text-[#FF6F6F]">*</span>}
          </span>
        </div>
      ))}

      {/* outputs */}
      {def.outputs.map((p, i) => (
        <div key={p.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={p.id}
            style={{ top: ROW_TOP(i), width: 12, height: 12, background: PORT_COLORS[p.type], border: '2px solid #1A1A1A' }}
          />
          <span className="absolute right-3 text-[10px] text-white/90 font-semibold" style={{ top: ROW_TOP(i) - 7 }}>
            {p.label}
          </span>
        </div>
      ))}

      {/* footer status text */}
      <div className="absolute left-0 right-0 bottom-0 px-2.5 py-1 text-[9px] uppercase tracking-wider border-t border-white/[0.06]">
        {status === 'processing' && <span className="text-brand-yellow">Обработка…</span>}
        {status === 'done' && <span className="text-[#4ADE80]">Готово</span>}
        {status === 'error' && <span className="text-[#EF4444]">Ошибка</span>}
        {status === 'idle' && <span className="text-white/30">{missing ? 'Нужен вход' : 'Ожидание'}</span>}
      </div>
    </motion.div>
  )
}
