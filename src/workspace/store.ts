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
import { NODE_DEFS, START_BALANCE, type FlowNodeData, type PortType, type NodeStatus } from './types'

export type FNode = Node<FlowNodeData>

export interface BatchFile {
  id: string
  name: string
  url: string
  status: NodeStatus
  progress: number
  current: string
}

interface Snapshot { nodes: FNode[]; edges: Edge[] }
interface Template { id: string; name: string; nodes: FNode[]; edges: Edge[] }

const TPL_KEY = 'airoom_templates'
const loadTemplates = (): Template[] => {
  try { return JSON.parse(localStorage.getItem(TPL_KEY) || '[]') } catch { return [] }
}
const saveTemplates = (t: Template[]) => localStorage.setItem(TPL_KEY, JSON.stringify(t))

const portType = (nodeType: string, handleId: string | null | undefined, dir: 'in' | 'out'): PortType | null => {
  const def = NODE_DEFS[nodeType]
  if (!def || !handleId) return null
  const list = dir === 'in' ? def.inputs : def.outputs
  return list.find((p) => p.id === handleId)?.type ?? null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

let idCounter = 1
const newId = () => `n${idCounter++}`

interface State {
  nodes: FNode[]
  edges: Edge[]
  balance: number
  selectedId: string | null
  running: boolean
  files: BatchFile[]
  past: Snapshot[]
  future: Snapshot[]
  templates: Template[]

  onNodesChange: (c: NodeChange[]) => void
  onEdgesChange: (c: EdgeChange[]) => void
  onConnect: (c: Connection) => void
  isValidConnection: (c: Connection | Edge) => boolean
  addNode: (type: string, position: { x: number; y: number }) => void
  removeSelected: () => void
  setSelected: (id: string | null) => void
  setParam: (id: string, key: string, value: string) => void
  graphCost: () => number

  // history
  snapshot: () => void
  undo: () => void
  redo: () => void
  // toolbar
  clearCanvas: () => void
  autoLayout: () => void
  // templates
  saveTemplate: (name: string) => void
  loadTemplate: (id: string) => void
  deleteTemplate: (id: string) => void
  // batch
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void

  run: () => Promise<void>
}

const seedNodes: FNode[] = [
  { id: newId(), type: 'flow', position: { x: 40, y: 160 }, data: { type: 'upload', status: 'idle', params: {} } },
  { id: newId(), type: 'flow', position: { x: 340, y: 160 }, data: { type: 'removebg', status: 'idle', params: {} } },
  { id: newId(), type: 'flow', position: { x: 640, y: 120 }, data: { type: 'genbg', status: 'idle', params: { style: 'Студия', strength: '70' } } },
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
  files: [],
  past: [],
  future: [],
  templates: loadTemplates(),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as FNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  isValidConnection: (c) => {
    const { nodes, edges } = get()
    if (!c.source || !c.target || c.source === c.target) return false
    const src = nodes.find((n) => n.id === c.source)
    const tgt = nodes.find((n) => n.id === c.target)
    if (!src || !tgt) return false
    const st = portType(src.data.type, c.sourceHandle, 'out')
    const tt = portType(tgt.data.type, c.targetHandle, 'in')
    if (!st || !tt || st !== tt) return false
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
    get().snapshot()
    const cleaned = get().edges.filter((e) => !(e.target === c.target && e.targetHandle === c.targetHandle))
    set({ edges: addEdge({ ...c, type: 'flow' }, cleaned) })
  },

  addNode: (type, position) => {
    get().snapshot()
    set((s) => ({
      nodes: [...s.nodes, { id: newId(), type: 'flow', position, data: { type, status: 'idle', params: {} } }],
    }))
  },

  removeSelected: () => {
    const { selectedId } = get()
    if (!selectedId) return
    get().snapshot()
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== selectedId),
      edges: s.edges.filter((e) => e.source !== selectedId && e.target !== selectedId),
      selectedId: null,
    }))
  },

  setSelected: (id) => set({ selectedId: id }),

  setParam: (id, key, value) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, params: { ...n.data.params, [key]: value } } } : n,
      ),
    })),

  graphCost: () => get().nodes.reduce((sum, n) => sum + (NODE_DEFS[n.data.type]?.cost ?? 0), 0),

  /* ── history ── */
  snapshot: () =>
    set((s) => ({ past: [...s.past.slice(-49), { nodes: s.nodes, edges: s.edges }], future: [] })),
  undo: () =>
    set((s) => {
      if (!s.past.length) return s
      const prev = s.past[s.past.length - 1]
      return {
        past: s.past.slice(0, -1),
        future: [{ nodes: s.nodes, edges: s.edges }, ...s.future],
        nodes: prev.nodes,
        edges: prev.edges,
        selectedId: null,
      }
    }),
  redo: () =>
    set((s) => {
      if (!s.future.length) return s
      const next = s.future[0]
      return {
        future: s.future.slice(1),
        past: [...s.past, { nodes: s.nodes, edges: s.edges }],
        nodes: next.nodes,
        edges: next.edges,
        selectedId: null,
      }
    }),

  clearCanvas: () => {
    if (!get().nodes.length) return
    get().snapshot()
    set({ nodes: [], edges: [], selectedId: null })
  },

  autoLayout: () => {
    const { nodes, edges } = get()
    if (!nodes.length) return
    get().snapshot()
    // глубина = длина пути от источника
    const depth = new Map<string, number>()
    const indeg = new Map(nodes.map((n) => [n.id, 0]))
    edges.forEach((e) => indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1))
    const queue = nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id)
    queue.forEach((id) => depth.set(id, 0))
    const q = [...queue]
    while (q.length) {
      const id = q.shift()!
      const d = depth.get(id) ?? 0
      edges.filter((e) => e.source === id).forEach((e) => {
        depth.set(e.target, Math.max(depth.get(e.target) ?? 0, d + 1))
        const left = (indeg.get(e.target) ?? 1) - 1
        indeg.set(e.target, left)
        if (left === 0) q.push(e.target)
      })
    }
    const colCount: Record<number, number> = {}
    set({
      nodes: nodes.map((n) => {
        const d = depth.get(n.id) ?? 0
        const row = colCount[d] ?? 0
        colCount[d] = row + 1
        return { ...n, position: { x: 60 + d * 300, y: 80 + row * 180 } }
      }),
    })
  },

  /* ── templates ── */
  saveTemplate: (name) =>
    set((s) => {
      const tpl: Template = { id: uid(), name, nodes: s.nodes, edges: s.edges }
      const list = [...s.templates, tpl]
      saveTemplates(list)
      return { templates: list }
    }),
  loadTemplate: (id) => {
    const tpl = get().templates.find((t) => t.id === id)
    if (!tpl) return
    get().snapshot()
    set({
      nodes: tpl.nodes.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })),
      edges: tpl.edges,
      selectedId: null,
    })
  },
  deleteTemplate: (id) =>
    set((s) => {
      const list = s.templates.filter((t) => t.id !== id)
      saveTemplates(list)
      return { templates: list }
    }),

  /* ── batch files ── */
  addFiles: (files) =>
    set((s) => ({
      files: [
        ...s.files,
        ...Array.from(files).map((f) => ({
          id: uid(),
          name: f.name,
          url: URL.createObjectURL(f),
          status: 'idle' as NodeStatus,
          progress: 0,
          current: '',
        })),
      ],
    })),
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  run: async () => {
    const { running, nodes, edges, graphCost, balance, files } = get()
    if (running || nodes.length === 0) return
    const targets = files.length ? files.map((f) => f.id) : [null]
    if (balance < graphCost() * targets.length) return

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

    const setStatus = (id: string, status: NodeStatus) =>
      set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, status } } : n)) }))
    const setEdgesActive = (targetId: string | null) =>
      set((s) => ({ edges: s.edges.map((e) => ({ ...e, animated: e.target === targetId, data: { ...e.data, active: e.target === targetId } })) }))
    const setFile = (fid: string, patch: Partial<BatchFile>) =>
      set((s) => ({ files: s.files.map((f) => (f.id === fid ? { ...f, ...patch } : f)) }))

    set({ running: true })

    for (const fid of targets) {
      if (fid) setFile(fid, { status: 'processing', progress: 0, current: 'Старт…' })
      // сброс статусов узлов перед каждым файлом
      set((s) => ({ nodes: s.nodes.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })) }))

      for (let i = 0; i < order.length; i++) {
        const id = order[i]
        const def = NODE_DEFS[get().nodes.find((n) => n.id === id)!.data.type]
        setStatus(id, 'processing')
        setEdgesActive(id)
        if (fid) setFile(fid, { current: `${def.label}…`, progress: i / order.length })
        await sleep(700 + def.cost * 250)
        setStatus(id, 'done')
        if (def.cost > 0) set((s) => ({ balance: s.balance - def.cost }))
        if (fid) setFile(fid, { progress: (i + 1) / order.length })
      }

      setEdgesActive(null)
      if (fid) setFile(fid, { status: 'done', progress: 1, current: 'Готово' })
    }

    set({ running: false })
  },
}))
