import Role from '../models/Role.js';
import PERMISSIONS from '../utils/permissions.js';

// Admin-only controllers
const createRole = async (req, res) => {
  const { roleName, accessLevel, description, permissions } = req.body;
  if (!roleName) return res.status(400).json({ message: 'roleName required' });
  const role = await Role.create({ roleName, accessLevel, description, permissions });
  res.status(201).json(role);
};

const listRoles = async (req, res) => {
  const roles = await Role.find().lean();
  res.json(roles);
};

const updateRole = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
};

const deleteRole = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: 'Role deleted' });
};

// FIX: Changed to named export list to match import { ... } syntax in the router
export { createRole, listRoles, updateRole, deleteRole };