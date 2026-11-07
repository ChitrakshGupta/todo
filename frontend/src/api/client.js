import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const key = localStorage.getItem('todo-session-key');
  if (key) config.headers['x-session-key'] = key;
  return config;
});

export default client;
