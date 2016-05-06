var bodyParser = require('body-parser');

/*
Artigos que estamos usando como referência para configuração inicial:
http://www.peachpit.com/articles/article.aspx?p=2252193&seqNum=4
https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
http://mongoosejs.com/docs/models.html
*/

module.exports = function(app, passport) {
  //var User = require('../models/user');

  //Main page
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user
    });
  });

  //Signup
  app.get('/signup', function(req, res){
    res.render('signup', {
      title: 'Cadastre-se',
      user: req.user,
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  //Perfil do usuário
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user : req.user
    });
  });

  //Esqueci a senha
  app.get('/forgot', function(req, res){
    res.render('forgot', {
      title: 'Esqueci minha senha',
      user: req.user
    });
  });

  //Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  //Error 404
  app.use(function(req, res, next) {
    res.status(404).render('404.hbs'); // load the index.handlebars file
  });

  //Error com server
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500.hbs', err);
  });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
