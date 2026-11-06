
const API_URL = 'http://localhost:8080/api/date-night/invitations';

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
