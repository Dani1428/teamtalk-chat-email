import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    users.set(userId, socket.id);
    console.log('User registered:', userId, socket.id);
  });

  socket.on('callUser', ({ userToCall, offer, from, isVideo }) => {
    const socketId = users.get(userToCall);
    if (socketId) {
      io.to(socketId).emit('callUser', {
        from,
        offer,
        isVideo
      });
    }
  });

  socket.on('answerCall', ({ to, answer }) => {
    io.to(to).emit('callAccepted', { answer });
  });

  socket.on('iceCandidate', ({ to, candidate }) => {
    io.to(to).emit('iceCandidateReceived', { candidate });
  });

  socket.on('endCall', ({ to }) => {
    io.to(to).emit('callEnded');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
