import express from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Récupérer tous les départements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT d.id, d.name, ARRAY_AGG(c.name) as channels FROM departments d LEFT JOIN channels c ON d.id = c.department_id GROUP BY d.id, d.name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des départements:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un département
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO departments (name) VALUES ($1) RETURNING id, name',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création du département:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour un département
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE departments SET name = $1 WHERE id = $2 RETURNING id, name',
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Département non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du département:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un département
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM departments WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Département non trouvé' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression du département:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un canal à un département
router.post('/:id/channels', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO channels (department_id, name) VALUES ($1, $2) RETURNING id, name',
      [id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création du canal:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un canal d'un département
router.delete('/:id/channels/:channelName', authenticateToken, async (req, res) => {
  const { id, channelName } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM channels WHERE department_id = $1 AND name = $2',
      [id, channelName]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Canal non trouvé' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression du canal:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
