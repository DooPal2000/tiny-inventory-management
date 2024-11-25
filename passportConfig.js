const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // User 모델 경로 확인 필요

passport.use(new LocalStrategy({
  usernameField: 'phonenum'  // 'phonenum'을 사용자 식별자로 지정
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passportConfig;