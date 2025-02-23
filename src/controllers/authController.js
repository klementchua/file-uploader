const passport = require('../config/passport');

const logIn = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
});

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  logIn,
  logOut,
};
