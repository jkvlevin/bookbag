/******************************************************************************
Module to manage Github abstraction
*******************************************************************************/

var Git = [];

var GitHubApi = require("github");

var github = new GitHubApi();

var ACCOUNT_NAME = 'bookbagInc' 
var AUTH_TOKEN = '38ea0b3940b4084df03a467c96871002e12052fa';

var open = require('open');
var fs   = require('fs');
var request = require('request').defaults({ encoding: null });

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
Git.createNewRepoWithUsers = function(repoName, users, callback) {

	authenticate();

	// If not, create the repo
	github.repos.create({
		name: repoName
	}, function(err, res) {
		if (err) {
			if (JSON.parse(err)["message"] === "Validation Failed") {
				console.log(JSON.parse(err)["errors"][0].message);
				callback(JSON.parse(err)["errors"][0].message);
			}

		}

		else {
			
		}
	});

}

// Delete a repo and all user links associated with it
Git.deleteRepo = function(repoName) {

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
Git.addUserToRepo = function(user, repoName) {

}

// Remove a user from an existing repo
Git.removeUserFromRepo = function(user, repoName) {

}

// Return all of a user’s repos
Git.getAllReposForUser = function(user) {

}




/******************************************************************************
Repo data management
*******************************************************************************/

// Return all the commits for a given repo
Git.listCommitsForRepo = function(repoName) {

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
				//console.log(commits[i]);
			}
		}

	});
}

// Return the contents of a repo
Git.getLatestContentsOfRepo = function(repoName) {

	authenticate();

	github.repos.getContent({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
    	path: "",
	}, function(err, res) {
		if (err)
    		console.log(JSON.stringify(err));
		else {
			var downloadURLs = [];

			for (var i = 0; i < res.length; i++) {
				downloadURLs.push(res[i].download_url);
				//open(downloadURLs[i]);
			}
		}
	});
}

// Return the contents of a repo for a specific commit
Git.getContentsOfRepoForCommit = function(repoName, sha) {

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
				//open(downloadURLs[i]);
			}
		}
	});
}

Git.revertRepoToOldCommit = function(repoName, sha) {

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
				var downloadURL = res[i].download_url;
				var urlSplit = downloadURL.split("/");
				var fileName = urlSplit[urlSplit.length - 1];
				console.log("filename: " + fileName);

				request.get(downloadURL, function (error, response, body) {
				    if (!error && response.statusCode == 200) {
				        var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
				        console.log(data + "\n\n\n\n");
				        github.repos.createFile({
							owner: ACCOUNT_NAME,
							repo: repoName,
							path: fileName,
							message: "Reverting file: " + fileName + " to prior commit!",
							content: data,
						}, function(err, res) {
								console.log(err);
								console.log(res);

						});
				    }
				});
			}
		}
	});
}


// Commit to repo
Git.uploadFilesToRepo = function(repoName, contents, commitMessage) {

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

Git.checkoutRepoByUser = function(user, repoName) {

}

Git.checkinRepoByUser = function(user, repoName) {

}

Git.isCheckedOut = function(repoName) {

}


module.exports = Git;