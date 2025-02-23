const prisma = require('../config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return done(null, false, { message: 'Username is invalid' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password ' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    } finally {
      await prisma.$disconnect();
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = passport;
