
const API_URL = 'http://localhost:8080/api/date-night/invitations';

export async function getAllInvitations() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch invitations.');
  }

  return response.json();
}

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
