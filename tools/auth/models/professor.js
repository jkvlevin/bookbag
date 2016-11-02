// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var professorSchema = mongoose.Schema({

	firstName	 : String,
	lastName	 : String,
	institution  : String,
    email        : String,
    password     : String,

});

// methods ======================
// generating a hash
professorSchema.methods.generateHash = function(password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(8), null, next);
};

// checking if password is valid
professorSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password, next);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Professor', professorSchema);