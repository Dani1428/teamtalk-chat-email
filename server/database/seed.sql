-- Connexion à la base de données
\c teamtalk;

-- Insertion d'utilisateurs de test
INSERT INTO users (username, email, password_hash, role, status) VALUES
('admin', 'admin@teamtalk.com', '$2a$10$rM6u0YXA3Fb/uFJ.98XwZ.RzDG0HeCdKxX6h1m7x5vr3ZzsMYxjK2', 'admin', 'online'),
('user1', 'user1@teamtalk.com', '$2a$10$rM6u0YXA3Fb/uFJ.98XwZ.RzDG0HeCdKxX6h1m7x5vr3ZzsMYxjK2', 'user', 'online'),
('user2', 'user2@teamtalk.com', '$2a$10$rM6u0YXA3Fb/uFJ.98XwZ.RzDG0HeCdKxX6h1m7x5vr3ZzsMYxjK2', 'user', 'offline');

-- Insertion de canaux de test
INSERT INTO channels (name, description, type, created_by) VALUES
('Général', 'Canal général de discussion', 'public', (SELECT id FROM users WHERE username = 'admin')),
('Support', 'Canal de support technique', 'public', (SELECT id FROM users WHERE username = 'admin')),
('Projet A', 'Discussion du projet A', 'private', (SELECT id FROM users WHERE username = 'user1'));

-- Ajout des membres aux canaux
INSERT INTO channel_members (channel_id, user_id, role) 
SELECT c.id, u.id, CASE WHEN u.username = 'admin' THEN 'admin' ELSE 'member' END
FROM channels c
CROSS JOIN users u
WHERE c.type = 'public';

INSERT INTO channel_members (channel_id, user_id, role)
SELECT c.id, u.id, CASE WHEN u.username = 'user1' THEN 'admin' ELSE 'member' END
FROM channels c
CROSS JOIN users u
WHERE c.name = 'Projet A' AND (u.username = 'user1' OR u.username = 'user2');

-- Insertion de messages de test
INSERT INTO messages (channel_id, sender_id, content, type)
SELECT 
    c.id,
    u.id,
    CASE 
        WHEN u.username = 'admin' THEN 'Bienvenue sur TeamTalk!'
        WHEN u.username = 'user1' THEN 'Merci pour l''invitation!'
        ELSE 'Ravi d''être ici!'
    END,
    'text'
FROM channels c
CROSS JOIN users u
WHERE c.name = 'Général'
ORDER BY random()
LIMIT 5;

-- Insertion de réactions
INSERT INTO reactions (message_id, user_id, emoji)
SELECT 
    m.id,
    u.id,
    '👍'
FROM messages m
CROSS JOIN users u
WHERE m.content = 'Bienvenue sur TeamTalk!'
LIMIT 2;

-- Insertion d'un appel de test
INSERT INTO calls (channel_id, initiator_id, type, status, started_at, ended_at)
VALUES (
    (SELECT id FROM channels WHERE name = 'Général'),
    (SELECT id FROM users WHERE username = 'user1'),
    'audio',
    'ended',
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    CURRENT_TIMESTAMP - INTERVAL '45 minutes'
);

-- Insertion des participants à l'appel
INSERT INTO call_participants (call_id, user_id, joined_at, left_at)
SELECT 
    c.id,
    u.id,
    c.started_at,
    c.ended_at
FROM calls c
CROSS JOIN users u
WHERE u.username IN ('user1', 'user2');

-- Insertion de notifications
INSERT INTO notifications (user_id, type, content, related_id, is_read)
SELECT 
    u.id,
    'message',
    'Nouveau message dans le canal Général',
    m.id,
    false
FROM users u
CROSS JOIN messages m
WHERE u.username != 'admin'
LIMIT 3;
