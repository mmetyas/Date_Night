
import { useState } from 'react';
import './App.css';
import RestaurantCard from './Components/RestaurantCard';
import restaurants from './data/restaurants';

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  function handleSelectRestaurant(restaurantId) {
    setSelectedRestaurantId(restaurantId);
  }

  return (
    <main className="invitation-page">
      <section className="invitation-card">
        <div className="heart-icon">♥</div>

        <p className="eyebrow">A LITTLE SURPRISE FOR YOU</p>

        <h1>
          Date Night
          <span>Just Us Two</span>
        </h1>

        <p className="invitation-message">
          I'd love to take you on a special date.
          Pick the place, and I'll take care of the rest.
        </p>

        <div className="restaurant-section">
          <h2 className="restaurant-section-title">
            Where should we go?
          </h2>

          <p className="restaurant-section-description">
            Choose your favorite place for our special night.
          </p>

          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={handleSelectRestaurant}
                isSelected={selectedRestaurantId === restaurant.id}
              />
            ))}
          </div>

          {selectedRestaurantId !== null && (
            <p className="selection-message">
              Great choice! ❤️ Your place is selected.
            </p>
          )}
        </div>

        <p className="footer-message">
          Made with love, just for you.
        </p>
      </section>
    </main>
  );
}

export default App;
