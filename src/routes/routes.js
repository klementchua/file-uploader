const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.indexGet);
router.get('/sign-up', (req, res) => res.render('sign-up-form'));
router.post('/sign-up', controller.signUpPost);

module.exports = router;
