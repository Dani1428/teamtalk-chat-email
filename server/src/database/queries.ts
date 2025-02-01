import { QueryResult } from 'pg';
import pool from './config';

export interface DbUser {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  status: string;
  role: string;
  last_seen: Date;
}

export interface DbChannel {
  id: string;
  name: string;
  description?: string;
  type: string;
  created_by: string;
}

export interface DbMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  type: string;
  reply_to?: string;
  is_edited: boolean;
  is_pinned: boolean;
  created_at: Date;
}

// Requêtes utilisateurs
export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<DbUser> => {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [username, email, passwordHash]);
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<DbUser | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<void> => {
  const query = `
    UPDATE users 
    SET status = $1, last_seen = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  await pool.query(query, [status, userId]);
};

// Requêtes canaux
export const createChannel = async (
  name: string,
  description: string,
  type: string,
  createdBy: string
): Promise<DbChannel> => {
  const query = `
    INSERT INTO channels (name, description, type, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await pool.query(query, [name, description, type, createdBy]);
  return result.rows[0];
};

export const getChannelMembers = async (channelId: string): Promise<DbUser[]> => {
  const query = `
    SELECT u.* 
    FROM users u
    JOIN channel_members cm ON cm.user_id = u.id
    WHERE cm.channel_id = $1
  `;
  const result = await pool.query(query, [channelId]);
  return result.rows;
};

export const addChannelMember = async (
  channelId: string,
  userId: string,
  role: string = 'member'
): Promise<void> => {
  const query = `
    INSERT INTO channel_members (channel_id, user_id, role)
    VALUES ($1, $2, $3)
  `;
  await pool.query(query, [channelId, userId, role]);
};

// Requêtes messages
export const createMessage = async (
  channelId: string,
  senderId: string,
  content: string,
  type: string = 'text',
  replyTo?: string
): Promise<DbMessage> => {
  const query = `
    INSERT INTO messages (channel_id, sender_id, content, type, reply_to)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [channelId, senderId, content, type, replyTo]);
  return result.rows[0];
};

export const getChannelMessages = async (
  channelId: string,
  limit: number = 50,
  offset: number = 0
): Promise<DbMessage[]> => {
  const query = `
    SELECT m.*, u.username, u.avatar_url
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.channel_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await pool.query(query, [channelId, limit, offset]);
  return result.rows;
};

export const updateMessage = async (
  messageId: string,
  content: string
): Promise<DbMessage> => {
  const query = `
    UPDATE messages
    SET content = $1, is_edited = true
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [content, messageId]);
  return result.rows[0];
};

// Requêtes appels
export const createCall = async (
  channelId: string,
  initiatorId: string,
  type: string
): Promise<QueryResult> => {
  const query = `
    INSERT INTO calls (channel_id, initiator_id, type)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  return pool.query(query, [channelId, initiatorId, type]);
};

export const updateCallStatus = async (
  callId: string,
  status: string,
  endedAt?: Date
): Promise<void> => {
  const query = `
    UPDATE calls
    SET status = $1, ended_at = $2
    WHERE id = $3
  `;
  await pool.query(query, [status, endedAt, callId]);
};

export const addCallParticipant = async (
  callId: string,
  userId: string
): Promise<void> => {
  const query = `
    INSERT INTO call_participants (call_id, user_id)
    VALUES ($1, $2)
  `;
  await pool.query(query, [callId, userId]);
};

// Requêtes notifications
export const createNotification = async (
  userId: string,
  type: string,
  content: string,
  relatedId?: string
): Promise<void> => {
  const query = `
    INSERT INTO notifications (user_id, type, content, related_id)
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [userId, type, content, relatedId]);
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1
  `;
  await pool.query(query, [notificationId]);
};

// Requêtes réactions
export const toggleReaction = async (
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const checkQuery = `
    SELECT * FROM reactions
    WHERE message_id = $1 AND user_id = $2 AND emoji = $3
  `;
  const checkResult = await pool.query(checkQuery, [messageId, userId, emoji]);

  if (checkResult.rows.length > 0) {
    // Supprimer la réaction
    const deleteQuery = `
      DELETE FROM reactions
      WHERE message_id = $1 AND user_id = $2 AND emoji = $3
    `;
    await pool.query(deleteQuery, [messageId, userId, emoji]);
  } else {
    // Ajouter la réaction
    const insertQuery = `
      INSERT INTO reactions (message_id, user_id, emoji)
      VALUES ($1, $2, $3)
    `;
    await pool.query(insertQuery, [messageId, userId, emoji]);
  }
};
