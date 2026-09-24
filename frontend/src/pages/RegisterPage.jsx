import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import PasswordInput from '../components/PasswordInput'
 
function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
 
  const { login } = useAuth()
  const navigate = useNavigate()
 
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают.')
      return
    }

    setSubmitting(true)

    try {
      await register({ username, password, phone })
      await login(username, password)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.username) {
        setError('Такой логин уже занят')
      } else if (data?.password) {
        setError(data.password.join(' '))
      } else {
        setError('Не удалось зарегистрироваться')
      }
    } finally {
      setSubmitting(false)
    }
  }
 
  return (
    <div className="auth-card">
      <h1>Регистрация</h1>
      <p className="auth-lead">Создайте аккаунт, чтобы вести своё избранное</p>
 
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Логин</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
 
        <PasswordInput
          id="password"
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />

        <PasswordInput
          id="password-confirm"
          label="Повторите пароль"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
        />
 
        <div className="field">
          <label htmlFor="phone">Телефон (необязательно)</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
 
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
 
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Регистрируем...' : 'Зарегистрироваться'}
        </button>
      </form>
 
      <p className="auth-switch">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  )
}
 
export default RegisterPage
 