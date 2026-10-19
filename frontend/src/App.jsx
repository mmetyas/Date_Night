
import { useState, useEffect } from 'react';
import './App.css';
import RestaurantCard from './Components/RestaurantCard';
import restaurants from './data/restaurants';

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [invitationConfirmed, setInvitationConfirmed] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [invitations, setInvitations] = useState([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/date-night/hello')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch message');
        }

        return response.text();
      })
      .then((message) => {
        setBackendMessage(message);
      })
      .catch((error) => {
        console.error('Backend error:', error);
      });
  }, []);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const response = await fetch(
          'http://localhost:8080/api/date-night/invitations'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch invitations.');
        }

        const data = await response.json();
        setInvitations(data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      } finally {
        setIsLoadingInvitations(false);
      }
    }

    fetchInvitations();
  }, []);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  function handleSelectRestaurant(restaurantId) {
    setSelectedRestaurantId(restaurantId);
    setInvitationConfirmed(false);
  }

  async function handleConfirmInvitation() {
    if (!selectedRestaurantId || !selectedDate) {
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
            selectedDate: selectedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save the invitation.');
      }

      const savedInvitation = await response.json();

      console.log('Invitation saved:', savedInvitation);

      setInvitations((previousInvitations) => [
        ...previousInvitations,
        savedInvitation,
      ]);

      setInvitationConfirmed(true);
    } catch (error) {
      console.error('Error saving invitation:', error);
      setSaveError(
        'Could not save your invitation. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
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

        {backendMessage && (
          <p className="backend-message">
            {backendMessage}
          </p>
        )}

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
            disabled={!selectedRestaurantId || !selectedDate || isSaving}
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



        <section className="saved-invitations">
          <h2>Our Planned Dates 💕</h2>

          {isLoadingInvitations ? (
            <p>Loading our plans...</p>
          ) : invitations.length === 0 ? (
            <p>No dates planned yet. Let's create our first one!</p>
          ) : (
            <div className="saved-invitations-list">
              {invitations.map((invitation) => (
                <article
                  className="saved-invitation-card"
                  key={invitation.id}
                >
                  <h3>{invitation.restaurantName}</h3>
                  <p>
                    📅 Date: {invitation.selectedDate}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>



        <p className="footer-message">
          Made with love, just for you.
        </p>
      </section>
    </main>
  );
}

export default App;
