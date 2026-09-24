import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrganization } from '../api/organizations'
import { getFavorites } from '../api/favorites'
import { useAuth } from '../hooks/useAuth'
import FavoriteButton from '../components/FavoriteButton'

function OrganizationDetailPage() {
  const [org, setOrg] = useState(null)
  // id записи в избранном (null, если организации там нет):
  // нужен для удаления
  const [favoriteId, setFavoriteId] = useState(null)
  // ID организации, для которой успешно завершилась загрузка.
  const [loadedId, setLoadedId] = useState(null)
  const [errorState, setErrorState] = useState({
    id: null,
    message: '',
  })
  const { id } = useParams()
  const { user } = useAuth()

  const currentId = Number(id)

  const loading =
    loadedId !== currentId && errorState.id !== currentId

  const error =
    errorState.id === currentId ? errorState.message : ''

  useEffect(() => {
    let cancelled = false

    // Загружаем данные организации и ее избранное.
    // При смене организации или пользователя выполняем новый запрос.
    const requests = [getOrganization(id)]

    if (user) {
      requests.push(getFavorites())
    }

    Promise.all(requests)
      .then(([orgResponse, favResponse]) => {
        if (cancelled) return

        setOrg(orgResponse.data)

        if (favResponse) {
          const favorites =
            favResponse.data.results ?? favResponse.data
          // id из адреса приходит строкой,
          // а favorite.organization числом
          const found = favorites.find(
            (favorite) => favorite.organization === Number(id)
          )
          setFavoriteId(found ? found.id : null)
        } else {
          setFavoriteId(null)
        }

        setErrorState({
          id: null,
          message: '',
        })

        setLoadedId(Number(id))
      })
      .catch(() => {
        if (cancelled) return

        setErrorState({
          id: Number(id),
          message: 'Не удалось загрузить организацию'
        })

        setLoadedId(Number(id))
      })
    return () => {
      cancelled = true
    }
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
