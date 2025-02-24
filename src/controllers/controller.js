const db = require('../models/model');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function indexGet(req, res) {
  const folders = await db.getFolders();
  res.render('index', { folders });
}

async function signUpPost(req, res) {
  const { username, password, isEditor } = req.body;
  const hashedpw = await bcrypt.hash(password, 10);
  await db.addUser({
    username,
    password: hashedpw,
    isEditor: isEditor === 'editor',
  });
  res.redirect('/');
}

async function downloadFile(req, res) {
  const filename = req.params.filename;
  res.download(`uploads/${filename}`);
}

async function newFolderPost(req, res) {
  const { name } = req.body;
  await db.addFolder({ name });
  res.redirect('/');
}

async function updateFolderGet(req, res) {
  const { name, id } = req.query;
  res.render('update-folder-form', { name, id });
}

async function updateFolderPost(req, res) {
  const { id } = req.query;
  const { name } = req.body;
  await db.updateFolder(parseInt(id), name);
  res.redirect('/');
}

async function deleteFolder(req, res, next) {
  const { id } = req.query;
  await db.deleteFolder(parseInt(id));
  next();
}

async function getFolder(req, res) {
  const folder = await db.getFolderWithFilesById(parseInt(req.params.id));
  res.render('folder', { folder });
}

const uploadFilePost = [
  upload.single('uploadedFile'),
  async (req, res) => {
    const { originalname, size, filename } = req.file;
    await db.addFile(
      { title: originalname, filename, size },
      parseInt(req.params.id)
    );
    res.redirect(`/folder/${req.params.id}`);
  },
];

async function getFile(req, res) {
  const file = await db.getFileById(parseInt(req.params.fileId));
  res.render('file', { file });
}

async function deleteFile(req, res) {
  const { id, fid } = req.query;
  await db.deleteFile(parseInt(id));
  const folder = await db.getFolderWithFilesById(parseInt(fid));
  res.render('folder', { folder });
}

module.exports = {
  indexGet,
  signUpPost,
  downloadFile,
  newFolderPost,
  updateFolderGet,
  updateFolderPost,
  deleteFolder,
  getFolder,
  uploadFilePost,
  getFile,
  deleteFile,
};
