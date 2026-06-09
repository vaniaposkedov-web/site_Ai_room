import { create } from 'zustand'
import type { ProductSpec } from '@/lib/ai'

export type Format = '9:16' | '3:4' | '1:1' | '4:3' | '4:5' | '16:9'
export type Resolution = '1k' | '2k' | '4k'
export type StyleMode = 'copy' | 'inspire'

export interface GenItem {
  id: string
  toolId: string
  toolName: string
  kind: 'image' | 'text'
  image?: string
  text?: string
  liked: boolean
  ts: number
}
export interface Stats { total: number; byTool: Record<string, number>; liked: number }

const STATS_KEY = 'airoom_stats'
const loadStats = (): Stats => {
  try { return { total: 0, byTool: {}, liked: 0, ...JSON.parse(localStorage.getItem(STATS_KEY) || '{}') } } catch { return { total: 0, byTool: {}, liked: 0 } }
}
const saveStats = (s: Stats) => localStorage.setItem(STATS_KEY, JSON.stringify(s))
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

interface StudioState {
  // billing
  balance: number
  deductBalance: (n: number) => void
  topUp: (n: number) => void
  toast: { text: string; icon?: string } | null
  setToast: (t: { text: string; icon?: string } | null) => void

  // tool selection (select page) — одна категория
  tool: string
  setTool: (id: string) => void

  // editor (infographics)
  productImage: string | null
  refImage: string | null
  styleMode: StyleMode
  category: string
  type: string
  specs: ProductSpec[]
  infographicText: string
  format: Format
  resolution: Resolution
  resultImage: string | null

  setProductImage: (v: string | null) => void
  setRefImage: (v: string | null) => void
  setStyleMode: (m: StyleMode) => void
  setCategory: (v: string) => void
  setType: (v: string) => void
  setSpecs: (s: ProductSpec[]) => void
  updateSpec: (i: number, patch: Partial<ProductSpec>) => void
  setInfographicText: (v: string) => void
  setFormat: (f: Format) => void
  setResolution: (r: Resolution) => void
  setResultImage: (v: string | null) => void
  resetEditor: () => void

  // история и статистика
  history: GenItem[]
  stats: Stats
  addGeneration: (g: { toolId: string; toolName: string; kind: 'image' | 'text'; image?: string; text?: string }) => string
  toggleLike: (id: string) => void
}

export const useStudio = create<StudioState>((set) => ({
  balance: 146,
  deductBalance: (n) => set((s) => ({ balance: s.balance - n })),
  topUp: (n) => set((s) => ({ balance: s.balance + n })),
  toast: null,
  setToast: (t) => set({ toast: t }),

  tool: 'tool-1',
  setTool: (id) => set({ tool: id }),

  productImage: null,
  refImage: null,
  styleMode: 'inspire',
  category: '',
  type: '',
  specs: [],
  infographicText: '',
  format: '3:4',
  resolution: '2k',
  resultImage: null,

  setProductImage: (v) => set({ productImage: v }),
  setRefImage: (v) => set({ refImage: v }),
  setStyleMode: (m) => set({ styleMode: m }),
  setCategory: (v) => set({ category: v }),
  setType: (v) => set({ type: v }),
  setSpecs: (s) => set({ specs: s }),
  updateSpec: (i, patch) => set((st) => ({ specs: st.specs.map((sp, idx) => (idx === i ? { ...sp, ...patch } : sp)) })),
  setInfographicText: (v) => set({ infographicText: v }),
  setFormat: (f) => set({ format: f }),
  setResolution: (r) => set({ resolution: r }),
  setResultImage: (v) => set({ resultImage: v }),
  resetEditor: () =>
    set({ productImage: null, refImage: null, category: '', type: '', specs: [], infographicText: '', resultImage: null }),

  history: [],
  stats: loadStats(),
  addGeneration: (g) => {
    const id = uid()
    set((s) => {
      const byTool = { ...s.stats.byTool, [g.toolId]: (s.stats.byTool[g.toolId] ?? 0) + 1 }
      const stats: Stats = { total: s.stats.total + 1, byTool, liked: s.stats.liked }
      saveStats(stats)
      return { history: [{ id, ...g, liked: false, ts: Date.now() }, ...s.history].slice(0, 40), stats }
    })
    return id
  },
  toggleLike: (id) =>
    set((s) => {
      const history = s.history.map((h) => (h.id === id ? { ...h, liked: !h.liked } : h))
      const delta = history.find((h) => h.id === id)?.liked ? 1 : -1
      const stats: Stats = { ...s.stats, liked: Math.max(0, s.stats.liked + delta) }
      saveStats(stats)
      return { history, stats }
    }),
}))
