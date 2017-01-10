const User = require('../../models/user');

exports.findByIdAndUpdate = function (userId, userData) {
  return new Promise(function (resolve, reject) {
    User.findById(userId).exec(function (error, user) {
      if (error) {
        console.log('err: ', err);
        reject(err);
      }
      user.name = userData.name;  // update the user info
      user.local.email = userData.email;
      user.alias = userData.alias;
      user.resume = userData.resume;
      user.save(function (error) {
        if (error) {
          console.log('err: ', err);
          return reject(err);
        }
        resolve(user);
      });
    });
  });
};