import type { LucideIcon } from 'lucide-react'
import { Upload, Eraser, Wand2, Maximize2, Brush, LayoutGrid, Type, Image as ImageIcon } from 'lucide-react'

/* ─────────────────────────────────
   Биллинг
───────────────────────────────── */
export const STAR_TO_RUB = 2 // 1 ⭐ = 2 ₽
export const START_BALANCE = 150

/* ─────────────────────────────────
   Типы портов (цвет = тип данных)
───────────────────────────────── */
export type PortType = 'image' | 'mask' | 'text'

export const PORT_COLORS: Record<PortType, string> = {
  image: '#FFE135', // жёлтый — картинка
  mask: '#60A5FA',  // синий — маска
  text: '#4ADE80',  // зелёный — текст
}

export const PORT_LABELS: Record<PortType, string> = {
  image: 'Картинка',
  mask: 'Маска',
  text: 'Текст',
}

export interface Port {
  id: string
  type: PortType
  label: string
  required?: boolean
}

export interface ParamDef {
  key: string
  label: string
  kind: 'text' | 'select'
  options?: string[]
  placeholder?: string
}

export interface NodeDef {
  type: string
  label: string
  cost: number
  icon: LucideIcon
  category: string
  description: string
  inputs: Port[]
  outputs: Port[]
  params?: ParamDef[]
}

/* ─────────────────────────────────
   Каталог нодов
───────────────────────────────── */
export const NODE_DEFS: Record<string, NodeDef> = {
  upload: {
    type: 'upload',
    label: 'Загрузка фото',
    cost: 0,
    icon: Upload,
    category: 'Источник',
    description: 'Исходное фото товара. Точка входа для всей цепочки.',
    inputs: [],
    outputs: [{ id: 'image', type: 'image', label: 'Картинка' }],
  },
  removebg: {
    type: 'removebg',
    label: 'Удаление фона',
    cost: 1,
    icon: Eraser,
    category: 'Обработка',
    description: 'Отделяет товар от фона и возвращает картинку + маску.',
    inputs: [{ id: 'image', type: 'image', label: 'Картинка', required: true }],
    outputs: [
      { id: 'image', type: 'image', label: 'Картинка' },
      { id: 'mask', type: 'mask', label: 'Маска' },
    ],
  },
  genbg: {
    type: 'genbg',
    label: 'Генерация фона (SD)',
    cost: 3,
    icon: Wand2,
    category: 'Нейросеть',
    description: 'Stable Diffusion подставляет новый студийный/lifestyle фон.',
    inputs: [
      { id: 'image', type: 'image', label: 'Картинка', required: true },
      { id: 'prompt', type: 'text', label: 'Промпт' },
    ],
    outputs: [{ id: 'image', type: 'image', label: 'Картинка' }],
    params: [
      { key: 'prompt', label: 'Сцена', kind: 'text', placeholder: 'студия, мягкий свет…' },
      { key: 'style', label: 'Стиль', kind: 'select', options: ['Студия', 'Интерьер', 'Lifestyle', 'Минимализм'] },
    ],
  },
  upscale: {
    type: 'upscale',
    label: 'Апскейл 4K',
    cost: 2,
    icon: Maximize2,
    category: 'Обработка',
    description: 'Повышает разрешение и детализацию до 4K.',
    inputs: [{ id: 'image', type: 'image', label: 'Картинка', required: true }],
    outputs: [{ id: 'image', type: 'image', label: 'Картинка' }],
    params: [{ key: 'factor', label: 'Множитель', kind: 'select', options: ['×2', '×4'] }],
  },
  retouch: {
    type: 'retouch',
    label: 'Ретушь',
    cost: 2,
    icon: Brush,
    category: 'Нейросеть',
    description: 'Убирает дефекты, выравнивает свет и цвет.',
    inputs: [{ id: 'image', type: 'image', label: 'Картинка', required: true }],
    outputs: [{ id: 'image', type: 'image', label: 'Картинка' }],
  },
  infographic: {
    type: 'infographic',
    label: 'Инфографика',
    cost: 1,
    icon: LayoutGrid,
    category: 'Обработка',
    description: 'Выносит преимущества и характеристики прямо на фото.',
    inputs: [
      { id: 'image', type: 'image', label: 'Картинка', required: true },
      { id: 'text', type: 'text', label: 'Текст' },
    ],
    outputs: [{ id: 'image', type: 'image', label: 'Картинка' }],
  },
  text: {
    type: 'text',
    label: 'Текст / Описание',
    cost: 0,
    icon: Type,
    category: 'Клиент',
    description: 'Текстовый блок — отрабатывает на клиенте, бесплатно.',
    inputs: [],
    outputs: [{ id: 'text', type: 'text', label: 'Текст' }],
    params: [{ key: 'content', label: 'Содержимое', kind: 'text', placeholder: 'Преимущества товара…' }],
  },
  output: {
    type: 'output',
    label: 'Готовая карточка',
    cost: 0,
    icon: ImageIcon,
    category: 'Результат',
    description: 'Финальный результат пайплайна — карточка для маркетплейса.',
    inputs: [{ id: 'image', type: 'image', label: 'Картинка', required: true }],
    outputs: [],
  },
}

export const NODE_LIST = Object.values(NODE_DEFS)

export type NodeStatus = 'idle' | 'processing' | 'done' | 'error'

export interface FlowNodeData {
  type: string
  status: NodeStatus
  params: Record<string, string>
  [key: string]: unknown
}
