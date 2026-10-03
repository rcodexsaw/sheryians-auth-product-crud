const express = require('express');
const { body } = require('express-validator');
const { register, login, refreshToken, logout, me } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();
const passwordRule = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  passwordRule,
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
], validate, register);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

module.exports = router;
