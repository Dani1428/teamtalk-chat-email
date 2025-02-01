# TeamTalk Sphere - Backend

Backend pour l'application TeamTalk Sphere, une plateforme de communication en temps réel avec support pour les appels audio/vidéo.

## Technologies utilisées

- Node.js
- Express
- MongoDB avec Mongoose
- Socket.IO pour la communication en temps réel
- TypeScript
- JWT pour l'authentification

## Configuration requise

- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/teamtalk-sphere.git
cd teamtalk-sphere/server
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` vers `.env`
- Modifier les valeurs selon votre configuration

4. Démarrer MongoDB :
```bash
mongod
```

5. Démarrer le serveur en mode développement :
```bash
npm run dev
```

## Structure du projet

```
server/
├── src/
│   ├── controllers/    # Logique métier
│   ├── middleware/     # Middleware Express
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API
│   ├── types/          # Types TypeScript
│   ├── config.ts       # Configuration
│   └── signaling.ts    # Serveur de signalisation WebRTC
├── .env               # Variables d'environnement
├── package.json
└── tsconfig.json
```

## API Endpoints

### Auth
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion
- POST /api/auth/logout - Déconnexion
- GET /api/auth/me - Profil utilisateur

### Channels
- POST /api/channels - Créer un canal
- GET /api/channels - Liste des canaux
- GET /api/channels/:channelId/messages - Messages d'un canal
- POST /api/channels/:channelId/members/:userId - Ajouter un membre
- DELETE /api/channels/:channelId/members/:userId - Retirer un membre

### Messages
- POST /api/messages/:channelId - Envoyer un message
- PUT /api/messages/:messageId - Modifier un message
- DELETE /api/messages/:messageId - Supprimer un message
- POST /api/messages/:messageId/pin - Épingler/Désépingler un message
- POST /api/messages/:messageId/reactions - Ajouter une réaction

### Calls
- POST /api/calls - Initier un appel
- POST /api/calls/:callId/answer - Répondre à un appel
- POST /api/calls/:callId/end - Terminer un appel
- POST /api/calls/:callId/reject - Rejeter un appel

## WebSocket Events

### Connexion
- authenticate - Authentification du socket
- disconnect - Déconnexion

### Appels
- call:initiate - Initier un appel
- call:answer - Répondre à un appel
- call:ice-candidate - Échange de candidats ICE
- call:offer - Envoi d'une offre WebRTC
- call:join-room - Rejoindre une salle d'appel
- call:leave-room - Quitter une salle d'appel
- call:end - Terminer un appel

### Messages
- message:send - Envoyer un message
- message:edit - Modifier un message
- message:delete - Supprimer un message

### Canaux
- channel:join - Rejoindre un canal
- channel:leave - Quitter un canal
