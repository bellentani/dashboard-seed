var lib = require('../lib');
var controllers = require('../controllers');

var User = require('../models/user');

module.exports = function(app, passport) {
  //Perfil do usuário - pessoal
  app.get('/user/:alias', function(req, res) {
  //app.get('/user/', isLoggedIn, function(req, res) { exemplo de função que checa se está logado

    User.findOne({ alias: req.params.alias}, function(err, user) {
      if (!user) {
        req.flash('error', 'Usuário não existe');
        return res.status(404).redirect('/404/user');
      }
      //console.log(user.local.email)
      controllers.avatarUser(req, res, user, req.user, 'profile');
    });

  });
  app.get('/user/', function(req, res) {
    res.redirect('/profile');
  });
  app.get('/404/user', function(req, res) {
    res.render('profile.hbs', {
      userError: '404',
      message: req.flash()
    });
  });
}
