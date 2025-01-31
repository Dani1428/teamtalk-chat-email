const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour Express
app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST"],
  credentials: true
}));

// Créer le serveur HTTP
const server = http.createServer(app);

// Configuration Socket.IO avec CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Serveur de signalisation WebRTC en cours d\'exécution');
});

// Garder une trace des utilisateurs connectés
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Nouvelle connexion établie:', socket.id);

  // Ajouter l'utilisateur à la liste des connectés
  connectedUsers.set(socket.id, { id: socket.id });
  console.log('Utilisateurs connectés:', connectedUsers.size);

  // Gérer les offres WebRTC
  socket.on('offer', (offer) => {
    console.log('Offre reçue de:', socket.id);
    socket.broadcast.emit('offer', offer);
  });

  // Gérer les réponses WebRTC
  socket.on('answer', (answer) => {
    console.log('Réponse reçue de:', socket.id);
    socket.broadcast.emit('answer', answer);
  });

  // Gérer les candidats ICE
  socket.on('ice-candidate', (candidate) => {
    console.log('Candidat ICE reçu de:', socket.id);
    socket.broadcast.emit('ice-candidate', candidate);
  });

  // Gérer les demandes d'appel
  socket.on('call-user', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('call-user', { signal: signalData, from, name });
  });

  // Gérer les acceptations d'appel
  socket.on('answer-call', (data) => {
    io.to(data.to).emit('call-accepted', data.signal);
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
    connectedUsers.delete(socket.id);
    socket.broadcast.emit('user-disconnected', socket.id);
  });

  // Gérer les erreurs
  socket.on('error', (error) => {
    console.error('Erreur Socket.IO:', error);
  });
});

// Gérer les erreurs du serveur
server.on('error', (error) => {
  console.error('Erreur du serveur:', error);
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Serveur de signalisation démarré sur le port ${PORT}`);
});
