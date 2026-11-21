const API_URL = import.meta.env.VITE_API_URL;

const ADMIN_KEY_STORAGE = 'dateNightAdminKey';

// Thrown when the backend rejects the admin key (HTTP 401).
export class AdminKeyError extends Error {
  constructor() {
    super('Your secret key is missing or incorrect.');
    this.name = 'AdminKeyError';
  }
}

export function getAdminKey() {
  try {
    return localStorage.getItem(ADMIN_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setAdminKey(key) {
  try {
    if (key) {
      localStorage.setItem(ADMIN_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(ADMIN_KEY_STORAGE);
    }
  } catch {
    // Storage unavailable (private mode) — key just won't be remembered.
  }
}

// Session fallback so the key still works for this visit if storage is blocked.
let sessionKey = '';

export function rememberAdminKey(key) {
  sessionKey = key;
  setAdminKey(key);
}

function adminHeaders(extra = {}) {
  const key = getAdminKey() || sessionKey;
  return key ? { ...extra, 'X-Admin-Key': key } : extra;
}

async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: adminHeaders(options.headers),
  });

  if (response.status === 401) {
    rememberAdminKey('');
    throw new AdminKeyError();
  }

  return response;
}

export function getInvitationLink(token) {
  return token ? `${window.location.origin}/invite/${token}` : '';
}

// GET: Retrieve all invitations
export async function getAllInvitations() {
  const response = await adminFetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch invitations.');
  }

  return response.json();
}

// POST: Create a new invitation
export async function createInvitation(invitationData) {
  const response = await adminFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitationData),
  });

  if (!response.ok) {
    throw new Error('Failed to save the invitation.');
  }

  return response.json();
}

// PUT: Update an existing invitation
export async function updateInvitation(invitationId, invitationData) {
  const response = await adminFetch(`${API_URL}/${invitationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitationData),
  });

  if (!response.ok) {
    throw new Error('Failed to update the invitation.');
  }

  return response.json();
}

// DELETE: Delete an invitation
export async function deleteInvitation(invitationId) {
  const response = await adminFetch(`${API_URL}/${invitationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete invitation.');
  }
}

// GET: Retrieve a public invitation using its token (no key needed)
export async function getPublicInvitation(token) {
  const response = await fetch(
    `${API_URL}/public/${encodeURIComponent(token)}`
  );

  if (!response.ok) {
    throw new Error('Invitation not found or unavailable.');
  }

  return response.json();
}

// POST: Submit a response to a public invitation (no key needed)
export async function respondToPublicInvitation(token, responseData) {
  const response = await fetch(
    `${API_URL}/public/${encodeURIComponent(token)}/respond`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || 'Failed to submit your response.'
    );
  }

  return response.json();
}
