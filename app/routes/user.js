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
        return res.redirect('/');
      }
      //console.log(user.local.email)
      controllers.avatarUser(req, res, user, req.user, 'profile');
    });

  });
}
