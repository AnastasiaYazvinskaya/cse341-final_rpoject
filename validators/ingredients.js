const { body, validationResult } = require('express-validator');

const ingredientValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required.')
      .isString().isLength({ min: 3, max: 5 }).withMessage('Name must be between 3 and 5 characters.'),
    body('unit').notEmpty().withMessage('Unit is required.')
      .isString().isLength({ min: 3, max: 5 }).withMessage('Unit must be between 3 and 5 characters.'),
    body('quantity').notEmpty().withMessage('Quantity is required.')
      .isInt({ gt: 0 }).withMessage('Quantity must be greater than 0.'),
    body('recipeID').notEmpty().withMessage('Recipe ID is required.')
      .isMongoId().withMessage('Invalid Recipe ID format'),
  ]
}

const ingredientUpdateValidationRules = () => {
  return [
    body('name').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Name must be between 3 and 5 characters.'),
    body('unit').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Unit must be between 3 and 5 characters.'),
    body('quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be greater than 0.'),
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
  ingredientValidationRules,
  ingredientUpdateValidationRules,
  validate,
}