const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(({ path, msg, location }) => ({ field: path, message: msg, location }))
    });
  }
  next();
}

module.exports = handleValidationErrors;
