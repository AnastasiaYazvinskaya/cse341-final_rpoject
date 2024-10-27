const routes = require('express').Router();

const controller = require('../controllers/comments');
const validator = require('../validators/comments');

routes.get('/', controller.getComments);
routes.get('/:id', controller.getComment);
routes.post('/', validator.commentValidationRules(), validator.validate, controller.addComment);
routes.put('/:id', validator.commentUpdateValidationRules(), validator.validate, controller.editComment);
routes.delete('/:id', controller.deleteComment);

module.exports = routes;