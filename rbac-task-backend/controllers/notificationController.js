import Notification from '../models/Notification.js';

const listNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifs = await Notification.find({ receiverId: userId }).sort('-timestamp').lean();
  res.json(notifs);
};

const markRead = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'ids array required' });
  await Notification.updateMany({ _id: { $in: ids }, receiverId: req.user.userId }, { $set: { isRead: true } });
  res.json({ message: 'Marked read' });
};


// FIX: Changed from export default { ... } to named export list
export { listNotifications, markRead };