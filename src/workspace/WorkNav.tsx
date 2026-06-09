import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Star, Plus } from 'lucide-react'
import { useModal } from '@/components/ModalProvider'
import { useStudio } from '@/workspace/studioStore'
import ProfileMenu from '@/workspace/ProfileMenu'

export default function WorkNav({ backTo = '/' }: { backTo?: string }) {
  const { openLogin, openRegister } = useModal()
  const balance = useStudio((s) => s.balance)
  const topUp = useStudio((s) => s.topUp)
  return (
    <nav className="fixed top-0 inset-x-0 z-[1000] bg-[#1c1c1c]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={backTo}
            aria-label="Назад"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-sm text-white/80 hover:border-[#F5C800] hover:text-[#F5C800] transition-colors"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Назад</span>
          </Link>
          <Link to="/" className="font-['Unbounded'] font-black text-xl tracking-tight">
            <span className="text-[#F5C800]">AI</span><span className="text-white">ROOM</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-sm text-white/55">
          <a href="/#step-showcase" className="px-3 py-1.5 hover:text-white transition-colors">Как это работает</a>
          <a href="/#solutions" className="px-3 py-1.5 hover:text-white transition-colors">Примеры</a>
          <a href="/#pricing" className="px-3 py-1.5 hover:text-white transition-colors">Тарифы</a>
          <a href="/#faq" className="px-3 py-1.5 hover:text-white transition-colors">Вопросы</a>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-xl pl-2.5 pr-1 py-1.5">
            <span className="flex items-center gap-1 font-bold text-[#F5C800] text-sm tabular-nums">{balance} <Star size={12} fill="currentColor" /></span>
            <button onClick={() => topUp(50)} title="Пополнить (демо +50)" className="w-6 h-6 rounded-lg bg-[#F5C800]/15 text-[#F5C800] flex items-center justify-center hover:bg-[#F5C800]/25 transition-colors"><Plus size={13} /></button>
          </div>
          <button onClick={openLogin} className="hidden md:block text-sm text-white/80 hover:text-white px-3 py-2 transition-colors">Войти</button>
          <button
            onClick={openRegister}
            className="hidden md:flex items-center gap-1.5 bg-[#F5C800] text-[#111] font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#e0b400] transition-colors"
          >
            <Sparkles size={14} /> Начать проект
          </button>
          <ProfileMenu />
        </div>
      </div>
    </nav>
  )
}
