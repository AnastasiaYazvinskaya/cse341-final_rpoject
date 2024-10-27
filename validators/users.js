const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('username content is required')
      .isString().isLength({ min: 3, max: 5 }).withMessage('Username must be between 3 and 5 characters.'),
    body('email').notEmpty().withMessage('Email content is required')
      .isEmail().withMessage('Email must be a valid email address.'),
    body('password').notEmpty().withMessage('Password content is required')
      .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
    body('birthday').optional().isISO8601().withMessage('Birthday must be in format YYYY-MM-DD')
  ]
}
const userUpdateValidationRules = () => {
    return [
      body('username').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Username must be between 3 and 5 characters.'),
      body('email').optional().isEmail().withMessage('Email must be a valid email address.'),
      body('password').optional().isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
      body('birthday').optional().isISO8601().withMessage('Birthday must be in format YYYY-MM-DD')
    ]
  }

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  userUpdateValidationRules,
  validate,
}