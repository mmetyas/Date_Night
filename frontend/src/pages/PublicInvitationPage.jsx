
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

import PageLayout from '../components/PageLayout';
import RestaurantCard from '../components/RestaurantCard';

import restaurants from '../data/restaurants';

import {
  getPublicInvitation,
  respondToPublicInvitation,
} from '../services/invitationService';

function formatInvitationDate(dateString) {
  if (!dateString) {
    return '';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function celebrate() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const colors = ['#b77e83', '#75434f', '#f3d6d0', '#e8c07d', '#ffffff'];
  const end = Date.now() + 1800;

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors, shapes: ['circle', 'square'] });
}

function PublicInvitationPage() {
  const { token } = useParams();

  const [invitation, setInvitation] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInvitation() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getPublicInvitation(token);

        setInvitation(data);
      } catch (err) {
        console.error('Error loading invitation:', err);

        setError(
          'This invitation could not be found or is no longer available.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInvitation();
  }, [token]);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  async function handleRespond(status) {
    if (status === 'ACCEPTED' && !selectedRestaurant) {
      setError('Please choose a restaurant first.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await respondToPublicInvitation(token, {
        status,
        restaurantName:
          status === 'ACCEPTED' ? selectedRestaurant.name : null,
      });

      setInvitation(response);

      if (response.status === 'ACCEPTED') {
        celebrate();
      }
    } catch (err) {
      console.error('Error responding to invitation:', err);

      setError(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <PageLayout pageLabel="A little surprise" minimal>
        <div className="state-panel">
          <span className="loader" />
          <p>Preparing your surprise… ♥</p>
          <p className="form-hint">This can take a few moments.</p>
        </div>
      </PageLayout>
    );
  }

  if (!invitation) {
    return (
      <PageLayout pageLabel="A little surprise" minimal>
        <div className="state-panel">
          <h2>Oops!</h2>
          <p>{error || 'Invitation not found.'}</p>
        </div>
      </PageLayout>
    );
  }

  const hasResponded = invitation.status !== 'PENDING';

  return (
    <PageLayout pageLabel="A little surprise" minimal>
      <section className="page-heading">
        <p className="eyebrow">A SPECIAL INVITATION</p>

        {invitation.guestName ? (
          <h1>
            Happy Birthday, <em>{invitation.guestName}!</em> ♥
          </h1>
        ) : (
          <h1>
            Someone has a <em>date</em> in mind. ♥
          </h1>
        )}

        <p>
          You're invited to a special evening.
          The only thing left is choosing where to go.
        </p>
      </section>

      {invitation.personalMessage && (
        <section className="love-note">
          <span className="love-note-mark" aria-hidden="true">♥</span>
          <p>{invitation.personalMessage}</p>
        </section>
      )}

      <section className="booking-panel">
        <p className="eyebrow">SAVE THE DATE</p>

        <h2>{formatInvitationDate(invitation.selectedDate)}</h2>

        <p>
        E5tary nty b2a 3la mzagk 3shan ana msh 3arf bs 7ass EVORA da koayes bayn 😄😄 
        </p>
      </section>

      {hasResponded ? (
        <section className="state-panel invitation-result">
          {invitation.status === 'ACCEPTED' ? (
            <>
                 <h2>Yalla bena ya Amooooomiiii 😄 🎂 ❤️</h2>
              <p>
                You chose{' '}
                <strong>{invitation.respondedRestaurant}</strong>.
                Get ready for a lovely evening!
              </p>
            </>
          ) : (
            <>
              <h2>Maybe another time ♥</h2>

              <p>Your response has been saved.</p>
            </>
          )}
        </section>
      ) : (
        <>
          <section className="page-heading">
            <p className="eyebrow">YOUR CHOICE</p>

            <h2>
          t7by tro7y fen b2a 🥰🥰
            </h2>

            <p>Pick your favorite place for our date.</p>
          </section>

          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={setSelectedRestaurantId}
                isSelected={selectedRestaurantId === restaurant.id}
              />
            ))}
          </div>

          {selectedRestaurant && (
            <p className="form-hint">
              Your choice:{' '}
              <strong>{selectedRestaurant.name}</strong>
            </p>
          )}

          {error && (
            <p className="feedback feedback-error" role="alert">
              {error}
            </p>
          )}

          <section className="booking-panel invitation-actions">
            <h2>So, what do you say?</h2>

            <div className="booking-controls">
              <button
                type="button"
                className="button button-dark"
                disabled={!selectedRestaurant || isSubmitting}
                onClick={() => handleRespond('ACCEPTED')}
              >
                {isSubmitting ? 'Sending...' : "Yalla binaaa 🎂❤️"}
              </button>

              <button
                type="button"
                className="button button-outline"
                disabled={isSubmitting}
                onClick={() => handleRespond('DECLINED')}
              >
                Maybe another time
              </button>
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}

export default PublicInvitationPage;
