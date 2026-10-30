
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';
import {
  getAllInvitations,
  deleteInvitation,
} from '../Services/invitationService';

function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const data = await getAllInvitations();
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

  async function handleDeleteInvitation(invitationId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this date?'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(invitationId);
    setDeleteError('');

    try {
      await deleteInvitation(invitationId);

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) => invitation.id !== invitationId
        )
      );
    } catch (error) {
      console.error('Error deleting invitation:', error);
      setDeleteError('Could not delete this date. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageLayout>
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

              <button
                className="delete-button"
                onClick={() =>
                  handleDeleteInvitation(invitation.id)
                }
                disabled={deletingId === invitation.id}
              >
                {deletingId === invitation.id
                  ? 'Deleting...'
                  : 'Delete Date 🗑️'}
              </button>
            </article>
          ))}
        </div>
      )}

      {deleteError && (
        <p className="error-message" role="alert">
          {deleteError}
        </p>
      )}

      <div className="home-actions">
        <Link to="/restaurants" className="invitation-button">
          Plan Another Date ❤️
        </Link>

        <Link to="/" className="invitation-button">
          Back to Home
        </Link>
      </div>
    </PageLayout>
  );
}

export default InvitationsPage;
