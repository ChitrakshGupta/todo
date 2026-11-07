import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

const corsOpts = {
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['authorization', 'content-type', 'x-session-key'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOpts));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.use('/api/sessions', sessionRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Server running ✅'));

const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

app.get(['/health', '/api/health', '/ping'], (req, res) => {
  res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    db: dbStates[mongoose.connection.readyState] ?? 'unknown',
  });
});

app.use((req, res) => {
  console.warn('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Not found', path: req.originalUrl, method: req.method });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
