import { useRef, useState } from 'react'
import { useWizard } from './store'

export interface OverlayItem { id: string; text: string; kind: 'title' | 'feature' }

export const DEFAULT_POS: Record<string, { x: number; y: number }> = {
  title: { x: 6, y: 6 },
  f0: { x: 6, y: 72 },
  f1: { x: 6, y: 80 },
  f2: { x: 6, y: 88 },
}

export function buildItems(title: string, features: string[]): OverlayItem[] {
  const items: OverlayItem[] = []
  if (title.trim()) items.push({ id: 'title', text: title, kind: 'title' })
  features.filter((f) => f.trim()).slice(0, 3).forEach((f, i) => items.push({ id: `f${i}`, text: f, kind: 'feature' }))
  return items
}

export default function OverlayCanvas({ editable = false }: { editable?: boolean }) {
  const productData = useWizard((s) => s.productData)
  const design = useWizard((s) => s.design)
  const setPosition = useWizard((s) => s.setPosition)
  const ref = useRef<HTMLDivElement>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  const bg = productData.finalImage || productData.processedImage || productData.originalImage
  const items = buildItems(productData.title, productData.features)

  const posOf = (id: string) => design.positions[id] ?? DEFAULT_POS[id] ?? { x: 6, y: 6 }

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    if (!editable) return
    e.preventDefault()
    setDragId(id)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragId || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = Math.min(94, Math.max(2, ((e.clientX - r.left) / r.width) * 100))
    const y = Math.min(94, Math.max(2, ((e.clientY - r.top) / r.height) * 100))
    setPosition(dragId, { x, y })
  }
  const onPointerUp = () => setDragId(null)

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative w-full max-w-[420px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.08] select-none"
    >
      {bg ? (
        <img src={bg} alt="card" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">Нет изображения</div>
      )}

      {items.map((it) => {
        const p = posOf(it.id)
        const isTitle = it.kind === 'title'
        return (
          <div
            key={it.id}
            onPointerDown={(e) => onPointerDown(e, it.id)}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              color: design.color,
              fontSize: isTitle ? design.fontSize * 1.5 : design.fontSize,
              fontWeight: isTitle ? 800 : 600,
              maxWidth: '88%',
              textShadow: design.color === '#FFFFFF' ? '0 1px 6px rgba(0,0,0,0.6)' : '0 1px 4px rgba(255,255,255,0.4)',
              cursor: editable ? (dragId === it.id ? 'grabbing' : 'grab') : 'default',
              touchAction: 'none',
            }}
            className={`absolute font-display leading-tight ${editable ? 'rounded-md hover:ring-1 hover:ring-brand-yellow/60 px-1 -mx-1' : ''} ${
              isTitle ? '' : 'flex items-center gap-1.5'
            }`}
          >
            {!isTitle && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#FFE135' }} />}
            {it.text}
          </div>
        )
      })}
    </div>
  )
}
