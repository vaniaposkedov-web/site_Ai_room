import { ArrowUpRight, Sparkles, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const cols = {
  Решения: ['AI-фотостудия', 'AI-консультант', 'Динамические цены', 'Retention AI', 'Аналитика'],
  Компания: ['О нас', 'Кейсы', 'Команда', 'Карьера', 'Пресс-кит'],
  Ресурсы: ['Блог', 'Исследования', 'Документация', 'Статус сервисов', 'Changelog'],
  Правовое: ['Условия', 'Конфиденциальность', 'Cookie', 'GDPR'],
}

const socials = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Telegram', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'YouTube', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#1a1a1a] overflow-hidden">
      {/* Giant watermark + yellow glow accent */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-screen-xl mx-auto px-6 xl:px-8">

        {/* Top row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-9 h-9 rounded-xl bg-brand-yellow flex items-center justify-center"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles size={17} className="text-brand-dark" strokeWidth={2.5} />
              </motion.div>
              <div>
                <div className="font-display font-black text-xl text-white tracking-tight">
                  AI<span className="text-brand-yellow">ROOM</span>
                </div>
                <div className="text-[10px] text-white/30 -mt-0.5">AI-агентство для e-commerce</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-white/35">
              <span className="flex items-center gap-2"><Mail size={11} className="text-brand-yellow/60" /> hello@airoom.ai</span>
              <span className="flex items-center gap-2"><MapPin size={11} className="text-brand-yellow/60" /> Москва · Дубай · удалённо</span>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map(s => (
              <a key={s.label} href={s.href}
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-brand-yellow px-3 py-2 rounded-lg hover:bg-brand-yellow/[0.06] transition-all border border-transparent hover:border-brand-yellow/20">
                {s.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/[0.06]">
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <div className="text-xs font-semibold text-white mb-5">{title}</div>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">{l}</a>
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
              <div className="font-display font-black text-lg text-brand-dark">Готовы масштабировать бренд с AI?</div>
              <div className="text-sm text-brand-dark/60">Бесплатный аудит и план внедрения за 2 часа.</div>
            </div>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0 flex items-center gap-2 bg-brand-dark text-white font-display font-bold text-sm px-6 py-3 rounded-xl"
            >
              Начать проект
              <ArrowUpRight size={16} />
            </motion.a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-white/20">
          <span>© 2026 AIROOM. Все права защищены.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            Все системы работают
          </div>
        </div>
      </div>
    </footer>
  )
}
