import type { LucideIcon } from 'lucide-react'
import {
  LayoutTemplate, Package, UserRound, MessageSquareText, Clapperboard, Scan,
  Sparkles, Wand2, BarChart2, PenTool,
} from 'lucide-react'
import { loadSettings } from './settings'

export interface GenCtx {
  type: string
  category: string
  specs: { label: string; value: string }[]
  text: string
  format: string
  styleMode: 'copy' | 'inspire'
  hasRef: boolean
}

export interface ToolDef {
  id: string
  num: string
  name: string
  tag: string
  icon: LucideIcon
  desc: string
  kind: 'image' | 'text'
  needsRef?: boolean
  defaultTemplate: string
  defaultSystem?: string
}

const IMG_BASE = 'Первое изображение — фото товара пользователя ({type}). {ref}Соотношение сторон кадра {format}. Высокое качество, фотореализм, без артефактов.'

export const TOOLS: ToolDef[] = [
  { id: 'tool-1', num: '01', name: 'Инфографика', tag: 'Маркетплейс', icon: LayoutTemplate, kind: 'image', needsRef: true, desc: 'Выносим ключевые характеристики прямо на фото товара. Размеры, состав, преимущества — всё в одном кадре.',
    defaultTemplate: `${IMG_BASE} Создай продающую карточку-инфографику для маркетплейса (Wildberries/Ozon): размести товар крупно и аккуратно вынеси текстом НА РУССКОМ преимущества: {advantages}. Чистый профессиональный фон, читаемая современная типографика, акцентный жёлтый цвет.` },
  { id: 'tool-2', num: '02', name: 'Полная карточка товара', tag: 'Полный пакет', icon: Package, kind: 'image', needsRef: true, desc: 'Фото + фон + инфографика + SEO-описание. Готовая карточка под стандарты WB и Ozon за один запрос.',
    defaultTemplate: `${IMG_BASE} Собери готовую продающую обложку карточки: студийный фон, товар в центре, заголовок и преимущества НА РУССКОМ: {advantages}. Премиальный вид, маркетплейс-стандарт.` },
  { id: 'tool-3', num: '03', name: 'ИИ-фотомодель', tag: 'AI Studio', icon: UserRound, kind: 'image', desc: 'Нейросеть одевает вашу одежду на профессиональную модель. Без съёмки, без студии — готово за секунды.',
    defaultTemplate: `${IMG_BASE} Надень товар (одежду/аксессуар с фото) на профессиональную привлекательную модель в полный рост, естественная поза, студийный свет, чистый фон.` },
  { id: 'tool-4', num: '04', name: 'GPT-описание', tag: 'Текст', icon: MessageSquareText, kind: 'text', desc: 'AI пишет продающий заголовок и текст с SEO-ключами под маркетплейс. Ваш товар находят — и покупают.',
    defaultSystem: 'Ты SEO-копирайтер маркетплейсов. Напиши на русском: продающий заголовок (до 80 симв) и описание (3-4 абзаца) с ключевыми словами. Без markdown.',
    defaultTemplate: 'Товар: {type} (категория {category}). Характеристики: {specs}. Преимущества: {advantages}.' },
  { id: 'tool-5', num: '05', name: 'Видео-анимация', tag: 'Видео', icon: Clapperboard, kind: 'image', desc: 'Превращаем фото товара в короткое видео или анимацию. Идеально для Stories, Reels и видеообложек на WB.',
    defaultTemplate: `${IMG_BASE} Сделай эффектный динамичный кадр-обложку для видео: товар в движении, кинематографический свет, размытие фона, ощущение анимации.` },
  { id: 'tool-6', num: '06', name: 'Белый фон', tag: 'Обработка', icon: Scan, kind: 'image', desc: 'Удаляем фон, выравниваем свет и готовим чистое студийное фото под требования маркетплейса. ~15 сек на фото.',
    defaultTemplate: `${IMG_BASE} Удали фон и размести товар на идеально чистом белом студийном фоне (#FFFFFF) с мягкой естественной тенью. Ровный свет, без бликов.` },
  { id: 'tool-7', num: '07', name: 'Обычная генерация', tag: 'Генерация', icon: Sparkles, kind: 'image', desc: 'Создаём фото товара с нуля по описанию или референсу. Lifestyle-сцены, студийный свет, любые фоны.',
    defaultTemplate: `${IMG_BASE} Сгенерируй профессиональное фото товара в красивой сцене: {text}. Lifestyle, студийный свет, премиальный фон.` },
  { id: 'tool-8', num: '08', name: 'Фото-эффекты', tag: 'Эффекты', icon: Wand2, kind: 'image', desc: 'Глубина резкости, световые блики, отражения, дымка и другие кинематографические эффекты на фото товара.',
    defaultTemplate: `${IMG_BASE} Добавь кинематографические эффекты к фото товара: мягкая глубина резкости, световые блики, лёгкие отражения и дымка. Товар чёткий, премиальный вид.` },
  { id: 'tool-9', num: '09', name: 'Тренды и конкуренты', tag: 'Аналитика', icon: BarChart2, kind: 'text', desc: 'Анализируем тренды фотографии в вашей нише на Wildberries и Ozon. Смотрим что делают конкуренты — делаем лучше.',
    defaultSystem: 'Ты аналитик маркетплейсов. Дай краткий разбор на русском: 5 трендов фотографии в нише и 3 совета, как выделиться. Без markdown, простой список.',
    defaultTemplate: 'Ниша/товар: {type} ({category}). Преимущества: {advantages}.' },
  { id: 'tool-10', num: '10', name: 'Создание логотипа', tag: 'Брендинг', icon: PenTool, kind: 'image', desc: 'Разрабатываем логотип и фирменный стиль для вашего магазина на маркетплейсе. Уникально, без шаблонов.',
    defaultTemplate: 'Создай современный минималистичный логотип для магазина на маркетплейсе (товар: {type}). Чистый фон, векторный стиль, лаконично, уникально. Соотношение {format}.' },
]

export const getTool = (id: string): ToolDef => TOOLS.find((t) => t.id === id) ?? TOOLS[0]

const adv = (c: GenCtx) => (c.text ? c.text.split('\n').map((l) => l.replace(/^[✦•\-\s]+/, '').trim()).filter(Boolean) : [])

function fill(tpl: string, c: GenCtx): string {
  return tpl
    .replace(/\{type\}/g, c.type || c.category || 'товар')
    .replace(/\{category\}/g, c.category || '')
    .replace(/\{advantages\}/g, adv(c).join('; ') || 'ключевые преимущества')
    .replace(/\{specs\}/g, c.specs.map((s) => `${s.label}: ${s.value}`).join(', ') || '—')
    .replace(/\{text\}/g, c.text || 'студийный свет, премиальный фон')
    .replace(/\{format\}/g, c.format)
    .replace(/\{ref\}/g, c.hasRef ? 'Второе изображение — дизайн-референс: повтори его композицию, цвета и расположение текста. ' : '')
}

export const getTemplate = (toolId: string): string => loadSettings().promptOverrides[toolId] || getTool(toolId).defaultTemplate
export const getSystem = (toolId: string): string => loadSettings().systemOverrides[toolId] || getTool(toolId).defaultSystem || ''
export const buildPrompt = (toolId: string, c: GenCtx): string => fill(getTemplate(toolId), c)
export const buildSystem = (toolId: string): string => getSystem(toolId)
