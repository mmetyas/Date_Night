
import { useState } from 'react';
import './App.css';
import RestaurantCard from './Components/RestaurantCard';
import restaurants from './data/restaurants';

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [invitationConfirmed, setInvitationConfirmed] = useState(false);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  function handleSelectRestaurant(restaurantId) {
    setSelectedRestaurantId(restaurantId);
    setInvitationConfirmed(false);
  }

  function handleConfirmInvitation() {
    if (!selectedRestaurantId || !selectedDate) {
      return;
    }

    setInvitationConfirmed(true);
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
          Pick the place and date, and I'll take care of the rest.
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

          <div className="date-section">
            <h2>When should we go? 📅</h2>

            <label htmlFor="date-night-date">
              Choose our special date
            </label>

            <input
              id="date-night-date"
              type="date"
              value={selectedDate}
              min={new Date().toLocaleDateString('en-CA')}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setInvitationConfirmed(false);
              }}
            />
          </div>

          <button
            className="invitation-button confirm-button"
            onClick={handleConfirmInvitation}
            disabled={!selectedRestaurantId || !selectedDate}
          >
            Confirm Our Date ❤️
          </button>

          {invitationConfirmed && (
            <div className="confirmation-message">
              <h2>It's a Date! ❤️</h2>
              <p>
                We're going to {selectedRestaurant.name}!
              </p>
              <p>
                Our date: {selectedDate}
              </p>
              <p>Can't wait to spend this time with you!</p>
            </div>
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
