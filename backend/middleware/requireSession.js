import Session from '../models/Session.js';
import { readSession, rememberSession } from '../utils/sessionCache.js';

export async function requireSession(req, res, next) {
  const key = req.get('x-session-key');
  if (!key) return res.status(401).json({ message: 'Session key is required' });

  const cached = readSession(key);
  if (cached) {
    req.sessionKey = cached.key;
    return next();
  }

  try {
    const session = await Session.findOne({ key }).select('key createdAt');
    if (!session) return res.status(401).json({ message: 'Unknown session' });

    rememberSession(session);
    req.sessionKey = session.key;
    return next();
  } catch (err) {
    console.error('Error resolving session:', err);
    return res.status(500).json({ message: 'Error resolving session' });
  }
}
