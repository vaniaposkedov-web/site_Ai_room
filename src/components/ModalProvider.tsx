import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, MessageSquare, CheckCircle, ArrowRight, Lock } from 'lucide-react'

/* ─────────────────────────────────
   Modal context
───────────────────────────────── */
type ModalType = 'login' | 'lead' | null

interface ModalApi {
  openLogin: () => void
  openLead: (plan?: string) => void
  close: () => void
}

const Ctx = createContext<ModalApi>({ openLogin: () => {}, openLead: () => {}, close: () => {} })
export const useModal = () => useContext(Ctx)

/* ─────────────────────────────────
   Shell
───────────────────────────────── */
function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#1A1A1A] p-7 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Закрыть"
        >
          <X size={17} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────
   Shared input
───────────────────────────────── */
function Input({
  icon: Icon, label, type = 'text', value, onChange,
}: {
  icon: typeof User
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
      style={{
        border: `1px solid ${focused ? 'rgba(255,225,53,0.4)' : 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <Icon size={15} style={{ color: focused ? '#FFE135' : 'rgba(255,255,255,0.3)' }} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">{label}</div>
        <input
          type={type}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[14px] text-white/85 outline-none"
        />
      </div>
    </div>
  )
}

function SuccessView({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center mb-5"
      >
        <CheckCircle size={30} className="text-brand-dark" strokeWidth={2.5} />
      </motion.div>
      <h3 className="font-display font-black text-2xl text-white mb-2">{title}</h3>
      <p className="text-white/45 text-sm max-w-[280px] leading-relaxed">{text}</p>
      <button
        onClick={onClose}
        className="mt-6 font-display font-bold text-sm px-6 py-3 rounded-xl bg-brand-yellow text-brand-dark"
      >
        Готово
      </button>
    </div>
  )
}

/* ─────────────────────────────────
   Login form
───────────────────────────────── */
function AuthForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <SuccessView title="Почти готово" text="Личный кабинет скоро откроется. Мы пришлём доступ на вашу почту." onClose={onClose} />

  return (
    <div>
      <h3 className="font-display font-black text-2xl text-white mb-1">Вход</h3>
      <p className="text-white/40 text-sm mb-6">Войдите, чтобы продолжить работу с карточками.</p>
      <div className="space-y-3">
        <Input icon={Mail} label="E-mail" type="email" value={email} onChange={setEmail} />
        <Input icon={Lock} label="Пароль" type="password" value={pass} onChange={setPass} />
      </div>
      <button
        onClick={() => setDone(true)}
        className="mt-5 w-full py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold flex items-center justify-center gap-2"
      >
        Войти <ArrowRight size={17} />
      </button>
      <p className="text-center text-[11px] text-white/30 mt-4">
        Нет аккаунта? Оставьте заявку — мы откроем доступ.
      </p>
    </div>
  )
}

/* ─────────────────────────────────
   Lead form
───────────────────────────────── */
function LeadForm({ plan, onClose }: { plan?: string; onClose: () => void }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <SuccessView title="Заявка принята!" text="Мы свяжемся с вами в ближайшее время и поможем начать." onClose={onClose} />

  return (
    <div>
      <h3 className="font-display font-black text-2xl text-white mb-1">
        {plan ? `Тариф «${plan}»` : 'Начать проект'}
      </h3>
      <p className="text-white/40 text-sm mb-6">
        {plan ? 'Оставьте контакт — подключим тариф и поможем со стартом.' : 'Оставьте контакт — обсудим задачу и подберём решение.'}
      </p>
      <div className="space-y-3">
        <Input icon={User} label="Имя" value={name} onChange={setName} />
        <Input icon={Phone} label="Telegram или телефон" value={contact} onChange={setContact} />
        <Input icon={MessageSquare} label="Комментарий" value={msg} onChange={setMsg} />
      </div>
      <button
        onClick={() => setDone(true)}
        className="mt-5 w-full py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold flex items-center justify-center gap-2"
      >
        Отправить заявку <ArrowRight size={17} />
      </button>
      <p className="text-center text-[11px] text-white/30 mt-4">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </div>
  )
}

/* ─────────────────────────────────
   Provider
───────────────────────────────── */
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<ModalType>(null)
  const [plan, setPlan] = useState<string | undefined>(undefined)

  const openLogin = () => { setPlan(undefined); setType('login') }
  const openLead = (p?: string) => { setPlan(p); setType('lead') }
  const close = () => setType(null)

  return (
    <Ctx.Provider value={{ openLogin, openLead, close }}>
      {children}
      <AnimatePresence>
        {type && (
          <ModalShell onClose={close}>
            {type === 'login' ? <AuthForm onClose={close} /> : <LeadForm plan={plan} onClose={close} />}
          </ModalShell>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
