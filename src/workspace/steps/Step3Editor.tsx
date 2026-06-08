import { useState } from 'react'
import { Type, MousePointerClick, SlidersHorizontal, RotateCcw } from 'lucide-react'
import OverlayCanvas, { buildItems } from '../OverlayCanvas'
import { useWizard, defaultStyle, defaultAdjust } from '../store'

const COLORS = ['#FFFFFF', '#111111', '#FFE135', '#EF4444', '#22C55E']

export default function Step3Editor() {
  const productData = useWizard((s) => s.productData)
  const design = useWizard((s) => s.design)
  const setStyle = useWizard((s) => s.setStyle)
  const adjust = useWizard((s) => s.adjust)
  const setAdjust = useWizard((s) => s.setAdjust)

  const items = buildItems(productData.title, productData.features)
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null)

  const style = selectedId ? { ...defaultStyle(selectedId), ...design.styles[selectedId] } : null
  const selectedLabel = selectedId === 'title' ? 'Заголовок' : selectedId ? 'Преимущество' : null

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Перетащите блоки · выберите для настройки</div>
        <OverlayCanvas editable selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 space-y-5">
        <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
          <Type size={15} className="text-brand-yellow" /> Оформление текста
        </div>

        {!selectedId || !style ? (
          <div className="flex flex-col items-center text-center text-white/35 text-sm py-6 gap-2">
            <MousePointerClick size={22} className="text-white/20" />
            Нажмите на текст на карточке, чтобы настроить его
          </div>
        ) : (
          <>
            <div className="text-[11px] text-white/40">Выбран: <span className="text-white/70">{selectedLabel}</span></div>

            {/* color */}
            <div>
              <div className="text-[11px] text-white/40 mb-2">Цвет</div>
              <div className="flex items-center gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setStyle(selectedId, { color: c })}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ background: c, borderColor: style.color.toUpperCase() === c ? '#FFE135' : 'rgba(255,255,255,0.15)' }}
                  />
                ))}
              </div>
            </div>

            {/* size */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/40 mb-2">
                <span>Размер шрифта</span>
                <span className="text-brand-yellow font-semibold">{style.fontSize}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={48}
                step={1}
                value={style.fontSize}
                onChange={(e) => setStyle(selectedId, { fontSize: Number(e.target.value) })}
                className="w-full accent-[#FFE135] cursor-pointer"
              />
            </div>
          </>
        )}

        <p className="text-[11px] text-white/30 leading-relaxed pt-2 border-t border-white/[0.06]">
          Заголовок и преимущества из шага 1 уже на карточке. Тяните их мышью или пальцем, выбирайте и меняйте стиль.
        </p>
        </div>

        {/* image corrections */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
              <SlidersHorizontal size={15} className="text-brand-yellow" /> Коррекция фото
            </div>
            <button onClick={() => setAdjust(defaultAdjust)} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors">
              <RotateCcw size={12} /> Сброс
            </button>
          </div>
          <AdjSlider label="Яркость" value={adjust.brightness} onChange={(v) => setAdjust({ brightness: v })} />
          <AdjSlider label="Контраст" value={adjust.contrast} onChange={(v) => setAdjust({ contrast: v })} />
          <AdjSlider label="Насыщенность" value={adjust.saturation} onChange={(v) => setAdjust({ saturation: v })} />
        </div>
      </div>
    </div>
  )
}

function AdjSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
        <span>{label}</span>
        <span className="text-brand-yellow font-semibold">{value}%</span>
      </div>
      <input type="range" min={50} max={150} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#FFE135] cursor-pointer" />
    </div>
  )
}
