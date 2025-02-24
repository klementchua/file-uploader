const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.indexGet);
router.get('/sign-up', (req, res) => res.render('sign-up-form'));
router.post('/sign-up', controller.signUpPost);
router.get('/upload-file', (req, res) => res.render('upload-file-form'));
router.post('/upload-file', controller.uploadFilePost);
router.get('/files/:id', controller.getFile);
router.get('/files/:id/download/:filename', controller.downloadFile);

module.exports = router;
