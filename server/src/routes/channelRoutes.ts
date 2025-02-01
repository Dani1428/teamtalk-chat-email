import express from 'express';
import {
  createChannel,
  getChannels,
  getChannelMessages,
  addMember,
  removeMember,
} from '../controllers/channelController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/', createChannel);
router.get('/', getChannels);
router.get('/:channelId/messages', getChannelMessages);
router.post('/:channelId/members/:userId', addMember);
router.delete('/:channelId/members/:userId', removeMember);

export default router;
