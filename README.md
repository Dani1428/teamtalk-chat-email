# TeamTalk Sphere

Une application de communication d'entreprise moderne avec gestion de courrier intégrée.

## Fonctionnalités

### Communication en temps réel
- Chat en temps réel avec WebSocket
- Appels audio/vidéo
- Partage de fichiers
- Messages vocaux
- Archives des conversations

### Système de Gestion de Courrier
- Gestion des départements et services
- Suivi des courriers envoyés et reçus
- Instructions et workflows
- Statistiques et rapports
- Recherche avancée

## Structure du Projet

```
backend/
├── alembic/           # Migrations de base de données
├── app/
│   ├── models/        # Modèles SQLAlchemy
│   ├── schemas/       # Schémas Pydantic
│   ├── services/      # Logique métier
│   ├── routers/       # Routes API
│   └── main.py        # Application FastAPI
└── frontend/          # Interface utilisateur React
```

## Installation

### Prérequis
- Python 3.8+
- PostgreSQL
- Node.js 16+

### Backend

1. Créer un environnement virtuel :
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
pip install -e .
```

3. Configuration :
```bash
cp .env.example .env
# Modifier .env avec vos paramètres
```

4. Base de données :
```bash
# Créer la base de données PostgreSQL
createdb teamtalk_sphere

# Appliquer les migrations
alembic upgrade head
```

5. Lancer le serveur :
```bash
uvicorn main:app --reload
```

### Frontend

1. Installer les dépendances :
```bash
cd frontend
npm install
```

2. Lancer l'application :
```bash
# TeamTalk Sphere

Une application de communication moderne et complète avec chat en temps réel, appels audio/vidéo, et gestion d'emails.

## Fonctionnalités

### Chat
- 💬 Messagerie en temps réel
- 📎 Support des pièces jointes
- 🎤 Messages vocaux
- 🌓 Mode sombre/clair
- 📱 Interface responsive

### Email
- ✉️ Composition d'emails avec éditeur riche
- 📁 Gestion des pièces jointes
- 👥 Support des destinataires CC
- 🎨 Interface moderne et intuitive
- 🌓 Support du mode sombre

### Appels
- 📞 Appels audio
- 🎥 Appels vidéo
- 🔊 Contrôle du volume
- 🎙️ Contrôle du microphone

## Technologies Utilisées

### Frontend
- React avec TypeScript
- Tailwind CSS pour le style
- Radix UI pour les composants accessibles
- WebRTC pour les appels audio/vidéo
- WebSocket pour la communication en temps réel

### Backend
- FastAPI (Python)
- WebSocket pour le temps réel
- Support des uploads de fichiers
- Gestion des médias (audio/vidéo)

## Structure du Projet

```
teamtalk-sphere/
├── src/                      # Code source frontend
│   ├── components/           # Composants React réutilisables
│   │   ├── chat/            # Composants liés au chat
│   │   ├── email/           # Composants liés aux emails
│   │   ├── call/            # Composants liés aux appels
│   │   └── ui/              # Composants UI génériques
│   ├── contexts/            # Contextes React (Theme, Socket, etc.)
│   ├── hooks/               # Hooks personnalisés
│   ├── lib/                 # Bibliothèques et utilitaires
│   └── utils/               # Fonctions utilitaires
│
├── backend/                  # Code source backend
│   ├── app/                 # Application FastAPI
│   │   ├── main.py         # Point d'entrée de l'API
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes de l'API
│   │   └── services/       # Services métier
│   └── requirements.txt     # Dépendances Python
│
├── public/                  # Fichiers statiques
│   ├── sounds/             # Sons de notification
│   └── images/             # Images et icônes
│
├── uploads/                 # Dossier des fichiers uploadés
│   ├── chat/              # Pièces jointes du chat
│   └── email/             # Pièces jointes des emails
│
├── package.json            # Configuration npm et dépendances
├── tsconfig.json          # Configuration TypeScript
├── tailwind.config.ts     # Configuration Tailwind CSS
└── vite.config.ts         # Configuration Vite
```

## Organisation du Code

### Frontend

- **components/** : Composants React organisés par fonctionnalité
  - `chat/` : Messagerie en temps réel
  - `email/` : Gestion des emails
  - `call/` : Fonctionnalités d'appel
  - `ui/` : Composants UI réutilisables

- **contexts/** : Gestion de l'état global
  - `ThemeContext` : Gestion du thème (clair/sombre)
  - `SocketContext` : Gestion des connexions WebSocket
  - `CallContext` : Gestion des appels audio/vidéo

- **hooks/** : Hooks React personnalisés
  - `useVoiceRecorder` : Enregistrement audio
  - `useWebRTC` : Gestion des appels
  - `useSocket` : Communication WebSocket

### Backend

- **app/main.py** : Configuration principale FastAPI
  - Routes WebSocket
  - Gestion des fichiers
  - API REST

- **models/** : Schémas de données
  - Messages
  - Utilisateurs
  - Fichiers

- **services/** : Logique métier
  - Gestion des messages
  - Traitement des fichiers
  - Gestion des appels

## Installation

1. Cloner le repository :
```bash
git clone <URL_DU_REPO>
cd teamtalk-sphere
```

2. Installer les dépendances frontend :
```bash
cd frontend
npm install
```

3. Installer les dépendances backend :
```bash
cd backend
pip install -r requirements.txt
```

## Démarrage

1. Démarrer le backend :
```bash
cd backend
python -m uvicorn app.main:app --reload --port 3000
```

2. Démarrer le frontend :
```bash
cd frontend
npm run dev
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
L'application sera accessible à l'adresse : http://localhost:8080

## Configuration

- Le backend écoute par défaut sur le port 3000
- Le frontend est configuré pour se connecter à `http://localhost:3000`
- Les fichiers uploadés sont stockés dans le dossier `uploads/`

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des nouvelles fonctionnalités
- Soumettre des pull requests

## Licence

MIT
