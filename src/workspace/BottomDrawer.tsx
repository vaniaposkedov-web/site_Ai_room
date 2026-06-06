import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, ChevronUp, ChevronDown, X, Layers } from 'lucide-react'
import { useFlow, type BatchFile } from './store'

const STATUS_RING: Record<BatchFile['status'], string> = {
  idle: 'rgba(255,255,255,0.15)',
  processing: '#FFE135',
  done: '#4ADE80',
  error: '#EF4444',
}

function Thumb({ file }: { file: BatchFile }) {
  const removeFile = useFlow((s) => s.removeFile)
  return (
    <div className="relative flex-shrink-0 w-24 group">
      <div
        className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#141414]"
        style={{ boxShadow: `0 0 0 2px ${STATUS_RING[file.status]}` }}
      >
        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        {/* progress overlay */}
        {file.status === 'processing' && (
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5 px-1.5">
            <div className="text-[9px] text-brand-yellow text-center leading-tight">{file.current}</div>
            <div className="w-full h-1 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-brand-yellow transition-all" style={{ width: `${Math.round(file.progress * 100)}%` }} />
            </div>
          </div>
        )}
        {file.status === 'done' && (
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4ADE80] flex items-center justify-center text-[#262626] text-[9px] font-black">✓</div>
        )}
        <button
          onClick={() => removeFile(file.id)}
          className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/60 text-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={11} />
        </button>
      </div>
      <div className="text-[9px] text-white/35 truncate mt-1 text-center">{file.name}</div>
    </div>
  )
}

export default function BottomDrawer() {
  const files = useFlow((s) => s.files)
  const addFiles = useFlow((s) => s.addFiles)
  const [open, setOpen] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex-shrink-0 border-t border-white/[0.07] bg-[#161616]">
      {/* header bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 flex items-center gap-2 px-4 text-white/60 hover:text-white transition-colors"
      >
        <Layers size={15} className="text-brand-yellow" />
        <span className="text-[13px] font-semibold">Пакетная обработка</span>
        <span className="text-[11px] text-white/30">{files.length ? `${files.length} файл(ов)` : 'нет файлов'}</span>
        <span className="ml-auto">{open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 px-4 pb-4 pt-1">
              {/* dropzone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files) }}
                className="flex-shrink-0 w-56 h-[7.5rem] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  borderColor: dragOver ? 'rgba(255,225,53,0.7)' : 'rgba(255,255,255,0.12)',
                  background: dragOver ? 'rgba(255,225,53,0.05)' : 'transparent',
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }}
                />
                <UploadCloud size={24} className="text-brand-yellow" />
                <div className="text-[12px] font-semibold text-white/80">Перетащите фото</div>
                <div className="text-[10px] text-white/35">или нажмите · можно несколько</div>
              </div>

              {/* carousel */}
              <div className="flex-1 min-w-0">
                {files.length ? (
                  <div className="flex gap-3 overflow-x-auto no-scrollbar h-full items-start py-0.5">
                    {files.map((f) => <Thumb key={f.id} file={f} />)}
                  </div>
                ) : (
                  <div className="h-full flex items-center text-sm text-white/25">
                    Загрузите изображения — они пройдут через собранный пайплайн при запуске.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
