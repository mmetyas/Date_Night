
const API_URL = import.meta.env.VITE_API_URL;

// GET: Retrieve all invitations
export async function getAllInvitations() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch invitations.');
  }

  return response.json();
}

// POST: Create a new invitation
export async function createInvitation(invitationData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitationData),
  });

  if (!response.ok) {
    throw new Error('Failed to save the invitation.');
  }

  return response.json();
}

// PUT: Update an existing invitation
export async function updateInvitation(invitationId, invitationData) {
  const response = await fetch(`${API_URL}/${invitationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitationData),
  });

  if (!response.ok) {
    throw new Error('Failed to update the invitation.');
  }

  return response.json();
}

// DELETE: Delete an invitation
export async function deleteInvitation(invitationId) {
  const response = await fetch(`${API_URL}/${invitationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete invitation.');
  }
}

// GET: Retrieve a public invitation using its token
export async function getPublicInvitation(token) {
  const response = await fetch(
    `${API_URL}/public/${encodeURIComponent(token)}`
  );

  if (!response.ok) {
    throw new Error('Invitation not found or unavailable.');
  }

  return response.json();
}

// POST: Submit a response to a public invitation
export async function respondToPublicInvitation(token, responseData) {
  const response = await fetch(
    `${API_URL}/public/${encodeURIComponent(token)}/respond`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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