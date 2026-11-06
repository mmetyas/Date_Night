function RestaurantCard({ restaurant, onSelect, isSelected }) {
  return (
    <article className={`restaurant-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="restaurant-image-wrap">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
        <span className="restaurant-emoji">{restaurant.emoji}</span>
        {isSelected && <span className="selected-pill">Selected ✓</span>}
      </div>
      <div className="restaurant-card-body">
        <p className="card-eyebrow">{restaurant.category}</p>
        <h3>{restaurant.name}</h3>
        <p className="restaurant-description">{restaurant.description}</p>
        <button className={isSelected ? 'button button-dark button-full' : 'button button-outline button-full'} onClick={() => onSelect(restaurant.id)}>
          {isSelected ? 'Selected for our date ✓' : 'Choose this place'}
        </button>
      </div>
    </article>
  );
}

export default RestaurantCard;
