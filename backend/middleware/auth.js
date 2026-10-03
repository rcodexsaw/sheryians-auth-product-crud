const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.userId).select('_id name email');
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

module.exports = authenticate;
