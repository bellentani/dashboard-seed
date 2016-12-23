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
    }
  });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
