const routes = require('express').Router();

const controller = require('../controllers/recipes');
const validator = require('../validators/recipes');

routes.get('/', controller.getRecipes);
routes.get('/:id', controller.getRecipe);
routes.post('/', validator.recipeValidationRules(), validator.validate, controller.addRecipe);
routes.put('/:id', validator.recipeUpdateValidationRules(), validator.validate, controller.editRecipe);
routes.delete('/:id', controller.deleteRecipe);

module.exports = routes;