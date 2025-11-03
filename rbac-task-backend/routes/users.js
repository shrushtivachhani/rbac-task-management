// routes/users.js (CORRECT)
import express from 'express';
// This import is now correctly receiving named exports
import { createUser, listUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import validateScope from '../middlewares/validateScope.js';
import audit from '../middlewares/auditMiddleware.js';
const router = express.Router();

router.use(verifyToken);

router.post('/', checkRole(['Admin']), audit('CREATE_USER'), createUser);
router.get('/', checkRole(['Admin','HR','BDM','ASM','Employee','Super Employee']), listUsers);
router.get('/:id', checkRole([]), validateScope({ target: 'user' }), getUser);
router.put('/:id', checkRole(['Admin','HR','BDM','ASM','Super Employee']), validateScope({ target: 'user' }), audit('UPDATE_USER'), updateUser);
router.delete('/:id', checkRole(['Admin']), audit('DELETE_USER'), deleteUser);


export default router;