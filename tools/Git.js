/******************************************************************************
Module to manage Github abstraction
*******************************************************************************/

var Git = [];

var GitHubApi = require("github");

var github = new GitHubApi();

var ACCOUNT_NAME = 'bookbagInc' 
var ACCOUNT_PASS = 'textFUTUREbook1'

var authenticate = function() {
	github.authenticate({
	    type: "basic",
	    username: ACCOUNT_NAME,
	    password: ACCOUNT_PASS
	});
}

/******************************************************************************
Repo creation and contributor management
*******************************************************************************/

// Create a repo with the desired repo name
Git.createNewRepoWithUsers = function(repoName, callback) {

	authenticate();

	github.repos.create({
		name: repoName
	}, function(err, res) {
		if (err) {
			if (JSON.parse(err)["message"] === "Validation Failed") {
				callback(JSON.parse(err)["errors"][0].message);
			}
			else {
				callback(JSON.parse(err)["message"]);
			}
		}

		else {
			callback(null, 200);
		}
	});

}

// Delete a repo
Git.deleteRepo = function(repoName, callback) {

	authenticate();

	github.repos.delete({
		owner: 'bookbagInc',
		repo: repoName
	}, function(err, res) {
		if (err) {
			callback(JSON.parse(err)["message"]);
		}
		else
			callback(null, 200);

	});
}

/******************************************************************************
Repo data management
*******************************************************************************/

// Return all the commits for a given repo
Git.listCommitsForRepo = function(repoName, callback) {

	authenticate();

	github.repos.getCommits({
		owner: ACCOUNT_NAME,
    	repo: repoName,
	}, function(err, res) {

		var commits = [];
		if (err)
    		callback(JSON.parse(err)["message"]);
		else {
			for (var i = 0; i < res.length; i++) {
				var commit = {versionID: res.length - i, message: res[i].commit.message, date: res[i].commit.author.date, sha: res[i].sha};
				commits.push(commit);
			}

			callback(null, commits);
		}

	});
}

// Return the contents of a repo
Git.getLatestContentsOfRepo = function(repoName, callback) {

	authenticate();

	github.repos.getContent({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
    	path: "",
	}, function(err, res) {
		if (err) {
    		callback(JSON.parse(err)["message"]);
		}
		else {
			var contents = [];

			for (var i = 0; i < res.length; i++) {
				var content = {filename: res[i].name, downloadURL: res[i].download_url};
				contents.push(content);
			}

			callback(null, contents);
		}
	});
}

// Return the contents of a repo for a specific commit
Git.getContentsOfRepoForCommit = function(repoName, sha, callback) {

	authenticate();

	github.repos.getContent({
    	owner: ACCOUNT_NAME,
    	repo: repoName,
    	path: "",
    	ref: sha,
	}, function(err, res) {
		if (err)
    		callback(JSON.parse(err)["message"]);
		else {
			var contents = [];

			for (var i = 0; i < res.length; i++) {
				var content = {filename: res[i].name, downloadURL: res[i].download_url};
				contents.push(content);
			}

			callback(null, contents);
		}
	});
}

// Revert the repo to an older commit, specified by 'sha'
Git.revertRepoToOldCommit = function(repoName, sha, message, callback) {

	authenticate();

	github.repos.getCommits({
		owner: ACCOUNT_NAME,
    	repo: repoName,
	}, function(err, res) {

		if (err)
    		callback(JSON.parse(err)["message"]);
		else {
			var parent = res[0].sha;

			github.gitdata.getCommit({
				owner: ACCOUNT_NAME,
				repo: repoName,
				sha: sha
			}, function(err, res) {
				if (err)
					callback(JSON.parse(err)["message"]);

				else {
					var tree = res.tree.sha;

					github.gitdata.createCommit({
						owner: ACCOUNT_NAME,
						repo: repoName,
						message: message,
						tree: tree,
						parents: [parent]
					}, function(err, res) {
						if (err)
							callback(JSON.parse(err)["message"]);
						else {

							github.gitdata.updateReference({
								owner: ACCOUNT_NAME,
								repo: repoName,
								ref: 'heads/master',
								sha: res.sha,
								force: true
							}, function(err, res) {
								if (err) {
									callback(JSON.parse(err)["message"]);
								}
								else {
									callback(null, 200);
								}
							});
						}
					});
				}
			});
		}
	});
}


// Upload file to repo
Git.uploadFileToRepo = function(repoName, contents, fileName, commitMessage, callback) {

	authenticate();

	github.repos.createFile({
		owner: ACCOUNT_NAME,
		repo: repoName,
		path: fileName,
		message: commitMessage,
		content: contents,
	}, function(err, res) {
		

		if (err) {

			github.repos.getContent({
				owner: ACCOUNT_NAME,
		    	repo: repoName,
		    	path: fileName
			}, function(err, res) {

				var sha;
				if (err)
		    		callback(JSON.parse(err)["message"]);
				else {
					sha = res.sha;

					github.repos.updateFile({
						owner: ACCOUNT_NAME,
						repo: repoName,
						path: fileName,
						message: commitMessage,
						content: contents,
						sha: sha
					}, function(err, res) {
						console.log(res);
						if (err) 
							callback(JSON.parse(err)["message"]);

						else
							callback(null, 200);
					});
				}

			});
		}

		else
			callback(null, 200);

	});
}

// Checkout management

Git.checkoutRepoByUser = function(email, repoName, callback) {

}

Git.checkinRepoByUser = function(email, repoName, callback) {

}

Git.isCheckedOut = function(repoName, callback) {

}

module.exports = Git;