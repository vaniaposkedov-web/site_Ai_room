import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Lock, Save, RotateCcw, MessageSquareText, Cpu, BarChart3, LogOut, Check } from 'lucide-react'
import { TOOLS } from '@/workspace/tools'
import { loadSettings, saveSettings, type AISettings } from '@/workspace/settings'
import { useStudio } from '@/workspace/studioStore'
import { initYandexMetrika } from '@/lib/ym'

const ADMIN_LOGIN = 'admin'
const ADMIN_PASS = (import.meta.env.VITE_ADMIN_PASS as string | undefined) || 'airoom2026'
const AUTH_KEY = 'airoom_admin_auth'

const GRID_BG = {
  backgroundColor: '#1c1c1c',
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
}
const TABS = [
  { id: 'prompts', label: 'Промпты', icon: MessageSquareText },
  { id: 'models', label: 'Нейросети', icon: Cpu },
  { id: 'metrika', label: 'Метрика', icon: BarChart3 },
  { id: 'profiles', label: 'Профили', icon: Shield },
] as const

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(AUTH_KEY) === '1')
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)

  const [settings, setSettings] = useState<AISettings>(loadSettings())
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('prompts')
  const [saved, setSaved] = useState(false)

  const stats = useStudio((s) => s.stats)
  const history = useStudio((s) => s.history)

  const doLogin = () => {
    if (login.trim() === ADMIN_LOGIN && pass === ADMIN_PASS) { sessionStorage.setItem(AUTH_KEY, '1'); setAuthed(true); setErr(false) }
    else setErr(true)
  }
  const logout = () => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); setLogin(''); setPass('') }

  const persist = (next: AISettings) => { setSettings(next); }
  const save = () => { saveSettings(settings); initYandexMetrika(settings.ym); setSaved(true); setTimeout(() => setSaved(false), 1800) }

  /* ── LOGIN ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-['Onest'] px-4" style={GRID_BG}>
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#242424] p-7">
          <div className="w-12 h-12 rounded-2xl bg-[#F5C800]/15 border border-[#F5C800]/30 flex items-center justify-center mb-4"><Shield size={22} className="text-[#F5C800]" /></div>
          <h1 className="font-['Unbounded'] font-bold text-xl mb-1">Админ-панель</h1>
          <p className="text-white/45 text-sm mb-5">Вход только для администратора</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#2e2e2e] px-3 py-2.5"><Shield size={15} className="text-white/30" /><input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" className="flex-1 bg-transparent text-sm outline-none" /></div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#2e2e2e] px-3 py-2.5"><Lock size={15} className="text-white/30" /><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && doLogin()} placeholder="Пароль" className="flex-1 bg-transparent text-sm outline-none" /></div>
          </div>
          {err && <div className="text-[#EF4444] text-[12px] mt-2">Неверный логин или пароль</div>}
          <button onClick={doLogin} className="mt-5 w-full bg-[#F5C800] text-[#111] font-['Unbounded'] font-bold text-sm py-3 rounded-xl">Войти</button>
          <Link to="/app" className="block text-center text-[12px] text-white/35 mt-4 hover:text-white">← Вернуться в рабочую область</Link>
        </div>
      </div>
    )
  }

  /* ── PANEL ── */
  return (
    <div className="min-h-screen text-white font-['Onest']" style={GRID_BG}>
      <div className="border-b border-white/[0.08] bg-[#1c1c1c]/85 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><Shield size={18} className="text-[#F5C800]" /><span className="font-['Unbounded'] font-bold">Админ-панель</span></div>
          <div className="flex items-center gap-2">
            <button onClick={save} className="flex items-center gap-2 bg-[#F5C800] text-[#111] font-semibold text-sm px-4 py-2 rounded-xl">{saved ? <Check size={15} /> : <Save size={15} />} {saved ? 'Сохранено' : 'Сохранить'}</button>
            <button onClick={logout} className="flex items-center gap-1.5 border border-white/10 text-white/60 text-sm px-3 py-2 rounded-xl hover:text-white"><LogOut size={15} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((t) => {
            const Icon = t.icon
            const on = tab === t.id
            return <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors" style={{ borderColor: on ? '#F5C800' : 'rgba(255,255,255,0.1)', color: on ? '#F5C800' : 'rgba(255,255,255,0.6)', background: on ? 'rgba(245,200,0,0.06)' : 'transparent' }}><Icon size={15} /> {t.label}</button>
          })}
        </div>

        {/* PROMPTS */}
        {tab === 'prompts' && (
          <div className="space-y-4">
            <p className="text-white/45 text-sm">Шаблоны промптов для каждого инструмента. Плейсхолдеры: <code className="text-[#F5C800]">{'{type} {category} {advantages} {specs} {text} {format} {ref}'}</code></p>
            {TOOLS.map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/[0.08] bg-[#242424] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><t.icon size={15} className="text-[#F5C800]" /><span className="font-semibold text-sm">{t.name}</span><span className="text-[10px] uppercase tracking-wider text-white/30">{t.kind === 'image' ? 'изображение' : 'текст'}</span></div>
                  <button onClick={() => persist({ ...settings, promptOverrides: { ...settings.promptOverrides, [t.id]: '' }, systemOverrides: { ...settings.systemOverrides, [t.id]: '' } })} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white"><RotateCcw size={12} /> Сброс</button>
                </div>
                {t.kind === 'text' && (
                  <textarea value={settings.systemOverrides[t.id] || t.defaultSystem || ''} onChange={(e) => persist({ ...settings, systemOverrides: { ...settings.systemOverrides, [t.id]: e.target.value } })} rows={2} placeholder="System (роль модели)" className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#F5C800]/50 resize-none mb-2" />
                )}
                <textarea value={settings.promptOverrides[t.id] || t.defaultTemplate} onChange={(e) => persist({ ...settings, promptOverrides: { ...settings.promptOverrides, [t.id]: e.target.value } })} rows={3} className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#F5C800]/50 resize-none" />
              </div>
            ))}
          </div>
        )}

        {/* MODELS */}
        {tab === 'models' && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#242424] p-5 space-y-4 max-w-lg">
            <p className="text-white/45 text-sm">ID моделей ZvenoAI (формат <code className="text-[#F5C800]">vendor/model</code>). Пусто = из .env.</p>
            {([['vision', 'Vision (определение товара)', 'google/gemini-2.5-flash-lite'], ['text', 'Текст (описания/анализ)', 'mistralai/mistral-small-3.2-24b-instruct'], ['image', 'Изображения (генерация)', 'google/gemini-3.1-flash-image-preview']] as const).map(([k, label, ph]) => (
              <div key={k}><label className="block text-[12px] text-white/45 mb-1.5">{label}</label><input value={settings.models[k]} onChange={(e) => persist({ ...settings, models: { ...settings.models, [k]: e.target.value } })} placeholder={ph} className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5C800]/50 placeholder:text-white/20" /></div>
            ))}
          </div>
        )}

        {/* METRIKA */}
        {tab === 'metrika' && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#242424] p-5 space-y-3 max-w-lg">
            <p className="text-white/45 text-sm">Подключите Яндекс.Метрику — счётчик загрузится автоматически на всём сайте.</p>
            <label className="block text-[12px] text-white/45 mb-1.5">Номер счётчика Яндекс.Метрики</label>
            <input value={settings.ym} onChange={(e) => persist({ ...settings, ym: e.target.value.replace(/\D/g, '') })} placeholder="например 98765432" className="w-full bg-[#2e2e2e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5C800]/50 placeholder:text-white/20" />
            <p className="text-[12px] text-white/30">После «Сохранить» метрика подключится. Цель/события можно отслеживать через ym('hit').</p>
          </div>
        )}

        {/* PROFILES */}
        {tab === 'profiles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-[#242424] p-4"><div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Всего генераций</div><div className="font-['Unbounded'] font-bold text-2xl text-[#F5C800]">{stats.total}</div></div>
              <div className="rounded-xl border border-white/[0.08] bg-[#242424] p-4"><div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Понравилось</div><div className="font-['Unbounded'] font-bold text-2xl text-[#F5C800]">{stats.liked}</div></div>
              <div className="rounded-xl border border-white/[0.08] bg-[#242424] p-4"><div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">В истории сессии</div><div className="font-['Unbounded'] font-bold text-2xl text-[#F5C800]">{history.length}</div></div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#242424] p-4">
              <div className="flex items-center justify-between mb-3"><div className="font-semibold text-sm">История генераций (сессия)</div><button onClick={() => useStudio.setState({ history: [] })} className="text-[12px] text-white/40 hover:text-[#EF4444]">Очистить</button></div>
              {history.length === 0 ? <div className="text-[12px] text-white/30">Пусто.</div> : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {history.map((h) => (
                    <div key={h.id} className="aspect-[3/4] rounded-lg overflow-hidden bg-[#141414] flex items-center justify-center" title={h.toolName}>
                      {h.image ? <img src={h.image} alt="" className="w-full h-full object-cover" /> : <MessageSquareText size={16} className="text-white/40" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#242424] p-4">
              <div className="font-semibold text-sm mb-3">Использование инструментов</div>
              <div className="space-y-2">
                {Object.entries(stats.byTool).sort((a, b) => b[1] - a[1]).map(([id, n]) => {
                  const t = TOOLS.find((x) => x.id === id)
                  const max = Math.max(...Object.values(stats.byTool), 1)
                  return <div key={id} className="flex items-center gap-3"><span className="text-[13px] text-white/70 w-40 truncate">{t?.name ?? id}</span><div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full bg-[#F5C800]" style={{ width: `${(n / max) * 100}%` }} /></div><span className="text-[12px] text-white/45 w-6 text-right">{n}</span></div>
                })}
                {Object.keys(stats.byTool).length === 0 && <div className="text-[12px] text-white/30">Нет данных.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
