import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, Mail, User, Building2, MessageSquare, AlertCircle, Check } from 'lucide-react'
import BrandMark from '@/components/BrandMark'

/* ─────────────────────────────────
   Types
───────────────────────────────── */
type Field = 'name' | 'email' | 'company' | 'message'
type FormState = Record<Field, string>
type Errors    = Partial<Record<Field, string>>

/* ─────────────────────────────────
   Validation
───────────────────────────────── */
function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.name.trim())              e.name    = 'Введите имя'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Некорректный e-mail'
  if (!f.company.trim())           e.company = 'Укажите контакт'
  if (f.message.trim().length < 5) e.message = 'Минимум 5 символов'
  return e
}

/* ─────────────────────────────────
   Single field
───────────────────────────────── */
function Field({
  icon: Icon, label, name, type = 'text', multiline = false,
  value, error, onChange,
}: {
  icon: typeof User
  label: string
  name: Field
  type?: string
  multiline?: boolean
  value: string
  error?: string
  onChange: (n: Field, v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const hasError = !!error
  const isOk = !hasError && value.length > 0

  const borderColor = hasError
    ? 'rgba(239,68,68,0.6)'
    : focused
      ? 'rgba(255,225,53,0.4)'
      : isOk
        ? 'rgba(74,222,128,0.3)'
        : 'rgba(255,255,255,0.08)'

  const glow = focused ? '0 0 16px rgba(255,225,53,0.12)' : 'none'

  const sharedStyle = {
    width: '100%', background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14, outline: 'none',
    fontFamily: 'Inter, system-ui, sans-serif',
    resize: 'none' as const,
  }

  return (
    <div>
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-200"
        style={{ border: `1px solid ${borderColor}`, background: 'rgba(255,255,255,0.02)', boxShadow: glow }}
      >
        <Icon size={15} className="flex-shrink-0 mt-[2px]"
          style={{ color: focused ? '#FFE135' : hasError ? '#EF4444' : 'rgba(255,255,255,0.25)' }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: focused ? 'rgba(255,225,53,0.6)' : 'rgba(255,255,255,0.25)' }}>
            {label}
          </div>
          {multiline ? (
            <textarea rows={3} value={value}
              style={sharedStyle}
              placeholder="Ссылка на товар или пара слов о категории..."
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e => onChange(name, e.target.value)}
            />
          ) : (
            <input type={type} value={value}
              style={sharedStyle}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e => onChange(name, e.target.value)}
            />
          )}
        </div>
        {isOk && <CheckCircle size={14} className="text-[#4ADE80] flex-shrink-0 mt-[3px]" />}
      </div>
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex items-center gap-1.5 text-[11px] text-[#EF4444]"
          >
            <AlertCircle size={11} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TRUST = [
  '3 карточки бесплатно — до оплаты',
  'Готово за 1 день, без студии',
  'Ваши фото не передаём третьим лицам',
]

/* ─────────────────────────────────
   Section
───────────────────────────────── */
export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '', message: '' })
  const [errors, setErrors]   = useState<Errors>({})
  const [sent,   setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (name: Field, value: string) => {
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }))
  }

  const onSubmit = () => {
    const e = validate(form)
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1400)
  }

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,225,53,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto grid md:grid-cols-[0.82fr_1.18fr] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl"
      >
        {/* ── Left: yellow info panel ── */}
        <div className="relative bg-brand-yellow text-brand-dark p-8 md:p-10 flex flex-col justify-between overflow-hidden">
          {/* decorative brand marks */}
          <BrandMark size={200} className="absolute -right-12 -bottom-12 text-brand-dark/10" />
          <BrandMark size={64} className="absolute right-8 top-8 text-brand-dark/10" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest bg-brand-dark/10 px-3 py-1 rounded-full mb-6">
              <Mail size={11} /> Бесплатный тест
            </div>
            <h2 className="font-display font-black text-3xl md:text-[34px] leading-[1.1] mb-4">
              Попробуйте на своём товаре
            </h2>
            <p className="text-brand-dark/70 text-sm leading-relaxed">
              Оставьте контакт и пришлите фото — обработаем 3 карточки
              бесплатно и покажем результат в течение дня.
            </p>
          </div>

          <ul className="relative mt-8 space-y-3">
            {TRUST.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-brand-dark/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-brand-dark" strokeWidth={3} />
                </div>
                <span className="text-[13px] font-semibold text-brand-dark/85 leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: form panel ── */}
        <div className="bg-[#1A1A1A] p-7 md:p-9">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-3.5"
              >
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <Field icon={User}      label="Имя"               name="name"    value={form.name}    error={errors.name}    onChange={onChange} />
                  <Field icon={Mail}      label="E-mail"            name="email"   type="email" value={form.email}   error={errors.email}   onChange={onChange} />
                </div>
                <Field icon={Building2}     label="Telegram или телефон" name="company" value={form.company} error={errors.company} onChange={onChange} />
                <Field icon={MessageSquare} label="Что обработать?"  name="message" multiline value={form.message} error={errors.message} onChange={onChange} />

                <motion.button
                  onClick={onSubmit}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 0 28px rgba(255,225,53,0.3)' }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="w-full py-4 rounded-xl bg-brand-yellow text-brand-dark font-display font-bold text-base flex items-center justify-center gap-2.5 transition-opacity"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                      />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Send size={17} strokeWidth={2.5} />
                      Получить 3 карточки бесплатно
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[10px] text-white/20">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </motion.div>
            ) : (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="py-10 flex flex-col items-center text-center h-full justify-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-brand-yellow/20 blur-xl scale-150 pointer-events-none" />
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="relative w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center"
                  >
                    <CheckCircle size={30} className="text-brand-dark" strokeWidth={2.5} />
                  </motion.div>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="font-display font-black text-2xl text-white mb-2"
                >
                  Заявка принята!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38 }}
                  className="text-white/40 text-sm leading-relaxed max-w-[260px]"
                >
                  Пришлём 3 готовые карточки в течение дня
                  на <span className="text-brand-yellow/80">{form.email}</span>
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', company: '', message: '' }) }}
                  className="mt-6 text-xs text-white/30 hover:text-white/60 transition-colors border border-white/[0.08] px-4 py-2 rounded-lg hover:border-white/20"
                >
                  Отправить ещё одну заявку
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
