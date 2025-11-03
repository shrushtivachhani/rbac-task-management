import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 
import Team from '../models/Team.js';

// Admin creates users
const createUser = async (req, res) => {
  const { name, email, password, role, teamId, managerId } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email, password: hashed, role,
    teamId: teamId || null,
    managerId: managerId || null,
    createdBy: req.user.userId
  });

  // add to team members list
  if (teamId) await Team.findByIdAndUpdate(teamId, { $addToSet: { members: user._id } });

  res.status(201).json({ message: 'User created', user });
};

const listUsers = async (req, res) => {
  const actor = req.user;
  // Admin: all users
  if (actor.role === 'Admin') {
    const users = await User.find().select('-password').lean();
    return res.json(users);
  }

  // HR: HR users only
  if (actor.role === 'HR') {
    const users = await User.find({ role: 'HR' }).select('-password').lean();
    return res.json(users);
  }

  // BDM: ASMs and their employees (approx: ASMs with managerId = BDM or team roleType = 'ASM')
  if (actor.role === 'BDM') {
    const teams = await Team.find({ roleType: 'ASM' }).lean(); // Fix for BDM list logic: fetch teams with roleType 'ASM'
    const teamIds = teams.map(t => t._id);
    const users = await User.find({ teamId: { $in: teamIds } }).select('-password').lean();
    return res.json(users);
  }

  // ASM: members of their teams
  if (actor.role === 'ASM') {
    const teams = await Team.find({ teamLeadId: actor.userId }).lean();
    const memberIds = teams.flatMap(t => t.members || []);
    const users = await User.find({ _id: { $in: memberIds } }).select('-password').lean();
    return res.json(users);
  }

  // Employee: only self
  const user = await User.findById(actor.userId).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json([user]);
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

const updateUser = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password; // password update via separate route ideally
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const deleteUser = async (req, res) => {
  // Pull user from any teams they belonged to
  const userId = req.params.id;
  await Team.updateMany({ members: userId }, { $pull: { members: userId } });
  
  // Also delete tasks created by or assigned to this user (optional cleanup)
  // await require('../models/Task').deleteMany({ $or: [{ assignedTo: userId }, { assignedBy: userId }] });

  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted' });
};


// FIX: Changed to named export list
export { createUser, listUsers, getUser, updateUser, deleteUser };