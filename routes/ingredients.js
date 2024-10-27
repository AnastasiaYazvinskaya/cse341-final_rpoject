const routes = require('express').Router();

const controller = require('../controllers/ingredients');
const validator = require('../validators/ingredients');

routes.get('/', controller.getIngredients);
routes.get('/:id', controller.getIngredient);
routes.post('/', validator.ingredientValidationRules(), validator.validate, controller.addIngredient);
routes.put('/:id', validator.ingredientUpdateValidationRules(), validator.validate, controller.editIngredient);
routes.delete('/:id', controller.deleteIngredient);

module.exports = routes;