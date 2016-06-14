var async = require('async');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var User = require('../models/user');

/*
Artigos que estamos usando como referência para configuração inicial:
http://www.peachpit.com/articles/article.aspx?p=2252193&seqNum=4
https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
http://mongoosejs.com/docs/models.html
*/

module.exports = function(app, passport) {
  //Main page
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user,
      message: req.flash('loginMessage'),
    });
  });

  //Signup
  app.get('/signup', function(req, res){
    res.render('signup', {
      title: 'Cadastre-se',
      user: req.user,
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', function(req, res) {

      req.check('signup_email', 'E-mail inválido').isEmail();
      req.check('signup_password', 'A senha precisa ter mais que 4 caracteres').isLength({min: 4});
      req.check('signup_password', 'As senhas não são iguais').equals(req.body.confirm_password);

      var errors = req.validationErrors(true); //colocar (true) para transformar em objeto

      if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.render('signup', {user:null, errors:errors});
        console.log(errors);
        req.flash('error', errors);
      } else {
        passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/signup', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
        })(req, res);
      }
    }
  );

  //Verifica se o e-mail existe
  app.post('/endpoint', function(req, res){
    var obj = {};
    // obj.email = req.body.email;
    // obj.status = 'teste';

    User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err);

      // check to see if theres already a user with that email
      if (user) {
        doMe('email existe');
      } else {
        doMe('email livre');
      }
    });

    //This function works on Async, if we dont use it the send(obj) will be empty
    function doMe(i) {
      obj.status = i;
      obj.email = req.body.email;
      res.send(obj);
      //console.log(obj);
      //console.log('body: ' + JSON.stringify(obj), req.body.email);
    }

    //Sample to future use
    // db.collection('user').findOne({ 'local.email' : req.body.email}, function (err, doc) {
    //   if(err) throw err;
    //   if(doc) {
    //     console.log("Found: " + local.email);
    //     console.log('body: ', req.body.email);
    //     res.send(req.body);
    //   } else {
    //     console.log("Not found: " + local.email);
    //   }
    //   db.close();
    // });

  });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  //Perfil do usuário
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user: req.user
    });
  });

  //Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //reset password
  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
  });

  app.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ 'local.email': req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var connection = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'ocoelhobranco@gmail.com',
                pass: 'mcoedhradqbsqaaj'
            }
        };
        var transporter = nodemailer.createTransport(connection);

        var mailOptions = {
          to: user.local.email,
          from: 'passwordreset@demo.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        transporter.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user,
        show: 'true'
      });
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var connection = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'ocoelhobranco@gmail.com',
                pass: 'mcoedhradqbsqaaj'
            }
        };
        var transporter = nodemailer.createTransport(connection);
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


  //Error 404
  app.use(function(req, res, next) {
    res.status(404).render('404.hbs'); // load the index.handlebars file
  });

  //Error com server
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500.hbs', err);
  });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
