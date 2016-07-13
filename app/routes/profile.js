// routes/home.js
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
module.exports = function (app,passport) {
    
    var profileController = app.controllers.profile;
    // GET
    app.get('/profile/', isLoggedIn, profileController.get);
    app.get('/profile/edit', isLoggedIn, profileController.getEdit);
    app.get('/profile/edit/avatar', isLoggedIn, profileController.getAvatar);
    // POST
    app.post('/profile/edit', profileController.postEdit);
    app.post('/profile/edit/avatar', profileController.postAvatar);
};
