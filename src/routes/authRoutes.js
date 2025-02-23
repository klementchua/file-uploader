const { Router } = require('express');
const authController = require('../controllers/authController');

const authRouter = Router();

authRouter.get('/log-in', (req, res) => res.render('log-in-form'));
authRouter.post('/log-in', authController.logIn);
authRouter.get('/log-out', authController.logOut);

module.exports = authRouter;
