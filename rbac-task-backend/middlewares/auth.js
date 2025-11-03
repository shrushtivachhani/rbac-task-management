// middlewares/auth.js (FIXED)
import jwtUtils from '../utils/jwt.js';
import User from '../models/User.js';

// verifyToken attaches req.user = { userId, role, teamId (if set) }
export const verifyToken = async (req, res, next) => { // Use named export
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const payload = jwtUtils.verifyAccessToken(token);
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ message: 'Invalid token (user not found)' });
    req.user = { userId: user._id.toString(), role: user.role, teamId: user.teamId ? user.teamId.toString() : null };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

// checkRole(["Admin","HR"])
export const checkRole = (allowedRoles = []) => { // Use named export
  return (req, res, next) => {
    if (!req.user) return res.status(500).json({ message: 'verifyToken must run before checkRole' });
    if (allowedRoles.includes(req.user.role) || allowedRoles.length === 0) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
};

