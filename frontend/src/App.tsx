import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { RegistrationPage } from "./pages/RegistrationPage"
import { StatusPage } from "./pages/StatusPage"
import { NotFoundPage } from "./pages/NotFoundPage"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
