import Task from '../models/Task.js';
import User from '../models/User.js';
import Team from '../models/Team.js'; // FIX 1: Missing import for Team model

const createTask = async (req, res) => {
  const { title, description, assignedTo, teamId, priority, deadline, attachments } = req.body;
  if (!title || !assignedTo) return res.status(400).json({ message: 'title and assignedTo required' });

  // ensure assignedTo exists
  const assignee = await User.findById(assignedTo);
  if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

  const task = await Task.create({
    title,
    description,
    assignedBy: req.user.userId,
    assignedTo,
    teamId: teamId || assignee.teamId,
    priority: priority || 'medium',
    deadline,
    attachments: attachments || []
  });

  // add task id to user's tasksAssigned
  await User.findByIdAndUpdate(assignedTo, { $addToSet: { tasksAssigned: task._id } });

  // send notification (socket)
  const io = req.app.get('io');
  if (io) {
    io.to(assignedTo.toString()).emit('notification', { message: `New task assigned: ${task.title}`, taskId: task._id });
  }

  res.status(201).json(task);
};

const listTasks = async (req, res) => {
  const actor = req.user;

  if (actor.role === 'Admin' || actor.role === 'Super Employee') {
    const tasks = await Task.find().populate('assignedBy assignedTo teamId').lean();
    return res.json(tasks);
  }

  if (actor.role === 'HR') {
    // FIX 2: Replaced require(...) with imported Team model
    const teams = await Team.find({ roleType: 'HR' }).lean(); 
    const teamIds = teams.map(t => t._id);
    const tasks = await Task.find({ teamId: { $in: teamIds } }).populate('assignedBy assignedTo teamId').lean();
    return res.json(tasks);
  }

  if (actor.role === 'BDM') {
    // FIX 2: Replaced require(...) with imported Team model
    const teams = await Team.find({ roleType: 'ASM' }).lean(); 
    const teamIds = teams.map(t => t._id);
    const tasks = await Task.find({ teamId: { $in: teamIds } }).populate('assignedBy assignedTo teamId').lean();
    return res.json(tasks);
  }

  if (actor.role === 'ASM') {
    // FIX 2: Replaced require(...) with imported Team model
    const myTeams = await Team.find({ teamLeadId: actor.userId }).lean(); 
    const myTeamIds = myTeams.map(t => t._id);
    const tasks = await Task.find({ teamId: { $in: myTeamIds } }).populate('assignedBy assignedTo teamId').lean();
    return res.json(tasks);
  }

  if (actor.role === 'Employee') {
    const tasks = await Task.find({ assignedTo: actor.userId }).populate('assignedBy assignedTo teamId').lean();
    return res.json(tasks);
  }

  res.json([]);
};

const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedBy assignedTo teamId').lean();
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  // Allow assignee, Admin, or Super Employee to update
  const actor = req.user;
  if (actor.role !== 'Admin' && actor.role !== 'Super Employee' && task.assignedTo?.toString() !== actor.userId) {
    return res.status(403).json({ message: 'Only Admin, Super Employee, or assigned user can update task' });
  }

  // updates
  const allowed = ['title','description','priority','status','deadline','attachments','comments','assignedTo'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) task[k] = req.body[k];
  });

  // if assignedTo changed, update tasksAssigned lists
  if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo?.toString()) {
    await User.findByIdAndUpdate(task.assignedTo, { $pull: { tasksAssigned: task._id } });
    await User.findByIdAndUpdate(req.body.assignedTo, { $addToSet: { tasksAssigned: task._id } });
  }

  await task.save();
  res.json(task);
};

const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};

// FIX 3: Changed to named export list to match import { ... } syntax in routes/tasks.js
export { createTask, listTasks, getTask, updateTask, deleteTask };