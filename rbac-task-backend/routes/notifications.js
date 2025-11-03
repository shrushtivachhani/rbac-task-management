import express from 'express';
const router = express.Router();
// This import is now correct:
import { listNotifications, markRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middlewares/auth.js';
import audit from '../middlewares/auditMiddleware.js';

router.use(verifyToken);

router.get('/', audit('LIST_NOTIFICATIONS'), listNotifications);
router.put('/mark-read', audit('MARK_NOTIFICATION_READ'), markRead);


export default router;