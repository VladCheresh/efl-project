import axios from 'axios'


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// Подставляет access-токен в каждый запрос,
// чтобы страницам не нужно было 'думать' об авторизации.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Если сервер ответил 401 (access-токен истек),
// один раз пробуем обновить его по refresh-токену и повторяем исходный запрос:
// пользователь ничего не замечает.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem('refresh')

    // _retry защищает от бесконечного цикла:
    // запрос, уже повторенный после обновления токена,
    // второй раз обновлять не будет.
    if (error.response?.status === 401 && refresh && !original._retry) {
      original._retry = true
      try {
        // Здесь обычный axios, а не api:
        // запрос обновления должен идти мимо этих интерцепторов,
        // иначе он сам мог бы получить 401 и зациклиться.
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/login/refresh/`,
          { refresh }
        )
        localStorage.setItem('access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        // Обновить не удалось (например, refresh истек или недействителен):
        // стираем токены, дальше пользователь считается вышедшим.
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }
    }
    return Promise.reject(error)
  }
)

export default api
