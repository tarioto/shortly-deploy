var mongoose = require('mongoose');  
var bcrypt = require('bcrypt-nodejs'); 
var Promise = require('bluebird');

var userSchema = mongoose.Schema ({
  username: { type: String, index: {unique: true} },
  password: String
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;
