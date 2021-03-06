/******************************************************************************
Module to manage Github abstraction
*******************************************************************************/

var Git = [];

const separator = '****';

var GitHubApi = require("github");
var github = new GitHubApi();

let fs = require('fs');

const ACCOUNT_NAME = 'bookbagInc' 
const ACCOUNT_PASS = 'textFUTUREbook1'

const PUBLIC_PDF_NAME_CONVENTION = 'public.pdf';

var authenticate = function() {
	github.authenticate({
		type: "basic",
		username: ACCOUNT_NAME,
		password: ACCOUNT_PASS
	});
}

/******************************************************************************
Repo creation / deletion management
*******************************************************************************/

// Create a repo with the desired repo name, commit intial file with help
Git.createNewRepo = function(repoName, callback) {

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
			fs.readFile(__dirname + '/chapter_help.md', 'base64', function(err, contents) {
				if (err) {
					callback("Unable to create initial help file! Try again.");
				}

				else {
					github.repos.createFile({
						owner: ACCOUNT_NAME,
						repo: repoName,
						path: 'clickMeForHelp!.md',
						message: 'Bookbag'+separator+'Your chapter is empty. Add collaborators, checkout and upload files to get started!',
						content: contents,
					}, function(err, res) {
						if (err)
							callback(JSON.parse(err)["message"]);
						else
							callback(null, 200);
					});
				}
			});
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

// Return array of commits objects for a given repo. Commit object contains {author, version #, message, date, sha}
Git.listCommitsForRepo = function(repoName, callback) {

	authenticate();

	github.repos.getCommits({
		owner: ACCOUNT_NAME,
		repo: repoName,
	}, function(err, res) {

		if (err) {
			if (JSON.parse(err)["message"] === "Git Repository is empty.")
				callback(null, []);
			else
				callback(JSON.parse(err)["message"]);
		}
		else {
			var commits = [];

			for (var i = 0; i < res.length; i++) {
				var date = new Date(res[i].commit.author.date);
				var options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
				var messageWithUser = res[i].commit.message.split(separator);
				var commit = {author: messageWithUser[0], version: res.length - i, message: messageWithUser[1], date: date.toLocaleString('en-US', options), sha: res[i].sha};
				commits.push(commit);
			}

			callback(null, commits);
		}

	});
}

// Return array of content objects of a repo. Content object contains {filename, downloadURl, isPDF}
Git.getLatestContentsOfRepo = function(repoName, callback) {

	authenticate();

	github.gitdata.getReference({
		owner: ACCOUNT_NAME,
		repo: repoName,
		ref: 'heads/master'
	}, function(err, res) {
		if (err)
			callback(JSON.parse(err)["message"]);

		else {
			var sha = res.object.sha;

			github.repos.getContent({
				owner: ACCOUNT_NAME,
				repo: repoName,
				path: "",
			}, function(err, res) {
				if (err) {
					if (JSON.parse(err)["message"] === "This repository is empty.")
						callback(null, []);
					else
						callback(JSON.parse(err)["message"]);
				}
				else {
					var contents = [];

					for (var i = 0; i < res.length; i++) {
						var ext = res[i].name.split('.');
						var isPDF;
						if   (ext.length == 1) isPDF = false;
						else isPDF = ext[ext.length - 1] === 'pdf';
						let url = res[i].download_url.replace('master', sha);
						var content = {filename: res[i].name, downloadURL: url, isPDF: isPDF};
						contents.push(content);
					}

					callback(null, contents);
				}
			});
		}
	});
}

// Return the contents of a repo for a specific commit. Same format as above
Git.getContentsOfRepoForCommit = function(repoName, sha, callback) {

	authenticate();

	github.repos.getContent({
		owner: ACCOUNT_NAME,
		repo: repoName,
		path: "",
		ref: sha,
	}, function(err, res) {
		if (err) {
			if (JSON.parse(err)["message"] === "This repository is empty.")
				callback(null, []);
			else
				callback(JSON.parse(err)["message"]);
		}
		else {
			var contents = [];

			for (var i = 0; i < res.length; i++) {
				var ext = res[i].name.split('.');
				var isPDF;
				if   (ext.length == 1) isPDF = false;
				else isPDF = ext[ext.length - 1] === 'pdf';
				var content = {filename: res[i].name, downloadURL: res[i].download_url, isPDF: isPDF};
				contents.push(content);
			}

			callback(null, contents);
		}
	});
}

// Revert the repo to an older commit, specified by 'sha'
Git.revertRepoToOldCommit = function(repoName, sha, commitMessage, author, callback) {

	authenticate();

	github.gitdata.getReference({
		owner: ACCOUNT_NAME,
		repo: repoName,
		ref: 'heads/master'
	}, function(err, res) {

		if (err)
			callback(JSON.parse(err)["message"]);
		else {
			var parent = res.object.sha;

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
						message: author + separator + commitMessage,
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


// Upload file to repo. First try creating the file, then just update the file if it already exists
Git.uploadFileToRepo = function(repoName, contents, fileName, commitMessage, author, callback) {

	authenticate();

	github.repos.createFile({
		owner: ACCOUNT_NAME,
		repo: repoName,
		path: fileName,
		message: author + separator + commitMessage,
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
						message: author + separator + commitMessage,
						content: contents,
						sha: sha
					}, function(err, res) {
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

// Make a blob for a file contents, return the blob sha
Git.makeBlobForFile = function(repoName, contents, callback) {

	authenticate();

	github.gitdata.createBlob({
		owner: ACCOUNT_NAME,
		repo: repoName,
		content: contents,
		encoding: 'base64'
	}, function(err, res) {
		if (err)
			callback(JSON.parse(err)["message"]);
		else
			callback(null, res.sha);

	});
}

// Given array of blob objects {path, sha}, make a commit to Repo
Git.makeCommitWithBlobArray = function (repoName, blobs, author, commitMessage, callback) {

	authenticate();
	var tree = [];
	for (var i = 0; i < blobs.length; i++) {
		var blob = {path: blobs[i].path, mode: '100644', type: 'blob', sha: blobs[i].sha};
		tree.push(blob);
	}

	github.gitdata.getReference({
		owner: ACCOUNT_NAME,
		repo: repoName,
		ref: 'heads/master'
	}, function(err, res) {
		if (err)
			callback(JSON.parse(err)["message"]);
		else {
			var firstsha = res.object.sha;

			github.gitdata.getCommit({
				owner: ACCOUNT_NAME,
				repo: repoName,
				sha: firstsha
			}, function (err, res) {
				if (err)
					callback(JSON.parse(err)["message"]);

				else {
					var base_tree = res.tree.sha;

					github.gitdata.createTree({
						owner: ACCOUNT_NAME,
						repo: repoName,
						tree: tree,
						base_tree: base_tree
					}, function(err, res) {

						if (err) {
							callback(JSON.parse(err)["message"]);
						}

						else {
							var treeSha = res.sha;


							github.gitdata.createCommit({
								owner: ACCOUNT_NAME,
								repo: repoName,
								message: author + separator + commitMessage,
								tree: treeSha,
								parents: [firstsha]
							}, function(err, res) {
								if (err){
									callback(JSON.parse(err)["message"]);
								}
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
	});
}

Git.getPublicPdfForRepo = function() {

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

			var pdfURL = '';
			for (var i = 0; i < res.length; i++) {

				if (res[i].name === PUBLIC_PDF_NAME_CONVENTION) {
					pdfURL = res[i].download_url;
					break;
				}
				// var ext = res[i].name.split('.');
				// if (ext.length > 1) {
				// 	if (ext[ext.length - 1] === 'pdf') {
				// 		pdfURL = res[i].download_url;
				// 		break;
				// 	}

				// }
			}

			callback(null, pdfURL);
		}
	});
}

module.exports = Git;