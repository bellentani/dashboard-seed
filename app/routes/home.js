// routes/home.js
module.exports = function (app,passport) {
    // Como aqui o consign já nos dá o app, basta lembrarmos que ele contem tudo carregado dentro dele, 
    // então basta acessa a nossa controller diretamente dele
    var homeController = app.controllers.home;
    app.get('/', homeController.get);
};

//http://blog.digithobrasil.com.br/trabalhando-com-rotas-em-node-usando-express/
