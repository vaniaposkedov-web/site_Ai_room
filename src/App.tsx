import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ModalProvider } from '@/components/ModalProvider'
import Landing from '@/pages/Landing'
import ToolSelect from '@/pages/ToolSelect'
import Infographics from '@/pages/Infographics'
import Admin from '@/pages/Admin'
import { loadSettings } from '@/workspace/settings'
import { initYandexMetrika, ymHit } from '@/lib/ym'

export default function App() {
  const location = useLocation()

  // Яндекс.Метрика: подключение по ID из настроек админки
  useEffect(() => { initYandexMetrika(loadSettings().ym) }, [])
  // сброс прокрутки наверх + хит метрики при смене маршрута
  useEffect(() => { window.scrollTo({ top: 0 }); ymHit(location.pathname + location.search) }, [location.pathname, location.search])

  return (
    <ModalProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<ToolSelect />} />
        <Route path="/app/create" element={<Infographics />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ModalProvider>
  )
}
