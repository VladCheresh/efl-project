import api from './axios'

export const getOrganizations = (params = {}) =>
  api.get('/organizations/', { params })

export const getOrganization = (id) =>
  api.get(`/organizations/${id}/`)

export const getCategories = () =>
  api.get('/categories/')
