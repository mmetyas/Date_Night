
import { useState } from 'react';
import { Link } from 'react-router-dom';

import RestaurantCard from '../components/RestaurantCard';
import PageLayout from '../components/PageLayout';
import RestaurantMap from '../components/RestaurantMap';

import restaurants from '../data/restaurants';
import { createInvitation } from '../services/invitationService'

function RestaurantsPage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [createdInvitation, setCreatedInvitation] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  function handleSelectRestaurant(restaurantId) {
    setSelectedRestaurantId(restaurantId);
    setCreatedInvitation(null);
    setLinkCopied(false);
    setSaveError('');
  }

  async function handleConfirmInvitation(event) {
    event.preventDefault();

    if (!selectedRestaurant || !selectedDate) {
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setCreatedInvitation(null);
    setLinkCopied(false);

    try {
      const invitation = await createInvitation({
        restaurantName: selectedRestaurant.name,
        selectedDate,
      });

      setCreatedInvitation(invitation);
    } catch (error) {
      console.error('Error saving invitation:', error);
      setSaveError('We couldn’t save your date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCopyInvitationLink() {
    if (!createdInvitation?.invitationToken) {
      return;
    }

    const invitationLink =
      `${window.location.origin}/invite/${createdInvitation.invitationToken}`;

    try {
      await navigator.clipboard.writeText(invitationLink);
      setLinkCopied(true);
      setSaveError('');
    } catch (error) {
      console.error('Could not copy invitation link:', error);
      setSaveError(
        'Could not copy the link. Please copy it from the address below.'
      );
    }
  }

  const invitationLink = createdInvitation?.invitationToken
    ? `${window.location.origin}/invite/${createdInvitation.invitationToken}`
    : '';

  return (
    <PageLayout pageLabel="Choose the setting for your next memory">
      <section className="page-heading">
        <p className="eyebrow">FIRST, THE WHERE</p>

        <h1>
          Where shall we <em>go?</em>
        </h1>

        <p>
          Pick the kind of evening that feels just right.
          You can choose the day below.
        </p>
      </section>

      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onSelect={handleSelectRestaurant}
            isSelected={selectedRestaurantId === restaurant.id}
          />
        ))}
      </div>

      <RestaurantMap
        restaurants={restaurants}
        selectedRestaurantId={selectedRestaurantId}
        onSelectRestaurant={handleSelectRestaurant}
      />

      <form className="booking-panel" onSubmit={handleConfirmInvitation}>
        <div className="booking-intro">
          <span className="section-number">02</span>

          <div>
            <p className="eyebrow">THEN, THE WHEN</p>

            <h2>
              Save the <em>date.</em>
            </h2>

            <p>A day to look forward to.</p>
          </div>
        </div>

        <div className="booking-controls">
          <label className="field-label" htmlFor="date-night-date">
            Our date

            <input
              id="date-night-date"
              type="date"
              value={selectedDate}
              min={new Date().toLocaleDateString('en-CA')}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setCreatedInvitation(null);
                setLinkCopied(false);
                setSaveError('');
              }}
              required
            />
          </label>

          <button
            className="button button-dark"
            type="submit"
            disabled={!selectedRestaurant || !selectedDate || isSaving}
          >
            {isSaving ? 'Saving your date…' : 'Make it a date ↗'}
          </button>
        </div>

        {!selectedRestaurant && (
          <p className="form-hint">
            Choose a place above to continue.
          </p>
        )}

        {saveError && (
          <p className="feedback feedback-error" role="alert">
            {saveError}
          </p>
        )}

        {createdInvitation && (
          <div className="feedback feedback-success" role="status">
            <b>It’s a date. ♥</b>

            <p>
              Your invitation is ready! Send this private link
              to your wife so she can choose her restaurant and respond.
            </p>

            <button
              type="button"
              className="button button-dark"
              onClick={handleCopyInvitationLink}
            >
              {linkCopied ? 'Link copied ✓' : 'Copy invitation link ↗'}
            </button>

            <p className="invitation-link-text">
              {invitationLink}
            </p>
          </div>
        )}
      </form>

      <div className="back-link-wrap">
        <Link to="/" className="text-link">
          ← Back home
        </Link>
      </div>
    </PageLayout>
  );
}

export default RestaurantsPage;
