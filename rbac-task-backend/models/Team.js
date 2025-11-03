import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  roleType: { type: String },
  teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


export default mongoose.model('Team', TeamSchema);