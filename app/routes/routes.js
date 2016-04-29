module.exports = function(app) {
  //Main page
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Express',
      user: req.user
    });
  });

  //Perfil do usuário
  app.get('/profile', function(req, res){
    res.render('profile', {
      title: 'Express',
      user: req.user
    });
  });
}
