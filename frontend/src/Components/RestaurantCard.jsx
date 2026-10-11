
function RestaurantCard({ restaurant, onSelect, isSelected }) {
  return (
    <article className={`restaurant-card ${isSelected ? 'selected' : ''}`}>
      <div className="restaurant-emoji">{restaurant.emoji}</div>

      <h2>{restaurant.name}</h2>

      <p className="restaurant-description">
        {restaurant.description}
      </p>

      <button
        className="restaurant-button"
        onClick={() => onSelect(restaurant.id)}
      >
        {isSelected ? 'Selected ❤️' : 'Choose This Place'}
      </button>
    </article>
  );
}

export default RestaurantCard;
