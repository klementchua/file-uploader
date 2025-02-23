const db = require('../models/model');
const bcrypt = require('bcrypt');

function indexGet(req, res) {
  res.render('index');
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

module.exports = {
  indexGet,
  signUpPost,
};
