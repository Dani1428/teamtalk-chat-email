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
