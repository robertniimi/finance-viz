module.exports = (app, strava) => {
  // ===== AUTHENTICATION ===== //
  app.get('/strava/auth',
    passport.authenticate('strava')
  );

  app.get('/strava/auth/callback',
    passport.authenticate('strava', {failureRedirect: '/login'}),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );
}

