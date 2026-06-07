import { Type, RotateCcw } from 'lucide-react'
import OverlayCanvas from '../OverlayCanvas'
import { useWizard } from '../store'

const COLORS = [
  { v: '#FFFFFF', label: 'Белый' },
  { v: '#111111', label: 'Чёрный' },
]

export default function Step3Editor() {
  const design = useWizard((s) => s.design)
  const setDesign = useWizard((s) => s.setDesign)

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
      {/* canvas */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Перетащите тексты по карточке</div>
        <OverlayCanvas editable />
      </div>

      {/* sidebar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 space-y-5">
        <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
          <Type size={15} className="text-brand-yellow" /> Оформление текста
        </div>

        {/* color */}
        <div>
          <div className="text-[11px] text-white/40 mb-2">Цвет</div>
          <div className="grid grid-cols-2 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.v}
                onClick={() => setDesign({ color: c.v })}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                style={{
                  borderColor: design.color === c.v ? '#FFE135' : 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: c.v }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* font size */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-white/40 mb-2">
            <span>Размер шрифта</span>
            <span className="text-brand-yellow font-semibold">{design.fontSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={36}
            step={1}
            value={design.fontSize}
            onChange={(e) => setDesign({ fontSize: Number(e.target.value) })}
            className="w-full accent-[#FFE135] cursor-pointer"
          />
        </div>

        <button
          onClick={() => setDesign({ positions: {} })}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/25 transition-colors"
        >
          <RotateCcw size={14} /> Сбросить позиции
        </button>

        <p className="text-[11px] text-white/30 leading-relaxed">
          Заголовок и преимущества из шага 1 уже на карточке. Тяните их мышью или пальцем.
        </p>
      </div>
    </div>
  )
}
