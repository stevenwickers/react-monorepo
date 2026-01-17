import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import DashboardPage from './pages/DashboardPage'
import ColorsPage from './pages/ColorsPage'
import TypographyPage from './pages/TypographyPage'
import LogosPage from './pages/LogosPage'
import ComponentsPage from './pages/ComponentsPage'
import GovernancePage from './pages/GovernancePage'
import '@unifirst/ui-styles/tailwind.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/colors" element={<ColorsPage />} />
          <Route path="/typography" element={<TypographyPage />} />
          <Route path="/logos" element={<LogosPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/governance" element={<GovernancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
