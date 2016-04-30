module.exports = function(app, passport) {
  //Main page
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user,
      signupmessage: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  //Perfil do usuário
  app.get('/profile', function(req, res){
    res.render('profile', {
      title: 'Perfil do Usuário',
      user: req.user
    });
  });

  //Esqueci a senha
  app.get('/forgot', function(req, res){
    res.render('forgot', {
      title: 'Esqueci minha senha',
      user: req.user
    });
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
