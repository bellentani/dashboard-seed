
module.exports = function (app, passport) {
    app.get('/signup', function (req, res) {
        res.render('signup', {
            title: 'Cadastre-se',
            user: req.user,
            message: req.flash('signupMessage')
        })
    });

    app.post('/signup', function (req, res) {
        req.check('signup_email', 'E-mail inválido').isEmail();
        req.check('signup_password', 'A senha precisa ter mais que 4 caracteres').isLength({ min: 4 });
        req.check('signup_password', 'As senhas não são iguais').equals(req.body.confirm_password);
        var errors = req.validationErrors(true); //colocar (true) para transformar em objeto
        if (errors) {
            req.session.errors = errors;
            req.session.success = false;
            res.render('signup', { user: null, errors: errors });
            console.log(errors);
            req.flash('error', errors);
        } else {
            passport.authenticate('local-signup', {
                successRedirect: '/profile', // redirect to the secure profile section
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })(req, res);
        }
    });
}
