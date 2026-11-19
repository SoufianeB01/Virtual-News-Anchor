const API_URL = 'http://127.0.0.1:8000';

export interface MascotteSession {
  id: string;
  url: string;
  expiresAt: string;
}

export async function createMascotteSession(): Promise<MascotteSession> {
  const response = await fetch(`${API_URL}/api/mascotte/session`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Kon geen Mascotte-sessie aanmaken');
  }

  return response.json();
}