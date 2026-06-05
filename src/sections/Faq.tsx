import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle } from 'lucide-react'

/* ─────────────────────────────────
   FAQ data
───────────────────────────────── */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Для каких маркетплейсов подходят карточки?',
    a: 'Wildberries, Ozon, Яндекс.Маркет, Lamoda и другие. Мы автоматически подгоняем кадр, фон и формат под требования каждой площадки.',
  },
  {
    q: 'Нужно ли уметь фотографировать?',
    a: 'Нет. Достаточно обычного фото товара с телефона — со стола, с вешалки или на любом фоне. Нейросеть сама очистит фон, выровняет свет и соберёт студийный кадр.',
  },
  {
    q: 'Сколько занимает обработка одного фото?',
    a: 'В среднем 15–30 секунд на фото. Пакет из десятков карточек собирается за несколько минут — без фотографа и студии.',
  },
  {
    q: 'Можно ли отредактировать результат?',
    a: 'Да. Вы можете поменять концепцию, фон, состав инфографики и текст описания, а также перегенерировать любой кадр — пока результат не понравится.',
  },
  {
    q: 'Что входит в готовую карточку?',
    a: 'Обработанное фото в 4K, инфографика с преимуществами и характеристиками, а также продающее описание с SEO-ключами под поиск маркетплейса.',
  },
  {
    q: 'Что с моими фото и правами?',
    a: 'Ваши изображения используются только для обработки вашего заказа и не передаются третьим лицам. Все права на результат принадлежат вам.',
  },
]

function Item({ item, isOpen, onToggle }: { item: (typeof FAQ)[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-colors ${isOpen ? 'border-[#FFE135]/40 bg-[#1A1A1A]' : 'border-white/[0.08] bg-[#1A1A1A]/60'}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 text-left px-5 py-4">
        <span className="font-display font-bold text-white text-[15px] flex-1 leading-snug">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? '#FFE135' : 'rgba(255,255,255,0.06)' }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <Plus size={16} className={isOpen ? 'text-[#262626]' : 'text-white/60'} strokeWidth={2.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[14px] text-white/50 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 px-6 bg-[#1e1e1e] overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#FFE135]/[0.03] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="badge mx-auto mb-5">
            <HelpCircle size={11} /> Частые вопросы
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Отвечаем на <span className="text-gradient">главное</span>
          </h2>
        </motion.div>

        {/* List */}
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <Item key={i} item={item} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <span className="text-white/40 text-sm">Остался вопрос? </span>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#FFE135] text-sm font-semibold hover:underline"
          >
            Напишите нам →
          </button>
        </div>
      </div>
    </section>
  )
}
