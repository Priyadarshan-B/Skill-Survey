const passport = require('./passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/auth/failure',
  successRedirect: 'http://localhost:5173/dashboard',
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

exports.authFailure = (req, res) => {
  res.status(401).send('Failed to authenticate user');
};
