import { create } from 'zustand';
import * as tasksApi from '../api/tasks';

function messageFrom(err, fallback) {
  return err?.response?.data?.message || fallback;
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  results: [],
  loading: false,
  searching: false,
  error: '',

  fetchTasks: async () => {
    set({ loading: true, error: '' });
    try {
      const tasks = await tasksApi.fetchTasks();
      set({ tasks, loading: false });
    } catch (err) {
      set({ loading: false, error: messageFrom(err, 'Could not load tasks') });
    }
  },

  search: async (q) => {
    set({ searching: true, error: '' });
    try {
      const results = await tasksApi.fetchTasks(q);
      set({ results, searching: false });
    } catch (err) {
      set({ searching: false, error: messageFrom(err, 'Search failed') });
    }
  },

  createTask: async (payload) => {
    const task = await tasksApi.createTask(payload);
    set({ tasks: [task, ...get().tasks] });
    return task;
  },

  updateTask: async (id, payload) => {
    const task = await tasksApi.updateTask(id, payload);
    const replace = (list) => list.map((item) => (item._id === id ? task : item));
    set({ tasks: replace(get().tasks), results: replace(get().results) });
    return task;
  },

  setStatus: async (id, status) => {
    const task = await tasksApi.updateTaskStatus(id, status);
    const replace = (list) => list.map((item) => (item._id === id ? task : item));
    set({ tasks: replace(get().tasks), results: replace(get().results) });
    return task;
  },

  deleteTask: async (id) => {
    await tasksApi.deleteTask(id);
    const drop = (list) => list.filter((item) => item._id !== id);
    set({ tasks: drop(get().tasks), results: drop(get().results) });
  },
}));
