import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  getOutgoers,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import { NODE_DEFS, START_BALANCE, type FlowNodeData, type PortType } from './types'

export type FNode = Node<FlowNodeData>

const portType = (nodeType: string, handleId: string | null | undefined, dir: 'in' | 'out'): PortType | null => {
  const def = NODE_DEFS[nodeType]
  if (!def || !handleId) return null
  const list = dir === 'in' ? def.inputs : def.outputs
  return list.find((p) => p.id === handleId)?.type ?? null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface State {
  nodes: FNode[]
  edges: Edge[]
  balance: number
  selectedId: string | null
  running: boolean
  seq: number

  onNodesChange: (c: NodeChange[]) => void
  onEdgesChange: (c: EdgeChange[]) => void
  onConnect: (c: Connection) => void
  isValidConnection: (c: Connection | Edge) => boolean
  addNode: (type: string, position: { x: number; y: number }) => void
  removeSelected: () => void
  setSelected: (id: string | null) => void
  setParam: (id: string, key: string, value: string) => void
  graphCost: () => number
  run: () => Promise<void>
}

let idCounter = 1
const newId = () => `n${idCounter++}`

/* стартовая мини-цепочка для наглядности */
const seedNodes: FNode[] = [
  { id: newId(), type: 'flow', position: { x: 40, y: 160 }, data: { type: 'upload', status: 'idle', params: {} } },
  { id: newId(), type: 'flow', position: { x: 340, y: 160 }, data: { type: 'removebg', status: 'idle', params: {} } },
  { id: newId(), type: 'flow', position: { x: 640, y: 120 }, data: { type: 'genbg', status: 'idle', params: { style: 'Студия' } } },
  { id: newId(), type: 'flow', position: { x: 940, y: 160 }, data: { type: 'output', status: 'idle', params: {} } },
]
const seedEdges: Edge[] = [
  { id: 'e1', source: seedNodes[0].id, sourceHandle: 'image', target: seedNodes[1].id, targetHandle: 'image', type: 'flow' },
  { id: 'e2', source: seedNodes[1].id, sourceHandle: 'image', target: seedNodes[2].id, targetHandle: 'image', type: 'flow' },
  { id: 'e3', source: seedNodes[2].id, sourceHandle: 'image', target: seedNodes[3].id, targetHandle: 'image', type: 'flow' },
]

export const useFlow = create<State>((set, get) => ({
  nodes: seedNodes,
  edges: seedEdges,
  balance: START_BALANCE,
  selectedId: null,
  running: false,
  seq: 0,

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as FNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  isValidConnection: (c) => {
    const { nodes, edges } = get()
    if (!c.source || !c.target || c.source === c.target) return false
    const src = nodes.find((n) => n.id === c.source)
    const tgt = nodes.find((n) => n.id === c.target)
    if (!src || !tgt) return false
    // совпадение типов портов
    const st = portType(src.data.type, c.sourceHandle, 'out')
    const tt = portType(tgt.data.type, c.targetHandle, 'in')
    if (!st || !tt || st !== tt) return false
    // запрет циклов: target не должен достигать source
    const hasCycle = (node: FNode, visited = new Set<string>()): boolean => {
      if (visited.has(node.id)) return false
      visited.add(node.id)
      for (const out of getOutgoers(node, nodes, edges)) {
        if (out.id === c.source) return true
        if (hasCycle(out, visited)) return true
      }
      return false
    }
    return !hasCycle(tgt)
  },

  onConnect: (c) => {
    if (!get().isValidConnection(c)) return
    // один вход — одна связь: убираем прежнюю связь к этому входу
    const cleaned = get().edges.filter(
      (e) => !(e.target === c.target && e.targetHandle === c.targetHandle),
    )
    set({ edges: addEdge({ ...c, type: 'flow' }, cleaned) })
  },

  addNode: (type, position) =>
    set((s) => ({
      nodes: [
        ...s.nodes,
        { id: newId(), type: 'flow', position, data: { type, status: 'idle', params: {} } },
      ],
    })),

  removeSelected: () =>
    set((s) => {
      if (!s.selectedId) return s
      return {
        nodes: s.nodes.filter((n) => n.id !== s.selectedId),
        edges: s.edges.filter((e) => e.source !== s.selectedId && e.target !== s.selectedId),
        selectedId: null,
      }
    }),

  setSelected: (id) => set({ selectedId: id }),

  setParam: (id, key, value) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, params: { ...n.data.params, [key]: value } } } : n,
      ),
    })),

  graphCost: () => get().nodes.reduce((sum, n) => sum + (NODE_DEFS[n.data.type]?.cost ?? 0), 0),

  run: async () => {
    const { running, nodes, edges, graphCost, balance } = get()
    if (running || nodes.length === 0) return
    if (balance < graphCost()) return

    // топологический порядок (Kahn)
    const indeg = new Map(nodes.map((n) => [n.id, 0]))
    edges.forEach((e) => indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1))
    const queue = nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id)
    const order: string[] = []
    while (queue.length) {
      const id = queue.shift()!
      order.push(id)
      edges.filter((e) => e.source === id).forEach((e) => {
        const d = (indeg.get(e.target) ?? 0) - 1
        indeg.set(e.target, d)
        if (d === 0) queue.push(e.target)
      })
    }

    const setStatus = (id: string, status: FlowNodeData['status']) =>
      set((s) => ({
        nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, status } } : n)),
      }))
    const setEdgesActive = (targetId: string | null) =>
      set((s) => ({
        edges: s.edges.map((e) => ({ ...e, animated: e.target === targetId, data: { ...e.data, active: e.target === targetId } })),
      }))

    // сброс
    set((s) => ({
      running: true,
      nodes: s.nodes.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })),
    }))

    for (const id of order) {
      setStatus(id, 'processing')
      setEdgesActive(id)
      const cost = NODE_DEFS[get().nodes.find((n) => n.id === id)!.data.type]?.cost ?? 0
      await sleep(700 + cost * 250)
      setStatus(id, 'done')
      if (cost > 0) set((s) => ({ balance: s.balance - cost, seq: s.seq + 1 }))
    }

    setEdgesActive(null)
    set({ running: false })
  },
}))
