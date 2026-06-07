import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useWizard } from './store'

export default function Toaster() {
  const toast = useWizard((s) => s.toast)
  const setToast = useWizard((s) => s.setToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast, setToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2.5 max-w-[90vw] rounded-xl border border-[#EF4444]/30 bg-[#1A1A1A] px-4 py-3 shadow-2xl"
        >
          <AlertCircle size={16} className="text-[#EF4444] flex-shrink-0" />
          <span className="text-sm text-white/80">{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/30 hover:text-white ml-1">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
