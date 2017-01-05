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
    controllers.avatarUser(req, res, req.user, req.user, 'profile');

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
}
