import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginRequest, getMe } from '../api/auth'

const AuthContext = createContext(null)

// Хранит текущего пользователя и дает всему приложению:
// login, logout и признак загрузки через useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Пока true, ещё неизвестно, вошел ли пользователь.
  // PrivateRoute ждёт этого признака,
  // чтобы не отправить на /login раньше времени.
  const [loading, setLoading] = useState(true)

  // Восстанавливаем вход после перезагрузки страницы:
  // токен лежит в localStorage, по нему запрашиваем данные пользователя.
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then((response) => setUser(response.data))
      .catch(() => {
        // Не удалось получить пользователя
        // (токены недействительны или сервер недоступен):
        // забываем токены, пользователь не вошел.
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const response = await loginRequest({ username, password })
    localStorage.setItem('access', response.data.access)
    localStorage.setItem('refresh', response.data.refresh)

    // Ответ на вход содержит только токены,
    // поэтому данные пользователя запрашиваем отдельно
    const me = await getMe()
    setUser(me.data)
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
