import { Routes, Route } from 'react-router-dom'
import { ModalProvider } from '@/components/ModalProvider'
import Landing from '@/pages/Landing'
import Workspace from '@/pages/Workspace'

export default function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Workspace />} />
      </Routes>
    </ModalProvider>
  )
}
