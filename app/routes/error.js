module.exports = function (app, passport) {
    //Error com server
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).render('500.hbs', err);
    });
}