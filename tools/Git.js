/******************************************************************************
Module to manage Github abstraction
*******************************************************************************/

var GitHubApi = require("github");

var github = new GitHubApi();

var ACCOUNT_NAME = 'bookbagInc' 
var AUTH_TOKEN = '87034183fdfcc315affd96f3f102bff4a264c877';

var open = require('open');

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
		if (err) {
			if (JSON.parse(err)["message"] === "Validation Failed") {
				console.log(JSON.parse(err)["errors"][0].message);
			}

		}

		else {
			console.log(res);
		}
	});

}

// Delete a repo and all user links associated with it
exports.deleteRepo = function(repoName) {

	authenticate();

	github.repos.delete({
		owner: 'bookbagInc',
		repo: repoName
	}, function(err, res) {
		if (err)
			console.log(JSON.parse(err)["message"]);
		else
			console.log(res);

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

		var commits = [];
		if (err)
    		console.log(err);
		else {
			for (var i = 0; i < res.length; i++) {
				commits.push(res[i].commit.message)
				console.log(commits[i]);
			}
		}

	});
}

// Return the contents of a repo
exports.getCurrentContentsOfRepo = function(repoName) {

	authenticate();

	github.repos.getContent({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
    	path: "",
	}, function(err, res) {
		if (err)
    		console.log(JSON.stringify(err));
		else {
			var downloadURLs = []

			for (var i = 0; i < res.length; i++) {
				downloadURLs.push(res[i].download_url);
				open(downloadURLs[i]);
			}
		}
	});
}

// Return the contents of a repo for a specific commit
exports.getContentsOfRepoForCommit = function(repoName, sha) {

	authenticate();

	github.repos.getContent({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
    	path: "",
    	ref: sha,
	}, function(err, res) {
		if (err)
    		console.log(JSON.stringify(err));
		else {
			var downloadURLs = []

			for (var i = 0; i < res.length; i++) {
				downloadURLs.push(res[i].download_url);
				open(downloadURLs[i]);

			}
		}
	});
}

// Commit to repo
exports.uploadFilesToRepo = function(repoName, contents, commitMessage) {

	authenticate();

	github.repos.createFile({
		owner: ACCOUNT_NAME,
		repo: repoName,
		path: "test2.pdf",
		message: commitMessage,
		content: contents,
	}, function(err, res) {
		console.log(err);
		console.log(res);

	});
}

// Checkout management

exports.checkoutRepoByUser = function(user, repoName) {

}

exports.checkinRepoByUser = function(user, repoName) {

}

exports.isCheckedOut = function(repoName) {

}


