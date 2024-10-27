const { body, validationResult } = require('express-validator')

const commentValidationRules = () => {
  return [
    body('content').notEmpty().withMessage('Comment content is required')
      .isString().withMessage('Content must be a string'),
    body('authorID').notEmpty().withMessage('User ID is required')
      .isMongoId().withMessage('Invalid User ID format'),
    body('recipeID').notEmpty().withMessage('Recipe ID is required')
      .isMongoId().withMessage('Invalid Product ID format'),
  ]
}

const commentUpdateValidationRules = () => {
  return [
    body('content').notEmpty().withMessage('Content cannot be empty')
      .isString().withMessage('Content must be a string'),
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
  commentValidationRules,
  commentUpdateValidationRules,
  validate,
}