var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var connect = require('../../config/connection');
var User = require('../models/user');

module.exports = function (app, passport) {
  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user,
      message: req.flash()
    });
  });
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
                    req.flash('error', 'No account with that email address exists.');
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
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
  });
}
