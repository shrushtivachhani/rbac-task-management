// routes/audit.js (CORRECT)
import express from 'express';
// This import now correctly matches the named export in auditController.js
import { listAudit } from '../controllers/auditController.js'; 
import { verifyToken, checkRole } from '../middlewares/auth.js';
const router = express.Router();

router.use(verifyToken);
router.get('/', checkRole(['Admin']), listAudit);


export default router;