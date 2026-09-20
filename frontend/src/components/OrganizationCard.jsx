import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

function OrganizationCard({ organization, favoriteId, onFavoriteChange }) {
  return (
    <div>
      <h3>
        <Link to={`/organizations/${organization.id}`}>{organization.name}</Link>
      </h3>
      <p>{organization.address}</p>
      <p>{organization.phone}</p>
      <FavoriteButton
        organizationId={organization.id}
        isFavorite={organization.is_favorite}
        favoriteId={favoriteId}
        onChange={onFavoriteChange}
      />
    </div>
  )
}

export default OrganizationCard
