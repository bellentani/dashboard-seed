module.exports = function (app, passport) {
    app.post('/forgot', function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ 'local.email': req.body.email }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'Nenhuma conta existe com esse email.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
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
                    subject: 'Recuperação de senha Dashboard Node',
                    text: 'Você está recebendo isto por que você ou alguém solicitou a modificação da senha para sua conta.\n\n + 
                    Por favor, clique no link abaixo ou cole-o no seu navegador para completar o processo:\n\n'
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'Se você não requisitou esta ação, por favor ignore este e-mail e sua senha continuará a mesma.'
                };

                transporter.sendMail(mailOptions, function (err) {
                    req.flash('info', 'Um email foi enviado para ' + user.local.email + ' com mais instruções.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });
}