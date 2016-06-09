var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('../models/user');

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
      user: req.user,
      message: req.flash('loginMessage'),
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

  app.post('/signup', function(req, res) {

      req.check('signup_email', 'E-mail inválido').isEmail();
      req.check('signup_password', 'A senha precisa ter mais que 4 caracteres').isLength({min: 4});
      req.check('signup_password', 'As senhas não são iguais').equals(req.body.confirm_password);

      var errors = req.validationErrors(true); //colocar (true) para transformar em objeto

      if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.render('signup', {user:null, errors:errors});
        console.log(errors);
        req.flash('error', errors);
      } else {
        passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/signup', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
        })(req, res);
      }
    }
  );

  //Verifica se o e-mail existe

  app.post('/endpoint', function(req, res){

    var obj = {};
    obj.email = req.body.email;
    obj.status = 'email existe';

    User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err);

      obj = {};

      // check to see if theres already a user with that email
      if (user) {
        obj.status = 'email existe';
        obj.email = req.body.email;
        console.log('email já existe');
        return obj
      } else {
        obj.status = 'email livre';
        obj.email = req.body.email;
        console.log('email livre');
        return obj
      }
    });

  	console.log('body: ' + JSON.stringify(obj), req.body.email);
    res.send(obj);


    // db.collection('user').findOne({ 'local.email' : req.body.email}, function (err, doc) {
    //   if(err) throw err;
    //   if(doc) {
    //     console.log("Found: " + local.email);
    //     console.log('body: ', req.body.email);
    //     res.send(req.body);
    //   } else {
    //     console.log("Not found: " + local.email);
    //   }
    //   db.close();
    // });

  });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  //Perfil do usuário
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
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
