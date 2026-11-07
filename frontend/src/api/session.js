import client from './client';

const STORAGE_KEY = 'todo-session-key';

function storedKey() {
  return localStorage.getItem(STORAGE_KEY);
}

async function loadOrCreate() {
  const existing = storedKey();
  if (existing) {
    try {
      await client.get('/api/sessions/current');
      return existing;
    } catch (err) {
      if (err?.response?.status !== 401) throw err;
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const { data } = await client.post('/api/sessions');
  localStorage.setItem(STORAGE_KEY, data.key);
  return data.key;
}

let pending;

export function ensureSession() {
  if (!pending) {
    pending = loadOrCreate().catch((err) => {
      pending = null;
      throw err;
    });
  }
  return pending;
}
