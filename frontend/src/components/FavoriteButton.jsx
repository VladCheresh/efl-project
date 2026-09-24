import { useState } from 'react'
import { addFavorite, removeFavorite } from '../api/favorites'
import { useAuth } from '../hooks/useAuth'

function FavoriteButton({ organizationId, isFavorite, favoriteId, onChange }) {
  // pending блокирует кнопку на время запроса,
  // чтобы двойной клик не отправил запрос дважды
  const [pending, setPending] = useState(false)
  const { user } = useAuth()

  // Избранное доступно только вошедшим:
  // остальным кнопку не показываем
  if (!user) {
    return null
  }

  const handleClick = async () => {
    setPending(true)
    try {
      if (isFavorite) {
        // Для удаления нужен id записи избранного, а не id организации
        await removeFavorite(favoriteId)
        onChange(organizationId, false, null)
      } else {
        const response = await addFavorite(organizationId)
        onChange(organizationId, true, response.data.id)
      }
    } catch {
      // если что-то пошло не так — просто не меняем состояние
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      className={`favorite-btn${isFavorite ? ' is-active' : ''}`}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton
