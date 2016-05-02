var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  name: String,
  permission: String
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);
