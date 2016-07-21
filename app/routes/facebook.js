module.exports = function (app, passport) {
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/profile');
        });
}