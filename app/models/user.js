var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  local: {
    email: String,
    name: String,
    permission: String,
    password: String
  }
}, {
  collection: 'user',
  versionKey: false }
);

// methods
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);
