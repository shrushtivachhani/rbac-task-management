import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  accessLevel: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String }]
}, { timestamps: true });


export default mongoose.model('Role', RoleSchema);