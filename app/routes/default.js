var path = require('path');
var fs = require('fs');
var async = require('async');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var multer = require('multer'); //controla arquivos

var request = require('request'); // trata request
var gravatar = require('gravatar-api'); //load gravatar

//var im = require('imagemagick'); //opcional

var connect = require('../../config/connection');
var User = require('../models/user');

module.exports = function(app, passport) {
  //Main page
  app.get('/', function(req, res){
    if (req.isAuthenticated()) {
      res.redirect('/profile');
      //por enquanto redirecionando para o profile, mas irá ter uma home
      //com o resumo das atividades do usuário, como se fosse um dashboard mesmo
      //avatarUser(req, res, req.user, req.user, 'profile');
    } else {
      res.render('index', {
        title: 'Dashboard Seed',
        user: req.user,
        message: req.flash('loginMessage')
      });
    }
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

  //Login
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    })
  );

  //Function to load user with avatar
  function avatarUser(req, res, userView, userLogged, renderView) {
    //a definição da variávei user altera o local que ele lê,
    //se vier como req.user quer dizer que vai pegar a seção do USUARIO LOGADO na roda /profile
    //se vier como user é do usuário sendo consultado no banco pela rota user/:id
    var options = {
      email: userView.local.email,
      parameters: { 'size': '200', 'd': '404'}, //https://localhost:5000/img/avatares/'+randomAvatar(1, 17)+'.png
      secure: true
    }
    var hasAvatar = userView.avatar;
    var avatar = gravatar.imageUrl(options);
    //verifica se tem avatar cadastrado
    if (hasAvatar == '' || hasAvatar == null) {
      request({uri:avatar}, function (error, response) {
        //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
        if (!error && response.statusCode == 200) {
          //se o gravatar existe, então avatar é igual a url dele
          avatar = avatar;
        } else if (!error && response.statusCode == 404) {
          //se não existe, o avatar será o coelho (por enquanto). :P
          avatar = '/img/avatares/6.png';
        }
        //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
        res.render(renderView, {
          userView: userView,
          userLogged: userLogged,
          avatar: avatar,
          message: req.flash()
        });
        //console.log(response.statusCode);
      });
    } else {
      //Nesse caso já tem avatar cadastrado, por personalização, portanto, não precisa do gravatar
      avatar = hasAvatar;
      //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
      res.render(renderView, {
        userView: userView,
        userLogged: userLogged,
        avatar: avatar,
        message: req.flash()
      });
    }
  }


  //Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
