const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const authRouter = require('./routes/authRoutes');
const router = require('./routes/routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', authRouter);
app.use('/', router);

module.exports = app;
