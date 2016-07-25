var path = require('path');
var fs = require('fs');
var async = require('async');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

//controla arquivos
var multer = require('multer');

// trata request
var request = require('request');

//load gravatar
var gravatar = require('gravatar-api');

var connect = require('../../config/connection');
var User = require('../models/user');
var funcoes = require('../controllers/index');

/*
Artigos que estamos usando como referência para configuração inicial:
http://www.peachpit.com/articles/article.aspx?p=2252193&seqNum=4
https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
http://mongoosejs.com/docs/models.html
*/

module.exports = function (app, passport) {
  //Main page
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Dashboard Seed',
      user: req.user,
      message: req.flash('loginMessage'),
    });
  });

  //Signup
  //teste de rota
  var signup = require('../controllers/signup');
  app.get('/signup', signup.get);

  app.post('/signup', signup.post);

  //Verifica se o e-mail existe
  app.post('/endpoint', function (req, res) {
    var obj = {};
    // obj.email = req.body.email;
    // obj.status = 'teste';

    User.findOne({ 'local.email': req.body.email }, function (err, user) {
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
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
  );

  //Perfil do usuário - pessoal
  app.get('/profile/', funcoes.isLoggedIn, function (req, res) {
    funcoes.avatarUser(req, res, req.user, req.user, 'profile');

    // Random script
    // var userAvatar = req.user.avatar;
    // if (userAvatar == '') {
    //   avatar = '/img/avatares/'+randomAvatar(1, 17)+'.png';
    // }
    // function randomAvatar(min, max) {
    //   return ~~(Math.random() * (max - min + 1)) + min
    // }

    //console.log(avatar, options.email);
    //
    // res.render('profile', {
    //     user: req.user,
    //     avatar: avatar
    // });
  });

  //Perfil do usuário - pessoal
  app.get('/profile/edit', funcoes.isLoggedIn, function (req, res) {
    funcoes.avatarUser(req, res, req.user, req.user, 'profile_edit');
  });

  //Perfil do usuário - pessoal
  app.post('/profile/edit', function (req, res) {
    // Update User
    User.findById(req.user.id, function (error, user) {
      if (error) {
        req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro.');
        //res.send(error);
      }

      user.name = req.body.name;  // update the user info
      user.local.email = req.body.email;
      user.alias = req.body.alias;
      user.resume = req.body.resume;
      if (req.body.email) {
        // save user
        user.save(function (error) {
          if (error) {
            req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro.');
            //res.send(error);
          }
          req.flash('success', 'usuário atualizado');
          res.redirect('/profile/edit');
        });
      } else {
        req.flash('error', 'O e-mail não pode ser vazio');
        res.redirect('/profile/edit');
      }

    });
    console.log(req.body);
  });

  app.get('/profile/edit/avatar', funcoes.isLoggedIn, function (req, res) {
    funcoes.avatarUser(req, res, req.user, req.user, 'profile_edit');
  });
  app.post('/profile/edit/avatar', function (req, res) {
    var upload = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, 'public/uploads/avatar');
      },
      filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          callback(null, raw.toString('hex') + Date.now());
        });
      }
    });
    var uploader = multer({ storage: upload }).single('avatarEdit');
    uploader(req, res, function (err) {
      if (err) {
        req.flash('error', 'Houve algum problema em subir seu arquivo.');
        //return res.end("Error uploading file.");
      }
      console.log(req.file);

      User.findById(req.user.id, function (err, user) {
        if (err) {
          req.flash('error', 'Tivemos um problema em encontrar o seu avatar.');
          //res.send(err);
        }

        user.avatar = '/uploads/avatar/' + req.file.filename;  // update the user info

        // save user
        user.save(function (err) {
          if (err) {
            req.flash('error', 'Houve um problema enviando seu avatar.');
            //res.send(err);
          }

          res.redirect('/profile/edit');
          req.flash('success', 'usuário atualizado');
        });
      });
    });
    //adicionar arquivos
    //https://www.terlici.com/2015/05/16/uploading-files-locally.html
    //http://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
    //http://stackoverflow.com/questions/5294470/writing-image-to-local-server
    //http://stackoverflow.com/questions/16860334/how-to-load-and-save-image-using-node-js
  });

  //Perfil do usuário - pessoal
  app.get('/user/:alias', function (req, res) {
    //app.get('/user/', funcoes.isLoggedIn, function(req, res) { exemplo de função que checa se está logado

    User.findOne({ alias: req.params.alias }, function (err, user) {
      if (!user) {
        req.flash('error', 'Usuário não existe');
        return res.redirect('/');
      }
      //console.log(user.local.email)
      funcoes.avatarUser(req, res, user, req.user, 'profile');
    });

  });

  //Logout
  //teste de rota
  var logout = require('../controllers/logout');
  app.get('/logout', logout.logout);

  //reset password
  //Using base http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
  // app.get('/forgot', function (req, res) {
  //   res.render('forgot', {
  //     user: req.user,
  //     message: req.flash()
  //   });
  // });

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

  app.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
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

  app.post('/reset/:token', function (req, res) {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
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

  //Error 404
  app.use(function (req, res, next) {
    res.status(404).render('404.hbs'); // load the index.handlebars file
  });

  //Error com server
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500.hbs', err);
  });
}


