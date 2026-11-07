import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/taskController.js';
import { requireSession } from '../middleware/requireSession.js';

const router = Router();

router.use(requireSession);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
