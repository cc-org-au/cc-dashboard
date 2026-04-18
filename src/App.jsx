import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EcoOS from './pages/EcoOS';
import Dashboard_new from './pages/Dashboard_new';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/EcoOS" replace />} />
        <Route path="/EcoOS" element={<EcoOS />} />
        <Route path="/Dashboard_new" element={<Dashboard_new />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
