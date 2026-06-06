import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'
import { useModal } from '@/components/ModalProvider'

const NAV = [
  { label: 'Как это работает', href: '#step-showcase' },
  { label: 'Примеры',          href: '#solutions'     },
  { label: 'Тарифы',           href: '#pricing'       },
  { label: 'Вопросы',          href: '#faq'           },
  { label: 'Контакты',         href: '#contact'       },
]

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [active,    setActive]    = useState('')
  const [mobileOpen,setMobileOpen]= useState(false)
  const [hovering,  setHovering]  = useState<string | null>(null)
  const { openLogin, openRegister } = useModal()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // detect active section
      for (const item of NAV) {
        const el = document.querySelector(item.href)
        if (el) {
          const { top, bottom } = el.getBoundingClientRect()
          if (top <= 120 && bottom >= 120) { setActive(item.href); break }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const highlightedItem = hovering ?? active

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1A1A1A]/80 backdrop-blur-md border-b border-white/[0.07]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 xl:px-8 flex items-center h-16 gap-8">

          {/* ── Logo ── */}
          <motion.a
            href="#"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center cursor-pointer shrink-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="font-display font-black text-xl tracking-tight text-white">
              AI<span className="text-brand-yellow">ROOM</span>
            </span>
          </motion.a>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV.map(item => (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                onMouseEnter={() => setHovering(item.href)}
                onMouseLeave={() => setHovering(null)}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-150 rounded-full z-10"
                style={{ color: active === item.href ? '#FFE135' : 'rgba(255,255,255,0.65)' }}
              >
                {/* Floating background indicator */}
                {highlightedItem === item.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: active === item.href
                        ? 'rgba(255,225,53,0.1)'
                        : 'rgba(255,255,255,0.06)',
                    }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <button onClick={openLogin} className="text-sm text-white/55 hover:text-white transition-colors px-3 py-2">
              Войти
            </button>

            {/* Pulsing ring button */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-xl bg-brand-yellow/40"
                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.button
                onClick={openRegister}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative font-display font-bold text-sm px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-dark flex items-center gap-2"
              >
                <Sparkles size={14} strokeWidth={2.5} />
                Начать проект
              </motion.button>
            </div>
          </div>

          {/* ── Burger ── */}
          <motion.button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden ml-auto p-2 text-white/60 hover:text-white"
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-white/[0.07] px-6 py-5"
          >
            {NAV.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => go(item.href)}
                className="block w-full text-left py-3.5 text-base font-medium text-white/70 hover:text-white border-b border-white/[0.05] last:border-0 transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
            <div className="flex gap-3 pt-5">
              <button
                onClick={() => { setMobileOpen(false); openLogin() }}
                className="flex-1 py-3 rounded-xl border border-white/15 text-sm font-semibold text-white/70"
              >
                Войти
              </button>
              <button
                onClick={() => { setMobileOpen(false); openRegister() }}
                className="flex-1 py-3 rounded-xl bg-brand-yellow text-brand-dark font-bold text-sm"
              >
                Начать проект
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
