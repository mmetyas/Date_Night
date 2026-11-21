import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import AdminKeyPrompt from '../components/AdminKeyPrompt';
import {
  AdminKeyError,
  getAllInvitations,
  updateInvitation,
  deleteInvitation,
  getInvitationLink,
} from '../services/invitationService';

const EMPTY_FORM = { restaurantName: '', selectedDate: '', guestName: '', personalMessage: '' };

const STATUS_LABELS = {
  PENDING: 'Waiting for her answer',
  ACCEPTED: 'Accepted ♥',
  DECLINED: 'Maybe another time',
};

function formatRespondedAt(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [needsAdminKey, setNeedsAdminKey] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    async function loadInvitations() {
      try {
        setInvitations(await getAllInvitations());
      } catch (error) {
        if (error instanceof AdminKeyError) {
          setNeedsAdminKey(true);
        } else {
          console.error('Error fetching invitations:', error);
          setLoadError('We couldn’t load your plans. Check that the server is running and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadInvitations();
  }, [reloadCount]);

  function handleAdminKeySaved() {
    setIsLoading(true);
    setLoadError('');
    setNeedsAdminKey(false);
    setReloadCount((count) => count + 1);
  }

  function handleActionError(error, fallback) {
    if (error instanceof AdminKeyError) {
      setNeedsAdminKey(true);
      return;
    }
    console.error(fallback, error);
    setActionError(fallback);
  }

  function startEditing(invitation) {
    setEditingId(invitation.id);
    setEditForm({
      restaurantName: invitation.restaurantName ?? '',
      selectedDate: invitation.selectedDate ?? '',
      guestName: invitation.guestName ?? '',
      personalMessage: invitation.personalMessage ?? '',
    });
    setActionError('');
    setSuccessMessage('');
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
    setActionError('');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editForm.restaurantName.trim() || !editForm.selectedDate) {
      setActionError('Please complete the place and date.');
      return;
    }
    setSavingId(editingId);
    setActionError('');
    setSuccessMessage('');
    try {
      const updated = await updateInvitation(editingId, {
        restaurantName: editForm.restaurantName.trim(),
        selectedDate: editForm.selectedDate,
        guestName: editForm.guestName.trim(),
        personalMessage: editForm.personalMessage.trim(),
      });
      setInvitations((current) => current.map((item) => item.id === editingId ? updated : item));
      setEditingId(null);
      setSuccessMessage('Your date has been updated. ♥');
    } catch (error) {
      handleActionError(error, 'We couldn’t update this date. Please try again.');
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
      handleActionError(error, 'We couldn’t delete this date. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopyLink(invitation) {
    try {
      await navigator.clipboard.writeText(getInvitationLink(invitation.invitationToken));
      setCopiedId(invitation.id);
      setActionError('');
    } catch (error) {
      console.error('Could not copy invitation link:', error);
      setActionError('Could not copy the link. You can copy it from the card instead.');
    }
  }

  return (
    <PageLayout pageLabel="A collection of moments to look forward to">
      <section className="page-heading page-heading-row">
        <div><p className="eyebrow">THE LITTLE THINGS WE PLANNED</p><h1>Our <em>dates.</em></h1><p>Every plan is a memory waiting to happen.</p></div>
        <Link to="/restaurants" className="button button-dark">Plan another date ↗</Link>
      </section>

      {needsAdminKey ? (
        <AdminKeyPrompt onSaved={handleAdminKeySaved} />
      ) : isLoading ? (
        <div className="state-panel"><span className="loader" /><p>Gathering your plans…</p></div>
      ) : loadError ? (
        <div className="state-panel state-error"><h2>Something went wrong</h2><p>{loadError}</p></div>
      ) : invitations.length === 0 ? (
        <div className="empty-panel"><span className="empty-icon">♡</span><p className="eyebrow">A FRESH PAGE</p><h2>Nothing planned <em>just yet.</em></h2><p>Your next lovely evening starts with a place and a date.</p><Link to="/restaurants" className="button button-dark">Plan your first date ↗</Link></div>
      ) : (
        <div className="plans-grid">
          {invitations.map((invitation, index) => {
            const status = invitation.status || 'PENDING';
            const link = getInvitationLink(invitation.invitationToken);
            return (
              <article className="plan-card" key={invitation.id}>
                <div className="plan-card-top"><span>DATE NOTE · {String(index + 1).padStart(2, '0')}</span><span className="plan-heart">♥</span></div>
                {editingId === invitation.id ? (
                  <form className="edit-form" onSubmit={handleUpdate}>
                    <h2>Edit this <em>plan.</em></h2>
                    <label className="field-label">Place<input name="restaurantName" value={editForm.restaurantName} onChange={handleFormChange} required maxLength={100} /></label>
                    <label className="field-label">Date<input type="date" name="selectedDate" value={editForm.selectedDate} onChange={handleFormChange} required /></label>
                    <label className="field-label">Her name<input name="guestName" value={editForm.guestName} onChange={handleFormChange} maxLength={50} /></label>
                    <label className="field-label">Personal message<textarea name="personalMessage" rows={3} value={editForm.personalMessage} onChange={handleFormChange} maxLength={500} /></label>
                    <div className="plan-actions"><button className="button button-dark" type="submit" disabled={savingId === invitation.id}>{savingId === invitation.id ? 'Saving…' : 'Save changes'}</button><button className="button button-quiet" type="button" onClick={cancelEditing} disabled={savingId === invitation.id}>Cancel</button></div>
                  </form>
                ) : (
                  <>
                    <p className="eyebrow">{invitation.guestName ? `FOR ${invitation.guestName.toUpperCase()}` : 'OUR NEXT LITTLE ADVENTURE'}</p>
                    <h2>{invitation.restaurantName}</h2>
                    <div className="plan-date"><span>✳</span><div><small>MARK YOUR CALENDAR</small><b>{invitation.selectedDate}</b></div></div>

                    <div className={`status-badge status-${status.toLowerCase()}`}>
                      <span>{STATUS_LABELS[status] ?? status}</span>
                      {status === 'ACCEPTED' && invitation.respondedRestaurant && (
                        <b>She chose: {invitation.respondedRestaurant}</b>
                      )}
                      {invitation.respondedAt && <small>{formatRespondedAt(invitation.respondedAt)}</small>}
                    </div>

                    {link && <p className="invitation-link-text">{link}</p>}

                    <div className="plan-actions">
                      <button className="button button-dark" onClick={() => handleCopyLink(invitation)}>{copiedId === invitation.id ? 'Link copied ✓' : 'Copy invite link'}</button>
                      <button className="button button-outline" onClick={() => startEditing(invitation)}>Edit plan ↗</button>
                      <button className="button button-danger-quiet" onClick={() => handleDelete(invitation.id)} disabled={deletingId === invitation.id}>{deletingId === invitation.id ? 'Removing…' : 'Delete'}</button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}

      {actionError && <p className="feedback feedback-error" role="alert">{actionError}</p>}
      {successMessage && <p className="feedback feedback-success" role="status">{successMessage}</p>}
      <div className="back-link-wrap"><Link to="/" className="text-link">← Back home</Link></div>
    </PageLayout>
  );
}

export default InvitationsPage;
