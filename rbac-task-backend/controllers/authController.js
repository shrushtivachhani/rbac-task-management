// controllers/authController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import jwtUtils from '../utils/jwt.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = jwtUtils.signAccessToken({ userId: user._id.toString(), role: user.role, teamId: user.teamId?.toString() });
  const refreshToken = jwtUtils.signRefreshToken({ userId: user._id.toString() });

  // persist refresh token
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days fallback
  await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId
    }
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
  await RefreshToken.deleteOne({ token: refreshToken });
  return res.json({ message: 'Logged out' });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
  try {
    const payload = jwtUtils.verifyRefreshToken(refreshToken);
    const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenInDb) return res.status(401).json({ message: 'Refresh token invalid' });

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = jwtUtils.signAccessToken({ userId: user._id.toString(), role: user.role, teamId: user.teamId?.toString() });
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token', error: err.message });
  }
};

// FIX: Change to a named export for each function
export { login, logout, refresh };