module.exports = function(app) {
  //Main page
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user
    });
  });

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
