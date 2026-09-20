import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrganization } from '../api/organizations'
import { getFavorites } from '../api/favorites'
import { useAuth } from '../context/AuthContext'
import FavoriteButton from '../components/FavoriteButton'

function OrganizationDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [org, setOrg] = useState(null)
  const [favoriteId, setFavoriteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    const requests = [getOrganization(id)]
    if (user) requests.push(getFavorites())

    Promise.all(requests)
      .then(([orgResponse, favResponse]) => {
        setOrg(orgResponse.data)
        if (favResponse) {
          const favorites = favResponse.data.results ?? favResponse.data
          const found = favorites.find((f) => f.organization === Number(id))
          setFavoriteId(found ? found.id : null)
        }
      })
      .catch(() => setError('Не удалось загрузить организацию'))
      .finally(() => setLoading(false))
  }, [id, user])

  const handleFavoriteChange = (organizationId, isFavorite, newFavoriteId) => {
    setOrg((prev) => ({ ...prev, is_favorite: isFavorite }))
    setFavoriteId(newFavoriteId)
  }

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <Link to="/">← Назад в каталог</Link>
      <h1>{org.name}</h1>
      <p>Категория: {org.category_name}</p>
      <p>Адрес: {org.address}</p>
      <p>
        Телефон: <a href={`tel:${org.phone}`}>{org.phone}</a>
      </p>
      <p>{org.description}</p>
      <FavoriteButton
        organizationId={org.id}
        isFavorite={org.is_favorite}
        favoriteId={favoriteId}
        onChange={handleFavoriteChange}
      />
    </div>
  )
}

export default OrganizationDetailPage
