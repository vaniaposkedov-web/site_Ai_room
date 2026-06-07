import { create } from 'zustand'

/* ─────────────────────────────────
   Данные товара (проходят через визард)
───────────────────────────────── */
export interface ProductData {
  originalImage: string | null   // DataURL загруженного фото
  processedImage: string | null  // фото без фона
  finalImage: string | null      // фото с сгенерированным фоном
  category: string
  title: string
  features: string[]
}

/* настройки инфографики (шаг 3) */
export interface Design {
  color: string
  fontSize: number
  positions: Record<string, { x: number; y: number }> // в % от контейнера
}

interface WizardState {
  step: number
  balance: number
  productData: ProductData
  design: Design
  toast: string | null

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateProductData: (data: Partial<ProductData>) => void
  deductBalance: (amount: number) => void
  topUp: (amount: number) => void
  setToast: (msg: string | null) => void
  setDesign: (d: Partial<Design>) => void
  setPosition: (id: string, pos: { x: number; y: number }) => void
}

const emptyProduct: ProductData = {
  originalImage: null,
  processedImage: null,
  finalImage: null,
  category: '',
  title: '',
  features: ['', '', ''],
}

export const useWizard = create<WizardState>((set) => ({
  step: 1,
  balance: 146,
  productData: emptyProduct,
  design: { color: '#FFFFFF', fontSize: 20, positions: {} },
  toast: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  updateProductData: (data) => set((s) => ({ productData: { ...s.productData, ...data } })),
  deductBalance: (amount) => set((s) => ({ balance: s.balance - amount })),
  topUp: (amount) => set((s) => ({ balance: s.balance + amount })),
  setToast: (msg) => set({ toast: msg }),
  setDesign: (d) => set((s) => ({ design: { ...s.design, ...d } })),
  setPosition: (id, pos) => set((s) => ({ design: { ...s.design, positions: { ...s.design.positions, [id]: pos } } })),
}))
