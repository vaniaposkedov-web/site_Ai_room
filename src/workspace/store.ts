import { create } from 'zustand'

/* ─────────────────────────────────
   Данные товара
───────────────────────────────── */
export interface ProductData {
  images: string[]          // до 4 ракурсов (DataURL)
  selectedImageIndex: number
  category: string
  title: string
  features: string[]
}

export type GenMode = 'interior' | 'studio' | 'person' | 'custom'

export interface GenerationSettings {
  mode: GenMode
  prompt: string
  aspectRatio: '3:4' | '1:1' | '16:9'
  lighting: 'auto' | 'left' | 'right' | 'top'
  negativePrompt: string
}

export interface ItemStyle { color: string; fontSize: number }

export interface Design {
  positions: Record<string, { x: number; y: number }>
  styles: Record<string, Partial<ItemStyle>>
}

export const defaultStyle = (id: string): ItemStyle => ({ color: '#FFFFFF', fontSize: id === 'title' ? 26 : 17 })

interface State {
  step: number
  balance: number
  productData: ProductData
  generationSettings: GenerationSettings
  generatedResults: string[]
  selectedResult: string | null
  design: Design
  toast: string | null

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  updateProductData: (data: Partial<ProductData>) => void
  addImage: (url: string) => void
  removeImage: (index: number) => void
  setSelectedImageIndex: (index: number) => void

  setGenSettings: (data: Partial<GenerationSettings>) => void
  setGeneratedResults: (urls: string[]) => void
  setSelectedResult: (url: string | null) => void

  deductBalance: (amount: number) => void
  topUp: (amount: number) => void
  setToast: (msg: string | null) => void

  setPosition: (id: string, pos: { x: number; y: number }) => void
  setStyle: (id: string, s: Partial<ItemStyle>) => void
}

const emptyProduct: ProductData = {
  images: [],
  selectedImageIndex: 0,
  category: '',
  title: '',
  features: ['', '', ''],
}

const defaultSettings: GenerationSettings = {
  mode: 'studio',
  prompt: '',
  aspectRatio: '3:4',
  lighting: 'auto',
  negativePrompt: '',
}

export const useWizard = create<State>((set) => ({
  step: 1,
  balance: 146,
  productData: emptyProduct,
  generationSettings: defaultSettings,
  generatedResults: [],
  selectedResult: null,
  design: { positions: {}, styles: {} },
  toast: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  updateProductData: (data) => set((s) => ({ productData: { ...s.productData, ...data } })),
  addImage: (url) =>
    set((s) => {
      if (s.productData.images.length >= 4) return s
      return { productData: { ...s.productData, images: [...s.productData.images, url] } }
    }),
  removeImage: (index) =>
    set((s) => {
      const images = s.productData.images.filter((_, i) => i !== index)
      const selectedImageIndex = Math.max(0, Math.min(s.productData.selectedImageIndex, images.length - 1))
      return { productData: { ...s.productData, images, selectedImageIndex } }
    }),
  setSelectedImageIndex: (index) => set((s) => ({ productData: { ...s.productData, selectedImageIndex: index } })),

  setGenSettings: (data) => set((s) => ({ generationSettings: { ...s.generationSettings, ...data } })),
  setGeneratedResults: (urls) => set({ generatedResults: urls }),
  setSelectedResult: (url) => set({ selectedResult: url }),

  deductBalance: (amount) => set((s) => ({ balance: s.balance - amount })),
  topUp: (amount) => set((s) => ({ balance: s.balance + amount })),
  setToast: (msg) => set({ toast: msg }),

  setPosition: (id, pos) => set((s) => ({ design: { ...s.design, positions: { ...s.design.positions, [id]: pos } } })),
  setStyle: (id, st) => set((s) => ({ design: { ...s.design, styles: { ...s.design.styles, [id]: { ...s.design.styles[id], ...st } } } })),
}))
