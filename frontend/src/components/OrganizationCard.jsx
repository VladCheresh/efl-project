import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

function OrganizationCard({ organization, favoriteId, onFavoriteChange }) {
  return (
    <article className="card">
      <div className="card-body">
        {organization.category_name && (
          <span className="badge">{organization.category_name}</span>
        )}
        <h3 className="card-title">
          <Link to={`/organizations/${organization.id}`}>{organization.name}</Link>
        </h3>
        <p className="card-line">{organization.address}</p>
        <p className="card-line">{organization.phone}</p>
      </div>
      <FavoriteButton
        organizationId={organization.id}
        isFavorite={organization.is_favorite}
        favoriteId={favoriteId}
        onChange={onFavoriteChange}
      />
    </article>
  )
}

export default OrganizationCard
