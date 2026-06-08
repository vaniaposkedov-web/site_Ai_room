import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutTemplate, Package, UserRound, MessageSquareText, Clapperboard, Scan,
  Sparkles, Wand2, BarChart2, PenTool, Check, X, ArrowRight, LayoutGrid,
} from 'lucide-react'
import WorkNav from '@/workspace/WorkNav'
import { useStudio } from '@/workspace/studioStore'

const GRID_BG = {
  backgroundColor: '#1c1c1c',
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
}

const TOOLS = [
  { id: 'tool-1', num: '01', name: 'Инфографика', tag: 'Маркетплейс', icon: LayoutTemplate, desc: 'Выносим ключевые характеристики прямо на фото товара. Размеры, состав, преимущества — всё в одном кадре.' },
  { id: 'tool-2', num: '02', name: 'Полная карточка товара', tag: 'Полный пакет', icon: Package, desc: 'Фото + фон + инфографика + SEO-описание. Готовая карточка под стандарты WB и Ozon за один запрос.' },
  { id: 'tool-3', num: '03', name: 'ИИ-фотомодель', tag: 'AI Studio', icon: UserRound, desc: 'Нейросеть одевает вашу одежду на профессиональную модель. Без съёмки, без студии — готово за секунды.' },
  { id: 'tool-4', num: '04', name: 'GPT-описание', tag: 'Текст', icon: MessageSquareText, desc: 'AI пишет продающий заголовок и текст с SEO-ключами под маркетплейс. Ваш товар находят — и покупают.' },
  { id: 'tool-5', num: '05', name: 'Видео-анимация', tag: 'Видео', icon: Clapperboard, desc: 'Превращаем фото товара в короткое видео или анимацию. Идеально для Stories, Reels и видеообложек на WB.' },
  { id: 'tool-6', num: '06', name: 'Белый фон', tag: 'Обработка', icon: Scan, desc: 'Удаляем фон, выравниваем свет и готовим чистое студийное фото под требования маркетплейса. ~15 сек на фото.' },
  { id: 'tool-7', num: '07', name: 'Обычная генерация', tag: 'Генерация', icon: Sparkles, desc: 'Создаём фото товара с нуля по описанию или референсу. Lifestyle-сцены, студийный свет, любые фоны.' },
  { id: 'tool-8', num: '08', name: 'Фото-эффекты', tag: 'Эффекты', icon: Wand2, desc: 'Глубина резкости, световые блики, отражения, дымка и другие кинематографические эффекты на фото товара.' },
  { id: 'tool-9', num: '09', name: 'Тренды и конкуренты', tag: 'Аналитика', icon: BarChart2, desc: 'Анализируем тренды фотографии в вашей нише на Wildberries и Ozon. Смотрим что делают конкуренты — делаем лучше.' },
  { id: 'tool-10', num: '10', name: 'Создание логотипа', tag: 'Брендинг', icon: PenTool, desc: 'Разрабатываем логотип и фирменный стиль для вашего магазина на маркетплейсе. Уникально, без шаблонов.' },
]

function plural(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'инструмент'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'инструмента'
  return 'инструментов'
}

export default function ToolSelect() {
  const navigate = useNavigate()
  const selected = useStudio((s) => s.selectedTools)
  const toggleTool = useStudio((s) => s.toggleTool)
  const resetTools = useStudio((s) => s.resetTools)
  const [initing, setIniting] = useState(false)

  const has = selected.length > 0

  const onContinue = () => {
    setIniting(true)
    setTimeout(() => navigate('/app/create'), 1800)
  }

  return (
    <div className="min-h-screen text-white font-['Onest']" style={GRID_BG}>
      <WorkNav />

      {/* glow */}
      <div className="pointer-events-none absolute top-[10%] -left-40 w-[500px] h-[500px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(245,200,0,0.05), transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-48">
        {/* header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[11px] tracking-[0.1em] text-white/55">
            <LayoutGrid size={14} className="text-[#F5C800]" /> ВЫБЕРИТЕ ИНСТРУМЕНТ
          </span>
          <h1 className="font-['Unbounded'] font-bold text-4xl sm:text-5xl tracking-tight mt-5">Что будем создавать?</h1>
          <p className="text-white/55 mt-3.5 max-w-md mx-auto leading-relaxed">Выберите один или несколько инструментов — мы соберём карточку под ваш товар</p>
        </div>

        {/* cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {TOOLS.map((t) => {
            const Icon = t.icon
            const on = selected.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggleTool(t.id)}
                className="relative text-left rounded-2xl border p-6 transition-all hover:-translate-y-1"
                style={{
                  background: on ? 'rgba(245,200,0,0.06)' : '#242424',
                  borderColor: on ? '#F5C800' : 'rgba(255,255,255,0.08)',
                  boxShadow: on ? '0 0 0 1px rgba(245,200,0,0.25)' : 'none',
                }}
              >
                <span className="absolute right-4 top-3 font-['Unbounded'] text-[11px] font-bold text-white/20">{t.num}</span>
                <span className="absolute top-5 right-5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: on ? '#F5C800' : 'rgba(255,255,255,0.08)', background: on ? '#F5C800' : 'transparent', opacity: on ? 1 : 0 }}>
                  <Check size={12} className="text-[#111]" strokeWidth={3} />
                </span>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5" style={{ background: on ? 'rgba(245,200,0,0.14)' : 'rgba(245,200,0,0.06)' }}>
                  <Icon size={22} className="text-[#F5C800]" />
                </div>
                <div className="font-['Unbounded'] font-bold text-[15px] leading-tight pr-6">{t.name}</div>
                <span className="inline-block mt-2.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: on ? 'rgba(245,200,0,0.15)' : 'rgba(255,255,255,0.04)', color: on ? '#F5C800' : 'rgba(255,255,255,0.55)' }}>
                  {t.tag}
                </span>
                <p className="text-[13.5px] text-white/55 leading-relaxed mt-3">{t.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* bottom bar */}
      <AnimatePresence>
        {has && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="fixed bottom-0 inset-x-0 z-[500] bg-[#1c1c1c]/92 backdrop-blur-xl border-t border-white/[0.08] px-4 sm:px-8 py-4"
          >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4 w-full overflow-hidden">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[13px] text-white/55">Выбрано:</span>
                  <span className="font-['Unbounded'] font-bold text-[15px] text-[#F5C800]">{selected.length} {plural(selected.length)}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {selected.map((id) => {
                    const t = TOOLS.find((x) => x.id === id)!
                    return (
                      <button key={id} onClick={() => toggleTool(id)} className="flex items-center gap-1.5 rounded-full border border-[#F5C800]/25 bg-[#F5C800]/[0.12] text-[#F5C800] text-xs px-3 py-1.5 whitespace-nowrap hover:bg-[#F5C800]/20 transition-colors">
                        {t.name} <X size={12} />
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button onClick={resetTools} className="flex-1 sm:flex-none rounded-xl border border-white/10 px-5 py-3 text-sm text-white/55 hover:text-white hover:border-white/20 transition-colors">Сбросить</button>
                <button onClick={onContinue} className="flex-[2] sm:flex-none flex items-center justify-center gap-2.5 rounded-xl bg-[#F5C800] text-[#111] font-['Unbounded'] font-bold text-sm px-7 py-3.5 hover:bg-[#e0b400] transition-colors">
                  Продолжить <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* init modal */}
      <AnimatePresence>
        {initing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-[#121212]/96 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center max-w-md px-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-[3px] border-white/[0.06] border-t-[#F5C800] animate-spin" />
              <h3 className="font-['Unbounded'] font-bold text-xl mb-3">Инициализация AIROOM</h3>
              <p className="text-white/55 text-sm leading-relaxed">ИИ настраивает рабочее окружение под выбранные инструменты. Это займёт пару мгновений…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
