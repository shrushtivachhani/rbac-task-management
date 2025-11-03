// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';

// ----- Create app and server -----
const app = express();                 // <-- make sure app exists
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

// ----- Middlewares -----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

// ----- Health / test route -----
app.get('/', (req, res) => {
  res.status(200).send('Role-Based Task Management Backend is running 🚀');
});

// ----- MongoDB connection -----
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rbac_task_db';
mongoose.connect(MONGO_URI, {
  // options not required in mongoose v7 but harmless
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
    // Do NOT exit immediately in dev if you want to debug; uncomment to exit on fail:
    // process.exit(1);
  });

// ----- Socket.io basic hooks -----
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    // optional acknowledgement
    socket.emit('joined', { room });
  });

  socket.on('disconnect', () => {
    // console.log('Socket disconnected', socket.id);
  });
});

// ----- Route imports -----
// NOTE: these filenames must exist in your ./routes folder.
// I use the filenames from the earlier full backend structure:
// routes/auth.js, routes/roles.js, routes/users.js, routes/teams.js, routes/tasks.js, routes/notifications.js, routes/audit.js
import authRoutes from './routes/auth.js';
import roleRoutes from './routes/roles.js';
import userRoutes from './routes/users.js';
import teamRoutes from './routes/teams.js';
import taskRoutes from './routes/tasks.js';
import notificationRoutes from './routes/notifications.js';
import auditRoutes from './routes/audit.js';

// ----- Mount routes -----
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);

// ----- 404 handler -----
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

// ----- Start server -----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
