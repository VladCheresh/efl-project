import { useState, useEffect, useCallback } from 'react'
import { getOrganizations, getCategories } from '../api/organizations'
import { getFavorites } from '../api/favorites'
import { useAuth } from '../context/AuthContext'
import OrganizationCard from '../components/OrganizationCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'

function CatalogPage() {
  const [organizations, setOrganizations] = useState([])
  const [categories, setCategories] = useState([])
  const [favoriteMap, setFavoriteMap] = useState({})
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response.data.results ?? response.data))
      .catch(() => {})
  }, [])

  const loadOrganizations = useCallback(() => {
    setLoading(true)
    setError('')

    const params = {}
    if (category) params.category = category
    if (search) params.search = search
    if (user && onlyFavorites) params.is_favorite = true

    const requests = [getOrganizations(params)]
    if (user) {
      requests.push(getFavorites())
    }

    Promise.all(requests)
      .then(([orgResponse, favResponse]) => {
        setOrganizations(orgResponse.data.results ?? orgResponse.data)

        if (favResponse) {
          const favorites = favResponse.data.results ?? favResponse.data
          const map = {}
          favorites.forEach((favorite) => {
            map[favorite.organization] = favorite.id
          })
          setFavoriteMap(map)
        } else {
          setFavoriteMap({})
        }
      })
      .catch(() => setError('Не удалось загрузить организации'))
      .finally(() => setLoading(false))
  }, [category, search, onlyFavorites, user])

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const handleFavoriteChange = (organizationId, isFavorite, favoriteId) => {
    setOrganizations((prev) => {
      const updated = prev.map((org) =>
        org.id === organizationId ? { ...org, is_favorite: isFavorite } : org
      )
      // если включён режим "только избранное" и юзер убрал сердечко — сразу убираем карточку из списка
      return onlyFavorites ? updated.filter((org) => org.is_favorite) : updated
    })
    setFavoriteMap((prev) => {
      const next = { ...prev }
      if (isFavorite) {
        next[organizationId] = favoriteId
      } else {
        delete next[organizationId]
      }
      return next
    })
  }

    return (
    <div>
      <section className="page-hero">
        <h1>Каталог организаций</h1>
        <p className="page-subtitle">
          Государственные и муниципальные организации города Евпатория: адреса, телефоны, категории
        </p>
      </section>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />

        {user && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(event) => setOnlyFavorites(event.target.checked)}
            />
            <span>Только избранное</span>
          </label>
        )}
      </div>

      {loading && <p className="state-message">Загрузка...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && !error && organizations.length === 0 && (
        <p className="state-message">Ничего не найдено</p>
      )}

      {!loading && !error && organizations.length > 0 && (
        <p className="results-count">Найдено организаций: {organizations.length}</p>
      )}

      <div className="card-grid">
        {organizations.map((organization) => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            favoriteId={favoriteMap[organization.id]}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  )
}

export default CatalogPage
