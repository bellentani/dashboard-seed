module.exports = {
  'facebookAuth' : {
    'clientID'      : '1732742797009907', // your App ID
    'clientSecret'  : '678ee8c6c70c2edfcdd7ca45f46e6e92', // your App Secret
    'callbackURL'   : 'http://localhost:5000/auth/facebook/callback',
    'passReqToCallback' : true,
    'profileFields': ['id', 'emails', 'name'] //This
  }
}
