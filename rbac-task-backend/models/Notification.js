import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  message: String,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export default mongoose.model('Notification', NotificationSchema);