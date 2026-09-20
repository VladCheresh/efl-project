import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header>
      <nav>
        <Link to="/">Каталог</Link>
        {user && <Link to="/favorites">Избранное</Link>}
      </nav>

      {/* пока AuthContext проверяет токен, не показываем ни "Войти", ни имя */}
      {!loading && (
        <div>
          {user ? (
            <>
              <span>{user.username}</span>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
