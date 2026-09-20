import api from './axios'

export const getFavorites = () =>
  api.get('/favorites/')

export const addFavorite = (organizationId) =>
  api.post('/favorites/', { organization: organizationId })

export const removeFavorite = (favoriteId) =>
  api.delete(`/favorites/${favoriteId}/`)
