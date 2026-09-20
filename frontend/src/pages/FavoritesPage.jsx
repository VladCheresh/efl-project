import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites } from '../api/favorites'
import OrganizationCard from '../components/OrganizationCard'


function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getFavorites()
      .then((response) => setFavorites(response.data.results ?? response.data))
      .catch(() => setError('Не удалось загрузить избранное'))
      .finally(() => setLoading(false))
  }, [])

  const handleFavoriteChange = (organizationId, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prev) =>
        prev.filter((favorite) => favorite.organization !== organizationId)
      )
    }
  }

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <Link to="/">← Назад в каталог</Link>
      <h1>Моё избранное</h1>

      {favorites.length === 0 && (
        <p>
          В избранном пока пусто. <Link to="/">Перейти в каталог</Link>
        </p>
      )}

      {favorites.map((favorite) => (
        <OrganizationCard
          key={favorite.id}
          organization={favorite.organization_detail}
          favoriteId={favorite.id}
          onFavoriteChange={handleFavoriteChange}
        />
      ))}
    </div>
  )
}

export default FavoritesPage
