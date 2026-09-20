import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import coatOfArms from '../assets/coat-of-arms.png'

function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src={coatOfArms} alt="Герб Евпатории" className="brand-logo" />
          <span className="brand-text">
            <span className="brand-title">Евпатория: ВДЖ</span>
            <span className="brand-subtitle">Всё для жизни</span>
          </span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/" end className="nav-link">
            Каталог
          </NavLink>
          {user && (
            <NavLink to="/favorites" className="nav-link">
              Избранное
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          {!loading &&
            (user ? (
              <>
                <span className="user-name">{user.username}</span>
                <button type="button" className="btn btn-outline" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Войти
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </>
            ))}
        </div>
      </div>
      <div className="flag-stripe" aria-hidden="true" />
    </header>
  )
}

export default Header
