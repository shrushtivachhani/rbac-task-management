/**
 * validateScope middleware ensures that the acting user can only access resources
 * within their allowed scope according to hierarchy. It expects `req.params.id` for
 * target user/team/task where applicable, or `req.body.teamId/assignedTo`.
 *
 * The hierarchy logic:
 * - Admin: full access
 * - Super Employee: global view & task update but not create/delete users/roles
 * - HR: manages HR employees only (role/type matching)
 * - BDM: manages ASM team and their tasks
 * - ASM: manages assigned salespersons (members of their team)
 * - Employee: only self (or assigned tasks)
 *
 * This is a simplified example — tailor to your business rules.
 */

import User from '../models/User.js'; 
import Team from '../models/Team.js';
import Task from '../models/Task.js';

const hierarchy = ['Admin','HR','BDM','ASM','Employee','Super Employee'];

const validateScope = (options = {}) => {
  // options may include { target: 'user'|'team'|'task'|'any' }
  return async (req, res, next) => {
    try {
      const actor = req.user;
      if (!actor) return res.status(500).json({ message: 'verifyToken must run before validateScope' });

      if (actor.role === 'Admin') return next(); // Admin overrides

      // Super Employee: read and update tasks globally; block user/role management
      if (actor.role === 'Super Employee') {
        // block user/role creation/deletion paths handled in controllers via checkRole
        return next();
      }

      const target = options.target || 'any';

      // If target is user or team or task check specific rules
      if (target === 'user') {
        const targetUserId = req.params.id || req.body.userId;
        if (!targetUserId) return res.status(400).json({ message: 'target user id missing' });
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: 'Target user not found' });

        // HR can manage HR employees only
        if (actor.role === 'HR') {
          if (targetUser.role === 'HR') return next();
          return res.status(403).json({ message: 'HR can only manage HR employees' });
        }

        // BDM can manage ASMs and their employees
        if (actor.role === 'BDM') {
          if (targetUser.role === 'ASM' || targetUser.managerId?.toString() === actor.userId) return next();
          return res.status(403).json({ message: 'BDM can only manage ASMs and their direct employees' });
        }

        // ASM can manage only assigned salespersons (members of their team)
        if (actor.role === 'ASM') {
          const myTeams = await Team.find({ teamLeadId: actor.userId }).lean();
          const myMemberIds = new Set();
          myTeams.forEach(t => (t.members || []).forEach(m => myMemberIds.add(m?.toString())));
          if (myMemberIds.has(targetUser._id.toString())) return next();
          return res.status(403).json({ message: 'ASM can manage only members of their team' });
        }

        // Employee can only read/update self
        if (actor.role === 'Employee') {
          if (actor.userId === targetUser._id.toString()) return next();
          return res.status(403).json({ message: 'Employee can access only their own profile' });
        }
      }

      if (target === 'task') {
        const taskId = req.params.id || req.body.taskId || req.body.assignedTo;
        if (!taskId) return res.status(400).json({ message: 'task id missing' });
        const task = await Task.findById(taskId).lean();
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Employee can only access tasks assigned to them
        if (actor.role === 'Employee') {
          if (task.assignedTo?.toString() === actor.userId) return next();
          return res.status(403).json({ message: 'Employee can access only their assigned tasks' });
        }

        // ASM: if task.teamId belongs to ASM's teams
        if (actor.role === 'ASM') {
          const myTeams = await Team.find({ teamLeadId: actor.userId }).lean();
          const myTeamIds = new Set(myTeams.map(t => t._id.toString()));
          if (task.teamId && myTeamIds.has(task.teamId.toString())) return next();
          return res.status(403).json({ message: 'ASM can access tasks of their teams only' });
        }

        // BDM: can access ASMs and their tasks (teams under ASMs)
        if (actor.role === 'BDM') {
          // naive implementation: allow if the task.teamId has roleType 'ASM' or team lead is ASM under this BDM
          // In real system maintain mapping of BDM -> ASM teams; for now allow BDM if team roleType === 'ASM'
          const team = await Team.findById(task.teamId).lean();
          if (team && team.roleType === 'ASM') return next();
          return res.status(403).json({ message: 'BDM can access ASM teams tasks only' });
        }

        // HR: only HR teams/tasks
        if (actor.role === 'HR') {
          const team = await Team.findById(task.teamId).lean();
          if (team && team.roleType === 'HR') return next();
          return res.status(403).json({ message: 'HR can access HR teams tasks only' });
        }
      }

      // default allow for other roles if not ruled out
      return next();
    } catch (err) {
      console.error('validateScope error', err);
      return res.status(500).json({ message: 'Scope validation failed', error: err.message });
    }
  };
};


export default validateScope;