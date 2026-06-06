import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useModal } from '@/components/ModalProvider'

/* ─────────────────────────────────
   Контакты — замените на реальные данные
───────────────────────────────── */
const CONTACTS = {
  email: 'web14329@gmail.com',
  telegram: 'https://t.me/bnbslow',
}

const SOCIALS = [
  { label: 'Telegram', href: CONTACTS.telegram },
]

/* Реальные ссылки на секции страницы */
const NAV: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Продукт',
    links: [
      { label: 'Как это работает', href: '#step-showcase' },
      { label: 'Примеры до/после', href: '#solutions' },
      { label: 'AI-примерка', href: '#try-on' },
      { label: 'Категории товаров', href: '#categories' },
    ],
  },
  {
    title: 'Помощь',
    links: [
      { label: 'Тарифы', href: '#pricing' },
      { label: 'Частые вопросы', href: '#faq' },
      { label: 'Отзывы', href: '#testimonials' },
      { label: 'Связаться', href: '#contact' },
    ],
  },
]

export default function Footer() {
  const { openRegister } = useModal()

  return (
    <footer className="relative border-t border-white/[0.07] bg-[#1a1a1a] overflow-hidden">
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-screen-xl mx-auto px-6 xl:px-8">
        {/* Top: brand + nav */}
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr] gap-10 py-14 border-b border-white/[0.06]">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-2xl text-white tracking-tight mb-2">
              AI<span className="text-brand-yellow">ROOM</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[280px] mb-5">
              Нейросеть для карточек маркетплейсов: обработка фото,
              инфографика и описания для Wildberries и Ozon.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/45">
              <a href={`mailto:${CONTACTS.email}`} className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
                <Mail size={13} className="text-brand-yellow/70" /> {CONTACTS.email}
              </a>
              <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
                <Send size={13} className="text-brand-yellow/70" /> Telegram
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Yellow CTA strip */}
        <div className="py-8 border-b border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-brand-yellow px-7 py-6">
            <div>
              <div className="font-display font-black text-lg text-brand-dark">Готовы сделать продающие карточки?</div>
              <div className="text-sm text-brand-dark/60">Оставьте заявку — поможем начать.</div>
            </div>
            <motion.button
              onClick={openRegister}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0 flex items-center gap-2 bg-brand-dark text-white font-display font-bold text-sm px-6 py-3 rounded-xl"
            >
              Начать проект
              <ArrowUpRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* Socials + bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <span className="text-xs text-white/25">© 2026 AIROOM. Все права защищены.</span>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-brand-yellow px-3 py-2 rounded-lg hover:bg-brand-yellow/[0.06] transition-all border border-transparent hover:border-brand-yellow/20">
                {s.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
