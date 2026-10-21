
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

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
        setLoadError(
          'Could not load your planned dates. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvitations();
  }, []);

  return (
    <main className="invitation-page">
      <section className="invitation-card">
        <h1>Our Planned Dates 💕</h1>

        <p className="invitation-message">
          Every date is another beautiful memory waiting to happen.
        </p>

        {isLoading ? (
          <p>Loading our plans...</p>
        ) : loadError ? (
          <p className="error-message" role="alert">
            {loadError}
          </p>
        ) : invitations.length === 0 ? (
          <p>No dates planned yet. Let's create our first one!</p>
        ) : (
          <div className="saved-invitations-list">
            {invitations.map((invitation) => (
              <article
                className="saved-invitation-card"
                key={invitation.id}
              >
                <h2>{invitation.restaurantName}</h2>
                <p>📅 Date: {invitation.selectedDate}</p>
              </article>
            ))}
          </div>
        )}

        <div className="home-actions">
          <Link to="/restaurants" className="invitation-button">
            Plan Another Date ❤️
          </Link>

          <Link to="/" className="invitation-button">
            Back to Home
          </Link>
        </div>

        <p className="footer-message">Made with love, just for you.</p>
      </section>
    </main>
  );
}

export default InvitationsPage;

