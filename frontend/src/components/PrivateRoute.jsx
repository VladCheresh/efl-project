import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Пускает на страницу только вошедших пользователей.
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Пока идет проверка токена, не решаем ничего:
  // иначе вошедшего пользователя на мгновение отправило бы на /login
  if (loading) {
    return <p className="state-message">Загрузка...</p>
  }

  // replace убирает закрытый адрес из истории,
  // чтобы кнопка «Назад» не возвращала на него
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
