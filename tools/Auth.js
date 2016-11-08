/******************************************************************************
Module to manage Auth
*******************************************************************************/

var bcrypt  = require('bcrypt-nodejs');
var jwt     = require('jsonwebtoken')
var config  = require('./config')

// Return a hashed password
exports.hashPassword = function(password) {
	return bcrypt.hashSync(password);
}

// Validate password given attempted unhashed password from request and correct hashed password
exports.validatePassword = function(attemptedPassword, hashedPassword) {
	return bcrypt.compareSync(attemptedPassword, hashedPassword);
}

exports.generateToken = function(user) {
	return jwt.sign(user, config.secret);
}
