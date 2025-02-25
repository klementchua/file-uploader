const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.indexGet);
router.get('/sign-up', (req, res) => res.render('sign-up-form'));
router.post('/sign-up', controller.signUpPost);
router.get('/new-folder', (req, res) => res.render('new-folder-form'));
router.post('/new-folder', controller.newFolderPost);
router.get('/update-folder', controller.updateFolderGet);
router.post('/update-folder', controller.updateFolderPost);
router.get('/delete-folder', controller.deleteFolder, controller.indexGet);
router.get('/folder/:id', controller.getFolder);
router.get('/folder/:id/upload-file', (req, res) =>
  res.render('upload-file-form', { folderId: req.params.id })
);
router.post('/folder/:id/upload-file', controller.uploadFilePost);
router.get('/folder/:folderId/files/:fileId', controller.getFile);
router.get('/delete-file', controller.deleteFile);

module.exports = router;
