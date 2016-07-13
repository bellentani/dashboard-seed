// O consign irá automaticamente injetar a instância do seu app em cada objeto que ele carregar
module.exports = function (app,passport) { 
    // Actions da controller
    var homeController = {
        get: function (req, res) {
            res.render('index',{
            	title: 'Dashboard Seed',
            	user: res.user,
            	message: req.flash('loginMessage'),
            });
        }
    };
    return homeController;
};

