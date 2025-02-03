import express from 'express';
import { pool } from '../db';
import { auth } from '../middleware/auth';

const router = express.Router();

// Récupérer les messages archivés d'un canal
router.get('/channel/:channelId', auth, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const result = await pool.query(
      `SELECT am.*, u.username as archived_by_username, ou.username as original_user_username
       FROM archived_messages am
       LEFT JOIN users u ON am.archived_by = u.id
       LEFT JOIN users ou ON am.user_id = ou.id
       WHERE am.channel_id = $1
       ORDER BY am.archived_at DESC
       LIMIT $2 OFFSET $3`,
      [channelId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM archived_messages WHERE channel_id = $1',
      [channelId]
    );

    res.json({
      messages: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / Number(limit))
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des archives:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Archiver un message
router.post('/message/:messageId', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { messageId } = req.params;
    const { reason } = req.body;

    // Récupérer le message original
    const messageResult = await client.query(
      'SELECT * FROM messages WHERE id = $1',
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      throw new Error('Message non trouvé');
    }

    const message = messageResult.rows[0];

    // Archiver le message
    await client.query(
      `INSERT INTO archived_messages 
       (message_id, channel_id, user_id, content, original_sent_at, archive_reason, archived_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        messageId,
        message.channel_id,
        message.sender_id,
        message.content,
        message.created_at,
        reason,
        req.user.id
      ]
    );

    // Supprimer le message original
    await client.query('DELETE FROM messages WHERE id = $1', [messageId]);

    await client.query('COMMIT');
    res.json({ message: 'Message archivé avec succès' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'archivage du message:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
});

// Restaurer un message archivé
router.post('/restore/:archiveId', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { archiveId } = req.params;

    // Récupérer le message archivé
    const archiveResult = await client.query(
      'SELECT * FROM archived_messages WHERE id = $1',
      [archiveId]
    );

    if (archiveResult.rows.length === 0) {
      throw new Error('Message archivé non trouvé');
    }

    const archive = archiveResult.rows[0];

    // Restaurer le message
    await client.query(
      `INSERT INTO messages (channel_id, sender_id, content, created_at)
       VALUES ($1, $2, $3, $4)`,
      [archive.channel_id, archive.user_id, archive.content, archive.original_sent_at]
    );

    // Supprimer l'archive
    await client.query('DELETE FROM archived_messages WHERE id = $1', [archiveId]);

    await client.query('COMMIT');
    res.json({ message: 'Message restauré avec succès' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la restauration du message:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
});

export default router;
