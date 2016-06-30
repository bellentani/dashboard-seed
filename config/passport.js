//https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var LocalStrategy  = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var request = require('request'); // trata request
var gravatar = require('gravatar-api'); //load gravatar
var chance = require('chance').Chance(); // Load and instantiate Chance

var shortid = require('shortid');
shortid.seed(1984);

var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
  //serializer
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });
  //LOCAL strategy
  //signup
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'signup_email',
      passwordField : 'signup_password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, signup_email, signup_password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      User.findOne({ 'local.email' :  signup_email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) {
            return done(null, false, req.flash('signupMessage', 'Esse e-mail já está em uso.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser            = new User();

          //tratar avatar
          var options = {
            email: signup_email,
            parameters: { 'size': '200', 'd': '404'}, //https://localhost:5000/img/avatares/'+randomAvatar(1, 17)+'.png
            secure: true
          }
          var avatar = gravatar.imageUrl(options);

          var avatar_user;

          request({uri:avatar}, function (error, response) {
            if (!error && response.statusCode == 404) {
              //sys.puts(body) // Print the google web page.
              avatar_user = '/img/avatares/'+chance.natural({min: 1, max: 17})+'.png';
              createNewUser(avatar_user, signup_email, signup_password);
            } else {
              avatar_user = '';
              createNewUser(avatar_user, signup_email, signup_password);
            }
            //console.log(response.statusCode);
          });

          function createNewUser(avatar_user, signup_email, signup_password) {
            // set the user's local credentials
            newUser.local.email = signup_email;
            newUser.alias = shortid.generate();
            newUser.avatar = avatar_user;
            newUser.permission = 'user';
            newUser.name = req.body.name;
            newUser.local.password = newUser.generateHash(signup_password);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
          }

        }
      });
    });
  }));

  //login
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'login_email',
    passwordField : 'login_password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, login_email, login_password, done) { // callback with email and password from our form
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  login_email }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
        return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(login_password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user);
    });
  }));

  //FACEBOOK strategy
  passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    //newUser.permission = "user";

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
};
