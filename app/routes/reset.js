module.exports = function (app, passport) {
    //reset password
    //Using base http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
    // app.get('/forgot', function (req, res) {
    //   res.render('forgot', {
    //     user: req.user,
    //     message: req.flash()
    //   });
    // });
    app.get('/reset/:token', function (req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
            if (!user) {
                req.flash('error', 'A senha é inválida ou está expirada.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
                show: 'true'
            });
        });
    });

    app.post('/reset/:token', function (req, res) {
        async.waterfall([
            function (done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'A senha é inválida ou está expirada.');
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                });
            },
            function (user, done) {
                var connection = {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                        user: connect.user,
                        pass: connect.pass
                    }
                };
                var transporter = nodemailer.createTransport(connection);
                var mailOptions = {
                    to: user.local.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Sua senha foi reiniciada com sucesso',
                    text: 'Olá,\n\n' +
                    'Essa é a confirmação que sua senha para a conta ' + user.local.email + ' foi modificada.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
            }
        ], function (err) {
            res.redirect('/profile');
        });
    });
}