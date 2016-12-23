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
  //Perfil do usuário - pessoal
  app.get('/user/:alias', function(req, res) {
  //app.get('/user/', isLoggedIn, function(req, res) { exemplo de função que checa se está logado

    User.findOne({ alias: req.params.alias}, function(err, user) {
      if (!user) {
        req.flash('error', 'Usuário não existe');
        return res.redirect('/');
      }
      //console.log(user.local.email)
      avatarUser(req, res, user, req.user, 'profile');
    });

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
