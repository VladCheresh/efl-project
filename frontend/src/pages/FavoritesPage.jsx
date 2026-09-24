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

  // Когда сердечко снято, карточка сразу исчезает из списка,
  // без повторного запроса к серверу
  const handleFavoriteChange = (organizationId, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prev) =>
        prev.filter((favorite) => favorite.organization !== organizationId)
      )
    }
  }

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error) return <p className="state-message state-error">{error}</p>

  return (
    <div>
      <section className="page-hero">
        <h1>Моё избранное</h1>
        <p className="page-subtitle">Организации, которые вы отметили сердечком</p>
      </section>

      {favorites.length === 0 && (
        <div className="empty-state">
          <p>В избранном пока пусто.</p>
          <Link to="/" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      )}

      <div className="card-grid">
        {favorites.map((favorite) => (
          <OrganizationCard
            key={favorite.id}
            organization={favorite.organization_detail}
            favoriteId={favorite.id}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
