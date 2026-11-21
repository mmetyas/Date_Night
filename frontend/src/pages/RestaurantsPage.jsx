
import { useState } from 'react';
import { Link } from 'react-router-dom';

import RestaurantCard from '../components/RestaurantCard';
import PageLayout from '../components/PageLayout';
import RestaurantMap from '../components/RestaurantMap';
import AdminKeyPrompt from '../components/AdminKeyPrompt';

import restaurants from '../data/restaurants';
import {
  isAdminKeyError,
  createInvitation,
  getInvitationLink,
} from '../services/invitationService';

function RestaurantsPage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [needsAdminKey, setNeedsAdminKey] = useState(false);

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

  async function saveInvitation() {
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
        guestName: guestName.trim(),
        personalMessage: personalMessage.trim(),
      });

      setCreatedInvitation(invitation);
    } catch (error) {
      if (isAdminKeyError(error)) {
        setNeedsAdminKey(true);
        return;
      }
      console.error('Error saving invitation:', error);
      setSaveError('We couldn’t save your date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleConfirmInvitation(event) {
    event.preventDefault();
    saveInvitation();
  }

  function handleAdminKeySaved() {
    setNeedsAdminKey(false);
    saveInvitation();
  }

  async function handleCopyInvitationLink() {
    if (!createdInvitation?.invitationToken) {
      return;
    }

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

  const invitationLink = getInvitationLink(createdInvitation?.invitationToken);

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

        <div className="personal-fields">
          <label className="field-label" htmlFor="guest-name">
            Her name (optional)
            <input
              id="guest-name"
              type="text"
              maxLength={50}
              value={guestName}
              placeholder="She'll see “Happy Birthday, …!”"
              onChange={(event) => setGuestName(event.target.value)}
            />
          </label>

          <label className="field-label" htmlFor="personal-message">
            A personal message (optional)
            <textarea
              id="personal-message"
              rows={3}
              maxLength={500}
              value={personalMessage}
              placeholder="A few words from the heart…"
              onChange={(event) => setPersonalMessage(event.target.value)}
            />
          </label>
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

      {needsAdminKey && (
        <AdminKeyPrompt
          onSaved={handleAdminKeySaved}
          message="Enter your secret key to create the invitation. It will be remembered on this device."
        />
      )}

      <div className="back-link-wrap">
        <Link to="/" className="text-link">
          ← Back home
        </Link>
      </div>
    </PageLayout>
  );
}

export default RestaurantsPage;
