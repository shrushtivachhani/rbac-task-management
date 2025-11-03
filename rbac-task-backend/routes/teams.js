// routes/teams.js (CORRECT)

import express from 'express';
const router = express.Router();
import { createTeam, listTeams, updateTeam, deleteTeam } from '../controllers/teamController.js';
// This now correctly resolves the named exports from ../middlewares/auth.js
import { verifyToken, checkRole } from '../middlewares/auth.js'; 
import validateScope from '../middlewares/validateScope.js';
import audit from '../middlewares/auditMiddleware.js';

router.use(verifyToken);

router.post('/', checkRole(['Admin']), audit('CREATE_TEAM'), createTeam);
router.get('/', checkRole(['Admin','HR','BDM','ASM','Employee','Super Employee']), listTeams);
router.put('/:id', checkRole(['Admin','ASM']), validateScope({ target: 'team' }), audit('UPDATE_TEAM'), updateTeam);
router.delete('/:id', checkRole(['Admin']), audit('DELETE_TEAM'), deleteTeam);


export default router;