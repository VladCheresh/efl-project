import { useState, useEffect } from 'react'
import { getOrganizations, getCategories } from '../api/organizations'
import { getFavorites } from '../api/favorites'
import { useAuth } from '../hooks/useAuth'
import OrganizationCard from '../components/OrganizationCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'

function CatalogPage() {
  const [organizations, setOrganizations] = useState([])
  const [categories, setCategories] = useState([])
  // Соответствие «id организации → id записи в избранном»:
  // оно нужно кнопке-сердечку, чтобы удалить именно эту запись
  const [favoriteMap, setFavoriteMap] = useState({})
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  // Ключ текущего успешно завершённого запроса.
  // Используется для определения состояния загрузки.
  const [loadedKey, setLoadedKey] = useState(null)
  const [errorState, setErrorState] = useState({
    key: null,
    message: '',
  })

  const { user } = useAuth()

  const requestKey = `${user?.id ?? 'guest'}:${category}:${search}:${user ? onlyFavorites : false}`

  const loading = loadedKey !== requestKey
  const error =
    errorState.key === requestKey ? errorState.message : ''
  // response.data.results ?? response.data:
  // подстраховка на случай,
  // если в DRF включим пагинацию.
  // Сейчас она выключена, приходит обычный список.
  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response.data.results ?? response.data))
      // при сбое просто не будет фильтра по категориям, каталог работает
      .catch(() => {})
  }, [])

  // Загружаем организации при изменении фильтров или пользователя.
  // При наличии авторизации дополнительно получаем список избранного.
  useEffect(() => {
    let cancelled = false

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
        if (cancelled) return

        setOrganizations(
          orgResponse.data.results ?? orgResponse.data
        )

        if (favResponse) {
          const favorites =
            favResponse.data.results ?? favResponse.data

          const map = {}

          favorites.forEach((favorite) => {
            map[favorite.organization] = favorite.id
          })

          setFavoriteMap(map)
        } else {
          setFavoriteMap({})
        }

        setErrorState({
          key: null,
          message: '',
        })

        setLoadedKey(requestKey)
      })
      .catch(() => {
        if (cancelled) return

        setErrorState({
          key: requestKey,
          message: 'Не удалось загрузить организации',
        })

        setLoadedKey(requestKey)
      })

    return () => {
      cancelled = true
    }
  }, [category, search, onlyFavorites, user, requestKey])

  // Сердечко обновляем локально, без повторной загрузки всего списка
  const handleFavoriteChange = (organizationId, isFavorite, favoriteId) => {
    setOrganizations((prev) => {
      const updated = prev.map((org) =>
        org.id === organizationId ? { ...org, is_favorite: isFavorite } : org
      )
      // если включен режим "только избранное" и пользователь убрал сердечко —
      // сразу убираем карточку из списка
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
