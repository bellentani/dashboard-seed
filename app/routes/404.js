module.exports = function (app, passport) {
    //Error 404
    app.use(function (req, res, next) {
        res.status(404).render('404.hbs'); // load the index.handlebars file
    });
}