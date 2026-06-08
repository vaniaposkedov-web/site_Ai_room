import { Routes, Route } from 'react-router-dom'
import { ModalProvider } from '@/components/ModalProvider'
import Landing from '@/pages/Landing'
import ToolSelect from '@/pages/ToolSelect'
import Infographics from '@/pages/Infographics'

export default function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<ToolSelect />} />
        <Route path="/app/create" element={<Infographics />} />
      </Routes>
    </ModalProvider>
  )
}
