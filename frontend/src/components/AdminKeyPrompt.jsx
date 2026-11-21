import { useState } from 'react';
import { rememberAdminKey } from '../services/invitationService';

// Asks for the secret admin key, stores it, then calls onSaved so the page can retry.
function AdminKeyPrompt({ onSaved, message }) {
  const [key, setKey] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) return;
    rememberAdminKey(trimmed);
    setKey('');
    onSaved?.();
  }

  return (
    <form className="booking-panel admin-key-panel" onSubmit={handleSubmit}>
      <p className="eyebrow">JUST FOR YOU</p>
      <h2>Enter your <em>secret key.</em></h2>
      <p>{message || 'This part of the site is private. Your key is remembered on this device.'}</p>
      <div className="booking-controls">
        <label className="field-label" htmlFor="admin-key">
          Secret key
          <input
            id="admin-key"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={key}
            onChange={(event) => setKey(event.target.value)}
            required
          />
        </label>
        <button className="button button-dark" type="submit">Unlock ↗</button>
      </div>
    </form>
  );
}

export default AdminKeyPrompt;
