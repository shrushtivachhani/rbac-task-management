import Team from '../models/Team.js';
import User from '../models/User.js';

const createTeam = async (req, res) => {
  const { teamName, roleType, teamLeadId } = req.body;
  if (!teamName) return res.status(400).json({ message: 'teamName required' });
  const team = await Team.create({ teamName, roleType, teamLeadId, createdBy: req.user.userId });
  if (teamLeadId) {
    await User.findByIdAndUpdate(teamLeadId, { teamId: team._id });
  }
  res.status(201).json(team);
};

const listTeams = async (req, res) => {
  const actor = req.user;
  if (actor.role === 'Admin' || actor.role === 'Super Employee') {
    const teams = await Team.find().populate('teamLeadId members', 'name email role').lean();
    return res.json(teams);
  }
  if (actor.role === 'HR') {
    const teams = await Team.find({ roleType: 'HR' }).populate('members teamLeadId', 'name email role').lean();
    return res.json(teams);
  }
  if (actor.role === 'BDM') {
    const teams = await Team.find({ roleType: 'ASM' }).populate('members teamLeadId', 'name email role').lean();
    return res.json(teams);
  }
  if (actor.role === 'ASM') {
    const teams = await Team.find({ teamLeadId: actor.userId }).populate('members', 'name email role').lean();
    return res.json(teams);
  }
  // Employee: teams they belong to
  const teams = await Team.find({ members: actor.userId }).populate('teamLeadId members', 'name email role').lean();
  res.json(teams);
};

const updateTeam = async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!team) return res.status(404).json({ message: 'Team not found' });
  res.json(team);
};

const deleteTeam = async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ message: 'Team deleted' });
};


export { createTeam, listTeams, updateTeam, deleteTeam };