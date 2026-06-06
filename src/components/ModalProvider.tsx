import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, MessageSquare, CheckCircle, ArrowRight, Lock } from 'lucide-react'

/* ─────────────────────────────────
   Modal context
───────────────────────────────── */
type ModalType = 'login' | 'register' | 'lead' | null

interface ModalApi {
  openLogin: () => void
  openRegister: () => void
  openLead: (plan?: string) => void
  close: () => void
}

const Ctx = createContext<ModalApi>({ openLogin: () => {}, openRegister: () => {}, openLead: () => {}, close: () => {} })
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
   Social auth
───────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.3 5.2C41.8 35.6 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  )
}
function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AABEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2 11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}
function SocialRow({ onAuth }: { onAuth: () => void }) {
  const items = [
    { label: 'Google', icon: <GoogleIcon /> },
    { label: 'Telegram', icon: <TelegramIcon /> },
    { label: 'VK', icon: <span className="font-display font-black text-[13px]" style={{ color: '#0077FF' }}>VK</span> },
  ]
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((s) => (
        <button
          key={s.label}
          onClick={onAuth}
          className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-[#FFE135]/40 hover:bg-white/[0.04] transition-colors"
        >
          <span className="h-[18px] flex items-center">{s.icon}</span>
          <span className="text-[11px] text-white/55">{s.label}</span>
        </button>
      ))}
    </div>
  )
}
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] text-white/30 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}
function FormHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-5">
      <div className="font-display font-black text-lg tracking-tight mb-3 text-white">
        AI<span className="text-brand-yellow">ROOM</span>
      </div>
      <h3 className="font-display font-black text-2xl text-white">{title}</h3>
      <p className="text-white/40 text-sm mt-1">{subtitle}</p>
    </div>
  )
}

/* ─────────────────────────────────
   Login form
───────────────────────────────── */
function AuthForm({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <SuccessView title="С возвращением!" text="Открываем рабочую область — это займёт пару секунд." onClose={onClose} />

  return (
    <div>
      <FormHead title="Вход" subtitle="Продолжите работу с карточками" />
      <SocialRow onAuth={() => setDone(true)} />
      <Divider label="или по почте" />
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
      <p className="text-center text-[12px] text-white/35 mt-4">
        Нет аккаунта?{' '}
        <button onClick={onSwitch} className="text-brand-yellow font-semibold hover:underline">Регистрация</button>
      </p>
    </div>
  )
}

/* ─────────────────────────────────
   Register form
───────────────────────────────── */
function RegisterForm({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <SuccessView title="Аккаунт создан!" text="Мы отправили подтверждение на вашу почту. Добро пожаловать в AI ROOM." onClose={onClose} />

  return (
    <div>
      <FormHead title="Регистрация" subtitle="Создайте аккаунт за минуту" />
      <SocialRow onAuth={() => setDone(true)} />
      <Divider label="или по почте" />
      <div className="space-y-3">
        <Input icon={User} label="Имя" value={name} onChange={setName} />
        <Input icon={Mail} label="E-mail" type="email" value={email} onChange={setEmail} />
        <Input icon={Lock} label="Пароль" type="password" value={pass} onChange={setPass} />
      </div>
      <button
        onClick={() => setDone(true)}
        className="mt-5 w-full py-3.5 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold flex items-center justify-center gap-2"
      >
        Создать аккаунт <ArrowRight size={17} />
      </button>
      <p className="text-center text-[12px] text-white/35 mt-4">
        Уже есть аккаунт?{' '}
        <button onClick={onSwitch} className="text-brand-yellow font-semibold hover:underline">Войти</button>
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
  const openRegister = () => { setPlan(undefined); setType('register') }
  const openLead = (p?: string) => { setPlan(p); setType('lead') }
  const close = () => setType(null)

  return (
    <Ctx.Provider value={{ openLogin, openRegister, openLead, close }}>
      {children}
      <AnimatePresence>
        {type && (
          <ModalShell onClose={close}>
            {type === 'login' && <AuthForm onClose={close} onSwitch={() => setType('register')} />}
            {type === 'register' && <RegisterForm onClose={close} onSwitch={() => setType('login')} />}
            {type === 'lead' && <LeadForm plan={plan} onClose={close} />}
          </ModalShell>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
