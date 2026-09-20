import { Routes, Route, Link } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import CatalogPage from './pages/CatalogPage'
import OrganizationDetailPage from './pages/OrganizationDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Header from './components/Header'


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<p>Страница не найдена. <Link to="/">В каталог</Link></p>} />
      </Routes>
    </>
  )
}

export default App
