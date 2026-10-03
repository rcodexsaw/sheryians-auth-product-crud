const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createAccessToken, createRefreshToken, hashToken } = require('../utils/tokens');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const safeUser = user => ({ id: user._id, name: user.name, email: user.email });

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: 'Email is already registered' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful', user: safeUser(user) });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokenHash');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();
    res.cookie('refreshToken', refreshToken, cookieOptions());
    res.json({ message: 'Login successful', accessToken, user: safeUser(user) });
  } catch (err) { next(err); }
}

async function refreshToken(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token. Please login again.' });
    }
    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.clearCookie('refreshToken', cookieOptions());
    return res.status(401).json({ message: 'Invalid or expired refresh token. Please login again.' });
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshTokenHash: null } });
    res.clearCookie('refreshToken', cookieOptions());
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
}

async function me(req, res) {
  res.json({ user: safeUser(req.user) });
}

module.exports = { register, login, refreshToken, logout, me };
