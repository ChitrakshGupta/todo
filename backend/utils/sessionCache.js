const sessions = new Map();

export function readSession(key) {
  return sessions.get(key) || null;
}

export function rememberSession(session) {
  sessions.set(session.key, {
    key: session.key,
    createdAt: session.createdAt,
  });
  return sessions.get(session.key);
}
