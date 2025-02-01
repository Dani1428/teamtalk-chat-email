import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { instrument } from '@socket.io/admin-ui';

import authRoutes from './routes/authRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import callRoutes from './routes/callRoutes';
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, CLIENT_URL, PORT } from './config';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

// Connexion à PostgreSQL
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
});

// Test de la connexion
pool.connect()
  .then(() => console.log('Connecté à PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL:', err));

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calls', callRoutes);

// Socket.IO
interface UserSocket {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket:', socket.id);

  // Authentification du socket
  socket.on('authenticate', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    io.emit('userStatusChange', { userId, status: 'online' });
    
    // Mettre à jour le statut dans la base de données
    pool.query(
      'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
      ['online', userId]
    ).catch(console.error);
  });

  // Gestion des appels
  socket.on('call:initiate', ({ callId, receiverId, type }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('call:incoming', { callId, type });
    }
  });

  socket.on('call:answer', ({ callId, answer }) => {
    socket.broadcast.to(`call:${callId}`).emit('call:answered', { callId, answer });
  });

  socket.on('call:ice-candidate', ({ callId, candidate }) => {
    socket.broadcast.to(`call:${callId}`).emit('call:ice-candidate', { callId, candidate });
  });

  socket.on('call:offer', ({ callId, offer }) => {
    socket.broadcast.to(`call:${callId}`).emit('call:offer', { callId, offer });
  });

  socket.on('call:join-room', (callId: string) => {
    socket.join(`call:${callId}`);
  });

  socket.on('call:leave-room', (callId: string) => {
    socket.leave(`call:${callId}`);
  });

  socket.on('call:end', ({ callId }) => {
    io.to(`call:${callId}`).emit('call:ended', { callId });
    io.socketsLeave(`call:${callId}`);
  });

  // Gestion des messages
  socket.on('message:send', (message) => {
    socket.broadcast.to(`channel:${message.channel}`).emit('message:new', message);
  });

  socket.on('message:edit', (message) => {
    socket.broadcast.to(`channel:${message.channel}`).emit('message:updated', message);
  });

  socket.on('message:delete', ({ messageId, channelId }) => {
    socket.broadcast.to(`channel:${channelId}`).emit('message:deleted', { messageId });
  });

  // Gestion des canaux
  socket.on('channel:join', (channelId: string) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on('channel:leave', (channelId: string) => {
    socket.leave(`channel:${channelId}`);
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log('Déconnexion socket:', socket.id);
    
    // Trouver et mettre à jour l'utilisateur déconnecté
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('userStatusChange', { userId, status: 'offline' });
        
        // Mettre à jour le statut dans la base de données
        pool.query(
          'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
          ['offline', userId]
        ).catch(console.error);
        
        break;
      }
    }
  });
});

// Configuration de l'interface d'administration Socket.IO
instrument(io, {
  auth: {
    type: 'basic',
    username: process.env.ADMIN_USER || 'admin',
    password: process.env.ADMIN_PASS || 'admin',
  },
});

// Démarrage du serveur
const serverPort = PORT || 5000;
httpServer.listen(serverPort, () => {
  console.log(`Serveur démarré sur le port ${serverPort}`);
});

export default app;
