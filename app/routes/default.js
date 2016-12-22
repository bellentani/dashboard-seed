module.exports = function(app, passport) {
  //home
  app.get('/', function(req, res) {
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user,
      message: req.flash('loginMessage')
    });
  });
  //login
  //signup
}
