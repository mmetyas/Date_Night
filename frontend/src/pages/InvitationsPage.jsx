import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAllInvitations, updateInvitation, deleteInvitation } from '../services/invitationService';

function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({ restaurantName: '', selectedDate: '' });

  useEffect(() => {
    async function loadInvitations() {
      try {
        setInvitations(await getAllInvitations());
      } catch (error) {
        console.error('Error fetching invitations:', error);
        setLoadError('We couldn’t load your plans. Check that the server is running and try again.');
      } finally {
        setIsLoading(false);
      }
    }
    loadInvitations();
  }, []);

  function startEditing(invitation) {
    setEditingId(invitation.id);
    setEditForm({ restaurantName: invitation.restaurantName, selectedDate: invitation.selectedDate });
    setActionError('');
    setSuccessMessage('');
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm({ restaurantName: '', selectedDate: '' });
    setActionError('');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editForm.restaurantName.trim() || !editForm.selectedDate) {
      setActionError('Please complete both fields.');
      return;
    }
    setSavingId(editingId);
    setActionError('');
    setSuccessMessage('');
    try {
      const updated = await updateInvitation(editingId, { restaurantName: editForm.restaurantName.trim(), selectedDate: editForm.selectedDate });
      setInvitations((current) => current.map((item) => item.id === editingId ? updated : item));
      setEditingId(null);
      setSuccessMessage('Your date has been updated. ♥');
    } catch (error) {
      console.error('Error updating invitation:', error);
      setActionError('We couldn’t update this date. Please try again.');
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this planned date?')) return;
    setDeletingId(id);
    setActionError('');
    setSuccessMessage('');
    try {
      await deleteInvitation(id);
      setInvitations((current) => current.filter((item) => item.id !== id));
      if (editingId === id) cancelEditing();
      setSuccessMessage('The date was removed from your plans.');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      setActionError('We couldn’t delete this date. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageLayout pageLabel="A collection of moments to look forward to">
      <section className="page-heading page-heading-row">
        <div><p className="eyebrow">THE LITTLE THINGS WE PLANNED</p><h1>Our <em>dates.</em></h1><p>Every plan is a memory waiting to happen.</p></div>
        <Link to="/restaurants" className="button button-dark">Plan another date ↗</Link>
      </section>

      {isLoading ? (
        <div className="state-panel"><span className="loader" /><p>Gathering your plans…</p></div>
      ) : loadError ? (
        <div className="state-panel state-error"><h2>Something went wrong</h2><p>{loadError}</p></div>
      ) : invitations.length === 0 ? (
        <div className="empty-panel"><span className="empty-icon">♡</span><p className="eyebrow">A FRESH PAGE</p><h2>Nothing planned <em>just yet.</em></h2><p>Your next lovely evening starts with a place and a date.</p><Link to="/restaurants" className="button button-dark">Plan your first date ↗</Link></div>
      ) : (
        <div className="plans-grid">
          {invitations.map((invitation, index) => (
            <article className="plan-card" key={invitation.id}>
              <div className="plan-card-top"><span>DATE NOTE · {String(index + 1).padStart(2, '0')}</span><span className="plan-heart">♥</span></div>
              {editingId === invitation.id ? (
                <form className="edit-form" onSubmit={handleUpdate}>
                  <h2>Edit this <em>plan.</em></h2>
                  <label className="field-label">Place<input name="restaurantName" value={editForm.restaurantName} onChange={handleFormChange} required maxLength={100} /></label>
                  <label className="field-label">Date<input type="date" name="selectedDate" value={editForm.selectedDate} onChange={handleFormChange} required /></label>
                  <div className="plan-actions"><button className="button button-dark" type="submit" disabled={savingId === invitation.id}>{savingId === invitation.id ? 'Saving…' : 'Save changes'}</button><button className="button button-quiet" type="button" onClick={cancelEditing} disabled={savingId === invitation.id}>Cancel</button></div>
                </form>
              ) : (
                <>
                  <p className="eyebrow">OUR NEXT LITTLE ADVENTURE</p>
                  <h2>{invitation.restaurantName}</h2>
                  <div className="plan-date"><span>✳</span><div><small>MARK YOUR CALENDAR</small><b>{invitation.selectedDate}</b></div></div>
                  <div className="plan-actions"><button className="button button-outline" onClick={() => startEditing(invitation)}>Edit plan ↗</button><button className="button button-danger-quiet" onClick={() => handleDelete(invitation.id)} disabled={deletingId === invitation.id}>{deletingId === invitation.id ? 'Removing…' : 'Delete'}</button></div>
                </>
              )}
            </article>
          ))}
        </div>
      )}

      {actionError && <p className="feedback feedback-error" role="alert">{actionError}</p>}
      {successMessage && <p className="feedback feedback-success" role="status">{successMessage}</p>}
      <div className="back-link-wrap"><Link to="/" className="text-link">← Back home</Link></div>
    </PageLayout>
  );
}

export default InvitationsPage;
