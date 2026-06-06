import { useEffect, useState } from 'react'
import { Undo2, Redo2, Save, Trash2, AlignStartVertical, FolderOpen, ChevronDown, X } from 'lucide-react'
import { useFlow } from './store'

function btn(disabled?: boolean) {
  return `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors ${
    disabled ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
  }`
}

export default function Toolbar() {
  const past = useFlow((s) => s.past.length)
  const future = useFlow((s) => s.future.length)
  const undo = useFlow((s) => s.undo)
  const redo = useFlow((s) => s.redo)
  const clearCanvas = useFlow((s) => s.clearCanvas)
  const autoLayout = useFlow((s) => s.autoLayout)
  const templates = useFlow((s) => s.templates)
  const saveTemplate = useFlow((s) => s.saveTemplate)
  const loadTemplate = useFlow((s) => s.loadTemplate)
  const deleteTemplate = useFlow((s) => s.deleteTemplate)

  const [tplOpen, setTplOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  // горячие клавиши Undo / Redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); useFlow.getState().undo() }
      else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); useFlow.getState().redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSave = () => {
    const name = window.prompt('Название шаблона:')
    if (name && name.trim()) saveTemplate(name.trim())
  }

  return (
    <div className="h-11 flex-shrink-0 flex items-center gap-1 px-3 border-b border-white/[0.07] bg-[#161616] z-10">
      <button className={btn(!past)} disabled={!past} onClick={undo} title="Отменить (Ctrl+Z)">
        <Undo2 size={15} /> <span className="hidden lg:inline">Отменить</span>
      </button>
      <button className={btn(!future)} disabled={!future} onClick={redo} title="Вернуть (Ctrl+Y)">
        <Redo2 size={15} /> <span className="hidden lg:inline">Вернуть</span>
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button className={btn()} onClick={autoLayout} title="Автовыравнивание">
        <AlignStartVertical size={15} /> <span className="hidden lg:inline">Выровнять</span>
      </button>

      {/* templates */}
      <div className="relative">
        <button className={btn()} onClick={() => setTplOpen((v) => !v)}>
          <FolderOpen size={15} /> <span className="hidden lg:inline">Шаблоны</span> <ChevronDown size={13} />
        </button>
        {tplOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setTplOpen(false)} />
            <div className="absolute left-0 top-full mt-1 z-20 w-64 rounded-xl border border-white/[0.1] bg-[#1A1A1A] shadow-2xl p-1.5">
              {templates.length === 0 && <div className="px-3 py-2 text-xs text-white/30">Нет сохранённых шаблонов</div>}
              {templates.map((t) => (
                <div key={t.id} className="flex items-center group rounded-lg hover:bg-white/[0.05]">
                  <button
                    onClick={() => { loadTemplate(t.id); setTplOpen(false) }}
                    className="flex-1 text-left px-3 py-2 text-[13px] text-white/70 truncate"
                  >
                    {t.name}
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="px-2 text-white/25 hover:text-[#EF4444]">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button className={btn()} onClick={onSave} title="Сохранить как шаблон">
        <Save size={15} /> <span className="hidden lg:inline">Сохранить</span>
      </button>

      <div className="ml-auto relative">
        {!confirmClear ? (
          <button className={btn()} onClick={() => setConfirmClear(true)} title="Очистить холст">
            <Trash2 size={15} /> <span className="hidden lg:inline">Очистить</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white/50">Удалить всё?</span>
            <button onClick={() => { clearCanvas(); setConfirmClear(false) }} className="px-2 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] font-semibold hover:bg-[#EF4444]/30">Да</button>
            <button onClick={() => setConfirmClear(false)} className="px-2 py-1 rounded-lg text-white/50 hover:bg-white/[0.06]">Нет</button>
          </div>
        )}
      </div>
    </div>
  )
}
