const { body, validationResult } = require('express-validator')
const { ObjectId } = require('mongodb');

const recipeValidationRules = () => {
  return [
    body('authorID')
        .notEmpty().withMessage('Author ID is required')
        .isMongoId().withMessage('Author ID must be a valid MongoDB ID'),
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('servings')
        .notEmpty().withMessage('Servings are required')
        .isInt({ min: 1 }).withMessage('Servings must be a positive integer'),
    body('time')
        .notEmpty().withMessage('Time is required')
        .isInt({ min: 1 }).withMessage('Time must be a positive integer representing minutes'),
    body('cuisineType')
        .notEmpty().withMessage('Cuisine type is required')
        .isString().withMessage('Cuisine type must be a string'),
    body('mealType')
        .notEmpty().withMessage('Meal type is required')
        .isString().withMessage('Meal type must be a string'),
    body('keyWords')
        .optional()
        .isArray().withMessage('Key Words must be an array')
        .custom((array) => array.every(word => typeof word === 'string')).withMessage('Each keyWord must be a string')
  ]
}

const recipeUpdateValidationRules = () => {
  return [
    body('title').isString().withMessage('Title must be a string')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
    body('description').isString().withMessage('Description must be a string')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('servings').isInt({ min: 1 }).withMessage('Servings must be a positive integer'),
    body('time').isInt({ min: 1 }).withMessage('Time must be a positive integer representing minutes'),
    body('cuisineType').isString().withMessage('Cuisine type must be a string'),
    body('mealType').isString().withMessage('Meal type must be a string'),
    body('keyWords')
        .optional()
        .isArray().withMessage('KeyWords must be an array')
        .custom((array) => array.every(word => typeof word === 'string')).withMessage('Each keyWord must be a string')
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
  recipeValidationRules,
  recipeUpdateValidationRules,
  validate,
}