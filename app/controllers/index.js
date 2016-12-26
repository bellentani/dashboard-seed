var request = require('request');
var gravatar = require('gravatar-api'); //load gravatar

module.exports = {
  isLoggedIn: function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.redirect('/');
  },
  sayHelloInEnglish: function() {
    return "HELLO";
  },
  sayHelloInSpanish: function() {
    //return "Hola";
    console.log('Hola');
  }
};
