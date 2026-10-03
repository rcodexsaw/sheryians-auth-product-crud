const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function createAccessToken(user) {
  return jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function createRefreshToken(user) {
  return jwt.sign({ userId: user._id.toString(), type: 'refresh' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { createAccessToken, createRefreshToken, hashToken };
