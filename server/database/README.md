# Base de données TeamTalk

Ce dossier contient les scripts SQL pour initialiser et peupler la base de données PostgreSQL de l'application TeamTalk.

## Structure

- `init.sql` : Crée la base de données et toutes les tables nécessaires
- `seed.sql` : Insère des données de test
- `queries.ts` : Contient toutes les fonctions TypeScript pour interagir avec la base de données
- `config.ts` : Configuration de la connexion à la base de données

## Installation

1. Installer PostgreSQL si ce n'est pas déjà fait
2. Créer un utilisateur PostgreSQL si nécessaire :
```sql
CREATE USER teamtalk WITH PASSWORD 'votre_mot_de_passe';
```

3. Exécuter les scripts dans l'ordre :
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données et les tables
\i init.sql

# Insérer les données de test (optionnel)
\i seed.sql
```

## Structure de la base de données

### Tables principales
- `users` : Informations des utilisateurs
- `channels` : Canaux de discussion
- `messages` : Messages envoyés dans les canaux
- `calls` : Appels audio/vidéo
- `attachments` : Pièces jointes des messages

### Tables de relations
- `channel_members` : Membres des canaux
- `call_participants` : Participants aux appels
- `reactions` : Réactions aux messages

### Tables de support
- `notifications` : Notifications des utilisateurs
- `sessions` : Sessions de connexion

## Maintenance

Pour sauvegarder la base de données :
```bash
pg_dump -U postgres teamtalk > backup.sql
```

Pour restaurer une sauvegarde :
```bash
psql -U postgres teamtalk < backup.sql
```
