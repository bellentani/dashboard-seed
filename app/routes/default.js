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

var controllers = require('../controllers');

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

  //Login
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    })
  );

  //Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //Perfil do usuário - pessoal
  app.get('/profile/', controllers.isLoggedIn, function(req, res) {
    avatarUser(req, res, req.user, req.user, 'profile');

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

}
