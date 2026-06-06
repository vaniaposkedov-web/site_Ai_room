import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import { useFlow } from './store'
import { NODE_DEFS, PORT_COLORS, type PortType } from './types'

export default function FlowEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, sourceHandleId, data,
}: EdgeProps) {
  const nodes = useFlow((s) => s.nodes)
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  const srcNode = nodes.find((n) => n.id === source)
  const pType = srcNode
    ? (NODE_DEFS[srcNode.data.type]?.outputs.find((p) => p.id === sourceHandleId)?.type as PortType | undefined)
    : undefined
  const color = pType ? PORT_COLORS[pType] : '#FFE135'
  const active = !!(data as { active?: boolean } | undefined)?.active

  return (
    <>
      <BaseEdge id={id} path={path} style={{ stroke: color, strokeWidth: active ? 2.5 : 1.5, opacity: active ? 1 : 0.4 }} />
      {active &&
        [0, 0.3, 0.6].map((begin) => (
          <circle key={begin} r={4} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <animateMotion dur="0.9s" repeatCount="indefinite" begin={`-${begin}s`} path={path} />
          </circle>
        ))}
    </>
  )
}
