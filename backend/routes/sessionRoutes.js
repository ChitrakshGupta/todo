import { Router } from 'express';
import { createSession } from '../controllers/sessionController.js';
import { requireSession } from '../middleware/requireSession.js';

const router = Router();

router.post('/', createSession);
router.get('/current', requireSession, (req, res) => {
  res.status(200).json({ key: req.sessionKey });
});

export default router;
