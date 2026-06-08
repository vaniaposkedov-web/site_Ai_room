import { create } from 'zustand'
import type { ProductSpec } from '@/lib/ai'

export type Format = '9:16' | '3:4' | '1:1' | '4:3' | '4:5' | '16:9'
export type Resolution = '1k' | '2k' | '4k'
export type StyleMode = 'copy' | 'inspire'

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
}))
