
import { useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../Components/RestaurantCard';
import restaurants from '../data/restaurants';

function RestaurantsPage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [invitationConfirmed, setInvitationConfirmed] = useState(false);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  function handleSelectRestaurant(restaurantId) {
    setSelectedRestaurantId(restaurantId);
    setInvitationConfirmed(false);
    setSaveError('');
  }

  async function handleConfirmInvitation() {
    if (!selectedRestaurant || !selectedDate) {
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setInvitationConfirmed(false);

    try {
      const response = await fetch(
        'http://localhost:8080/api/date-night/invitations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantName: selectedRestaurant.name,
            selectedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save the invitation.');
      }

      await response.json();
      setInvitationConfirmed(true);
    } catch (error) {
      console.error('Error saving invitation:', error);
      setSaveError('Could not save your invitation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="invitation-page">
      <section className="invitation-card">
        <h1>Plan Our Date ❤️</h1>

        <p className="invitation-message">
          Choose our restaurant and the date for our special night.
        </p>

        <div className="restaurant-section">
          <h2 className="restaurant-section-title">
            Where should we go?
          </h2>

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
                setSaveError('');
              }}
            />
          </div>

          <button
            className="invitation-button confirm-button"
            onClick={handleConfirmInvitation}
            disabled={!selectedRestaurant || !selectedDate || isSaving}
          >
            {isSaving ? 'Saving...' : 'Confirm Our Date ❤️'}
          </button>

          {saveError && (
            <p className="error-message" role="alert">
              {saveError}
            </p>
          )}

          {invitationConfirmed && (
            <div className="confirmation-message">
              <h2>It's a Date! ❤️</h2>
              <p>We're going to {selectedRestaurant.name}!</p>
              <p>Our date: {selectedDate}</p>
              <p>Can't wait to spend this time with you!</p>
              <Link to="/invitations">View our planned dates</Link>
            </div>
          )}
        </div>

        <p className="footer-message">Made with love, just for you.</p>

        <Link to="/">Back to Home</Link>
      </section>
    </main>
  );
}

export default RestaurantsPage;
