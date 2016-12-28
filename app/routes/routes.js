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

var excluded = ['index'];
var validFileTypes  = ['js'];

var requireFiles = function (directory, app, passport) {
  fs.readdirSync(directory).forEach(function (fileName) {
    // Recurse if directory
    if(fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      requireFiles(directory + '/' + fileName, app, passport);
    } else {
      // Skip this file
      if(fileName === 'routes.js' && directory === __dirname) return;
      // Skip unknown filetypes
      if(validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;
      // Require the file.
      require(directory + '/' + fileName)(app, passport);
    }
  });
};

module.exports = function(app, passport) {

  requireFiles(__dirname, app, passport);

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
