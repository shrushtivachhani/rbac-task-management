// routes/roles.js (CORRECT)
import express from 'express';
// This import now correctly matches the named exports in roleController.js
import { createRole, listRoles, updateRole, deleteRole } from '../controllers/roleController.js'; 
import { verifyToken, checkRole } from '../middlewares/auth.js';
import audit from '../middlewares/auditMiddleware.js';
const router = express.Router();


router.use(verifyToken);
router.post('/', checkRole(['Admin']), audit('CREATE_ROLE'), createRole);
router.get('/', checkRole(['Admin']), listRoles);
router.put('/:id', checkRole(['Admin']), audit('UPDATE_ROLE'), updateRole);
router.delete('/:id', checkRole(['Admin']), audit('DELETE_ROLE'), deleteRole);


export default router;