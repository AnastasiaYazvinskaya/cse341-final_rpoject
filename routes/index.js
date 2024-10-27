const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tags=['Welcome']
    res.send("Welcome to CookIt! Share you recipes and find something new");
});

router.use('/users', require('./users'));
router.use('/ingredients', require('./ingredients'));
router.use('/recipes', require('./recipes'));
router.use('/comments', require('./comments'));

module.exports = router;