import express from 'express';
import {
  initiateCall,
  answerCall,
  endCall,
  rejectCall,
} from '../controllers/callController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/', initiateCall);
router.post('/:callId/answer', answerCall);
router.post('/:callId/end', endCall);
router.post('/:callId/reject', rejectCall);

export default router;
