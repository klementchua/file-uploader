const db = require('../models/model');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();
const supabase = require('../config/supabase');

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
  const files = await db.getFilesByFolder(parseInt(id));
  const { data, error } = await supabase.storage
    .from('uploads')
    .remove(files.map((file) => `public/${file.filename}`));
  if (error) {
    console.log(`Error deleting folder: `, error);
  }
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
    const { originalname, size } = req.file;
    const filename = `${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`public/${filename}`, req.file.buffer, {
        contentType: req.file.mimetype,
      });
    if (error) {
      console.error('Error uploading file: ', error);
      return null;
    }
    const { data: publicUrlData } = await supabase.storage
      .from('uploads')
      .getPublicUrl(`public/${filename}`);
    await db.addFile(
      { title: originalname, filename, size, url: publicUrlData.publicUrl },
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
  const filename = (await db.getFileById(parseInt(id))).filename;
  const { data, error } = await supabase.storage
    .from('uploads')
    .remove([`public/${filename}`]);
  if (error) {
    console.log(`Error deleting file: `, error);
  }
  await db.deleteFile(parseInt(id));
  const folder = await db.getFolderWithFilesById(parseInt(fid));
  res.render('folder', { folder });
}

module.exports = {
  indexGet,
  signUpPost,
  newFolderPost,
  updateFolderGet,
  updateFolderPost,
  deleteFolder,
  getFolder,
  uploadFilePost,
  getFile,
  deleteFile,
};
