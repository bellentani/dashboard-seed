var request = require('request'); // trata request
var gravatar = require('gravatar-api'); //load gravatar

module.exports = {
  path: require('path'),
  fs: require('fs'),
  async: require('async'),
  bodyParser: require('body-parser'),
  crypto: require('crypto'),
  flash: require('connect-flash'),
  mongoose: require('mongoose'),
  nodemailer: require('nodemailer'),
  multer: require('multer'),
  request: request,
  gravatar: gravatar
};
