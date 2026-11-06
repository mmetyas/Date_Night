
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';

import {
  getAllInvitations,
  updateInvitation,
  deleteInvitation,
} from '../services/invitationService';

function InvitationsPage() {
  // Invitations loaded from the backend
  const [invitations, setInvitations] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Error and success messages
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit form state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    restaurantName: '',
    selectedDate: '',
  });

  // Fetch invitations when the page loads
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

  // Open edit mode and fill the form
  function handleEditClick(invitation) {
    setEditingId(invitation.id);

    setEditForm({
      restaurantName: invitation.restaurantName,
      selectedDate: invitation.selectedDate,
    });

    setActionError('');
    setSuccessMessage('');
  }

  // Update form fields
  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingId(null);

    setEditForm({
      restaurantName: '',
      selectedDate: '',
    });

    setActionError('');
  }

  // Save invitation changes
  async function handleUpdateInvitation(event) {
    event.preventDefault();

    if (!editForm.restaurantName.trim() || !editForm.selectedDate) {
      setActionError('Please fill in all fields.');
      return;
    }

    setSavingId(editingId);
    setActionError('');
    setSuccessMessage('');

    try {
      const updatedInvitation = await updateInvitation(
        editingId,
        {
          restaurantName: editForm.restaurantName.trim(),
          selectedDate: editForm.selectedDate,
        }
      );

      setInvitations((currentInvitations) =>
        currentInvitations.map((invitation) =>
          invitation.id === editingId
            ? updatedInvitation
            : invitation
        )
      );

      setEditingId(null);

      setEditForm({
        restaurantName: '',
        selectedDate: '',
      });

      setSuccessMessage('Your date was updated successfully! ❤️');
    } catch (error) {
      console.error('Error updating invitation:', error);
      setActionError(
        'Could not update this date. Please try again.'
      );
    } finally {
      setSavingId(null);
    }
  }

  // Delete invitation
  async function handleDeleteInvitation(invitationId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this date?'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(invitationId);
    setActionError('');
    setSuccessMessage('');

    try {
      await deleteInvitation(invitationId);

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) => invitation.id !== invitationId
        )
      );

      if (editingId === invitationId) {
        handleCancelEdit();
      }

      setSuccessMessage('Your date was deleted successfully.');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      setActionError(
        'Could not delete this date. Please try again.'
      );
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
        <div className="empty-state">
          <h2>No dates planned yet 💌</h2>
          <p>Let's create our first special date!</p>
        </div>
      ) : (
        <div className="saved-invitations-list">
          {invitations.map((invitation) => (
            <article
              className="saved-invitation-card"
              key={invitation.id}
            >
              {editingId === invitation.id ? (
                <form
                  className="edit-invitation-form"
                  onSubmit={handleUpdateInvitation}
                >
                  <h2>Edit Our Date ✏️</h2>

                  <label htmlFor={`restaurant-${invitation.id}`}>
                    Restaurant Name
                  </label>

                  <input
                    id={`restaurant-${invitation.id}`}
                    type="text"
                    name="restaurantName"
                    value={editForm.restaurantName}
                    onChange={handleEditChange}
                    required
                  />

                  <label htmlFor={`date-${invitation.id}`}>
                    Date
                  </label>

                  <input
                    id={`date-${invitation.id}`}
                    type="date"
                    name="selectedDate"
                    value={editForm.selectedDate}
                    onChange={handleEditChange}
                    required
                  />

                  <div className="invitation-actions">
                    <button
                      type="submit"
                      className="save-button"
                      disabled={savingId === invitation.id}
                    >
                      {savingId === invitation.id
                        ? 'Saving...'
                        : 'Save Changes ❤️'}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelEdit}
                      disabled={savingId === invitation.id}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>{invitation.restaurantName}</h2>

                  <p>📅 Date: {invitation.selectedDate}</p>

                  <div className="invitation-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(invitation)}
                      disabled={deletingId === invitation.id}
                    >
                      Edit ✏️
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteInvitation(invitation.id)
                      }
                      disabled={deletingId === invitation.id}
                    >
                      {deletingId === invitation.id
                        ? 'Deleting...'
                        : 'Delete 🗑️'}
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}

      {actionError && (
        <p className="error-message" role="alert">
          {actionError}
        </p>
      )}

      {successMessage && (
        <p className="success-message" role="status">
          {successMessage}
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
