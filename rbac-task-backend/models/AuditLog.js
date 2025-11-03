import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  actionType: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  role: String,
  details: String,
  timestamp: { type: Date, default: Date.now }
});


export default mongoose.model('AuditLog', AuditLogSchema);

