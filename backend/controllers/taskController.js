import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { validateStatus, validateTaskPayload } from '../utils/validators.js';

function invalidId(id) {
  return !mongoose.Types.ObjectId.isValid(id);
}

export const getTasks = async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const filter = { sessionKey: req.sessionKey };

    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ dueAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { errors, data } = validateTaskPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors[0] });

    const payload = { ...data, sessionKey: req.sessionKey };
    if (payload.priority == null) delete payload.priority;
    if (payload.endAt == null) delete payload.endAt;

    const task = await Task.create(payload);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });

    const { errors, data } = validateTaskPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors[0] });

    const $set = {
      title: data.title,
      description: data.description,
      dueAt: data.dueAt,
    };
    if (data.status) $set.status = data.status;
    if (data.priority) $set.priority = data.priority;
    if (data.endAt) $set.endAt = data.endAt;

    const $unset = {};
    if (!data.priority) $unset.priority = '';
    if (data.endAt === null) $unset.endAt = '';

    const update = { $set };
    if (Object.keys($unset).length) update.$unset = $unset;

    const task = await Task.findOneAndUpdate({ _id: req.params.id, sessionKey: req.sessionKey }, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });

    const { error, status } = validateStatus(req.body?.status);
    if (error) return res.status(400).json({ message: error });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, sessionKey: req.sessionKey },
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Error updating task status' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });

    const task = await Task.findOneAndDelete({ _id: req.params.id, sessionKey: req.sessionKey });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
