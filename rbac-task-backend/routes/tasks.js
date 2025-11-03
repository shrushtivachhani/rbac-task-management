
import express from 'express';
// This import is now correct
import { createTask, listTasks, getTask, updateTask, deleteTask } from '../controllers/taskController.js'; 
import { verifyToken, checkRole } from '../middlewares/auth.js';
import validateScope from '../middlewares/validateScope.js';
import audit from '../middlewares/auditMiddleware.js';


const router = express.Router();

router.use(verifyToken);

router.post('/', checkRole(['Admin','HR','BDM','ASM']), validateScope({ target: 'task' }), audit('CREATE_TASK'), createTask);
router.get('/', checkRole(['Admin','HR','BDM','ASM','Employee','Super Employee']), listTasks);
router.get('/:id', checkRole(['Admin','HR','BDM','ASM','Employee','Super Employee']), validateScope({ target: 'task' }), getTask);
router.put('/:id', checkRole(['Admin','Super Employee','Employee']), validateScope({ target: 'task' }), audit('UPDATE_TASK'), updateTask);
router.delete('/:id', checkRole(['Admin']), audit('DELETE_TASK'), deleteTask);

export default router;