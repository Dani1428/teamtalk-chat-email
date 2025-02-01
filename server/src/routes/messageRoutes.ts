import express from 'express';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  togglePinMessage,
  addReaction,
} from '../controllers/messageController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/:channelId', sendMessage);
router.put('/:messageId', editMessage);
router.delete('/:messageId', deleteMessage);
router.post('/:messageId/pin', togglePinMessage);
router.post('/:messageId/reactions', addReaction);

export default router;
