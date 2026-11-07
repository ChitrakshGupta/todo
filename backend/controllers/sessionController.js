import crypto from 'crypto';
import Session from '../models/Session.js';
import { rememberSession } from '../utils/sessionCache.js';

export const createSession = async (req, res) => {
  try {
    const session = await Session.create({ key: crypto.randomUUID() });
    rememberSession(session);
    res.status(201).json({ key: session.key, createdAt: session.createdAt });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ message: 'Error creating session' });
  }
};
