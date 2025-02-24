const db = require('../models/model');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function indexGet(req, res) {
  const files = await db.getFiles();
  res.render('index', { files });
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

const uploadFilePost = [
  upload.single('uploadedFile'),
  async (req, res) => {
    const { originalname, size, filename } = req.file;
    await db.addFile({ title: originalname, filename, size });
    res.redirect('/');
  },
];

async function getFile(req, res) {
  const file = await db.getFileById(parseInt(req.params.id));
  res.render('file', { file });
}

async function downloadFile(req, res) {
  const filename = req.params.filename;
  res.download(`uploads/${filename}`);
}

module.exports = {
  indexGet,
  signUpPost,
  uploadFilePost,
  getFile,
  downloadFile,
};
