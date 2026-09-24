import { useState } from 'react'


function PasswordInput({ id, label, value, onChange, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false)
 
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required
        />
        {/* type="button" обязателен: иначе кнопка внутри формы отправит её */}
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? 'Скрыть' : 'Показать'}
        </button>
      </div>
    </div>
  )
}
 
export default PasswordInput
 