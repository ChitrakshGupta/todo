import client from './client';

export const fetchTasks = (q) =>
  client.get('/api/tasks', { params: q ? { q } : {} }).then((res) => res.data);

export const createTask = (payload) =>
  client.post('/api/tasks', payload).then((res) => res.data);

export const updateTask = (id, payload) =>
  client.put(`/api/tasks/${id}`, payload).then((res) => res.data);

export const updateTaskStatus = (id, status) =>
  client.patch(`/api/tasks/${id}/status`, { status }).then((res) => res.data);

export const deleteTask = (id) =>
  client.delete(`/api/tasks/${id}`).then((res) => res.data);
