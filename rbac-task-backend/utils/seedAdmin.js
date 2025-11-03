import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js'; 
import Team from '../models/Team.js';

const seedAdminIfNeeded = async (appOrNull) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping seeding.');
    return;
  }

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log('Admin already exists, skipping seed.');
    return;
  }

  // create Admin role if not exists
  let adminRole = await Role.findOne({ roleName: 'Admin' });
  if (!adminRole) {
    adminRole = await Role.create({
      roleName: 'Admin',
      accessLevel: 'Full Access',
      description: 'System Administrator - full permissions',
      permissions: ['CREATE_TASK','VIEW_TEAM','VIEW_ALL','CREATE_USER','MANAGE_ROLE','VIEW_AUDIT','UPDATE_TASK']
    });
  }

  const hashed = await bcrypt.hash(adminPassword, 10);
  const adminUser = await User.create({
    name: 'System Admin',
    email: adminEmail,
    password: hashed,
    role: 'Admin',
    status: 'active',
    createdBy: null
  });

  console.log('Seeded Admin:', adminEmail);
};

export default { seedAdminIfNeeded };
