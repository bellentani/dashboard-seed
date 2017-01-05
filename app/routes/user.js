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

// var connect = require('../../config/connection');
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
      controllers.avatarUser(req, res, user, req.user, 'profile');
    });

  });
}
