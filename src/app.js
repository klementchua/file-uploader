const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRouter = require('./routes/authRoutes');
const router = require('./routes/routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(session({ secret: 'secret', saveUninitialized: false, resave: false }));
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', authRouter);
app.use('/', router);

module.exports = app;
