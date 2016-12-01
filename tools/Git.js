/******************************************************************************
Module to manage Github abstraction
*******************************************************************************/

var Git = require("nodegit");
var GitHubApi = require("github");

var github = new GitHubApi();

var ACCOUNT_NAME = 'bookbagInc' 
var AUTH_TOKEN = '87034183fdfcc315affd96f3f102bff4a264c877';

var authenticate = function() {
	github.authenticate({
	    type: "oauth",
	    token: AUTH_TOKEN
	});
}

/******************************************************************************
Repo creation and contributor management
*******************************************************************************/

// Create a repo with an owner and users, return the repo object
exports.createNewRepoWithUsers = function(repoName, users) {

	authenticate();

	// If not, create the repo
	github.repos.create({
		name: repoName
	}, function(err, res) {
		

	});

}

// Delete a repo and all user links associated with it
exports.deleteRepo = function(repoName) {

	authenticate();

	github.repos.delete({
		owner: 'bookbagInc',
		repo: repoName
	}, function(err, res) {
		

	});
}

// Add a user to an existing repo
exports.addUserToRepo = function(user, repoName) {

}

// Remove a user from an existing repo
exports.removeUserFromRepo = function(user, repoName) {

}

// Return all of a user’s repos
exports.getAllReposForUser = function(user) {

}




/******************************************************************************
Repo data management
*******************************************************************************/

// Return all the commits for a given repo
exports.listCommitsForRepo = function(repoName) {

	authenticate();

	github.repos.getCommits({
		owner: ACCOUNT_NAME,
    	repo: repoName,
	}, function(err, res) {


	});
}

// Return the contents of a repo
exports.getContentsOfRepo = function(repoName) {

	authenticate();

	github.repos.get({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
	}, function(err, res) {
    	

	});
}

// Commit to repo
exports.commitToRepo = function(repoName, contents, commitMessage) {

	authenticate();
	
	github.gitdata.createCommit({
		owner: ACCOUNT_NAME,
		repo: repoName,
		message: commitMessage,
		tree: "",
		parents: [],
	}, function(err. res) {


	});
}

// Checkout management

exports.checkoutRepoByUser = function(user, repoName) {

}

exports.checkinRepoByUser = function(user, repoName) {

}

exports.isCheckedOut = function(repoName) {

}


