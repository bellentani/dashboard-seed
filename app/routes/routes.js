/*
Artigos que estamos usando como referência para configuração inicial:
http://www.peachpit.com/articles/article.aspx?p=2252193&seqNum=4
https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
http://mongoosejs.com/docs/models.html
*/


module.exports = function(app) {

  var User = require('../../config/user');

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
      user: req.user
    });
  });

  app.post('/signup', function(req, res, next) {

    var newUser = new User({
      email: req.body.email,
      name: req.body.name,
      permission: req.body.permission
    });

    newUser.save(function(err, newUser) {
      if (err) { return handleError(err); }
      res.json(201, newUser);
    });
  })

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
