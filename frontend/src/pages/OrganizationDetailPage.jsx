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

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error) return <p className="state-message state-error">{error}</p>

  return (
    <div className="detail">
      <Link to="/" className="back-link">
        ← Назад в каталог
      </Link>

      <div className="detail-header">
        <div>
          {org.category_name && <span className="badge">{org.category_name}</span>}
          <h1 className="detail-title">{org.name}</h1>
        </div>
        <FavoriteButton
          organizationId={org.id}
          isFavorite={org.is_favorite}
          favoriteId={favoriteId}
          onChange={handleFavoriteChange}
        />
      </div>

      <dl className="info-list">
        <div className="info-row">
          <dt>Адрес</dt>
          <dd>{org.address}</dd>
        </div>
        <div className="info-row">
          <dt>Телефон</dt>
          <dd>
            <a href={`tel:${org.phone}`}>{org.phone}</a>
          </dd>
        </div>
      </dl>

      <p className="detail-description">{org.description}</p>
    </div>
  )
}

export default OrganizationDetailPage
