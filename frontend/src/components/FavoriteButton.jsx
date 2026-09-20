import { useState } from 'react'
import { addFavorite, removeFavorite } from '../api/favorites'
import { useAuth } from '../context/AuthContext'

function FavoriteButton({ organizationId, isFavorite, favoriteId, onChange }) {
  const [pending, setPending] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const handleClick = async () => {
    setPending(true)
    try {
      if (isFavorite) {
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
    <button onClick={handleClick} disabled={pending}>
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton
