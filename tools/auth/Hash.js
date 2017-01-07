/******************************************************************************
Module to manage password hashing
*******************************************************************************/

var Hash = [];

var bcrypt  = require('bcrypt-nodejs');

// Create a hash for a password
Hash.hashPassword = function(password, callback) {

	bcrypt.hash(password, null, null, function(err, hash) {
		if (err)
			callback(err);

		else
			callback(null, hash);
	});
}

// Validate password given attempted unhashed password from request and correct hashed password
Hash.validatePassword = function(attemptedPassword, hashedPassword, callback) {

	bcrypt.compare(attemptedPassword, hashedPassword, function (err, res) {
		if (err)
			callback(err);

		else if (res)
			callback(null, true);

		else if (!res)
			callback(null, false);
	});
}

module.exports = Hash;