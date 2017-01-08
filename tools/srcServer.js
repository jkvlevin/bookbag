import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';
import async from 'async';
import multer from 'multer';
import fs from 'fs';

/* eslint-disable no-console */

const app = express();
const compiler = webpack(config);

let Database = require('./Database.js');
let bodyParser = require('body-parser');
let Git = require('./Git.js');
var upload = multer({ dest: 'uploads/' });

var expjwt = expressJWT({ secret : "JWT Secret"});

/******************************************************************************
Server Setup and Middleware
*******************************************************************************/

let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log("App now running on port", port);
});

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
// app.use(expressJWT({ secret : "JWT Secret"}).unless({ path : ['/api/login', '/api/createaccount', '/login', '/']}));

 // to support JSON-encoded bodies
app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

// Git.makeBlobForFile('bsOflqi1', 'OC44LjQuNA==', function(e,d) {
// 	if (e) console.log(e);
// 	else {
// 		console.log(d)
// 		var blobs = [];
// 		var blob = {path: 'test.txt', sha: d};
// 		blobs.push(blob);

// 		Git.makeBlobForFile('bsOflqi1', 'OC44LjQuNA==', function(e, d) {
// 			if (e) console.log(e);

// 			else {
// 				blob = {path: 'newtest.txt', sha: d};
// 				blobs.push(blob);

// 				Git.makeCommitWithBlobArray('bsOflqi1', blobs, 'Joe Salter', 'Testing new Git stuff', function(e,d) {
// 					if (e) console.log(e);
// 					else console.log(d);
// 				});
// 			}
// 		});
// 	}
// });

/******************************************************************************
Login/Account APIs
*******************************************************************************/

// Log In User
app.post('/api/login', function(req, res, next) {
	Database.validateUser(req.body.email, req.body.password, function(err, data) {
		if (err) return next(err, null, res, null);
		jwt.sign({username : req.body.email, firstname : data.firstname, lastname: data.lastname, id : data.id}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
				res.status(200).json({token, name: data.firstname + " " + data.lastname, prof : data.prof});
			});
	});
});

// Create Student Account
app.post('/api/student/createaccount', function(req, res, next) {
	let firstname = req.body.firstName;
	let lastname = req.body.lastName;
	let password = req.body.password;
	let email = req.body.email;

	Database.addStudent(email, firstname, lastname, password, function(err, data) {
		if (err) return next(err);
		jwt.sign({username : email, firstname : firstname, lastname: lastname, id : data}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
			res.status(200).json({token, name: firstname + " " + lastname, prof : false});
		});
	});
});

// Create Prof Account
app.post('/api/prof/createaccount', function(req, res, next) {
	let firstname = req.body.firstName;
	let lastname = req.body.lastName;
	let password = req.body.password;
	let email = req.body.email;

	Database.addProf(email, firstname, lastname, password, function(err, data) {
		if (err) return next(err);
		jwt.sign({username : email, firstname : firstname, lastname: lastname, id : data}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
			res.status(200).json({token, name: firstname + " " + lastname, prof : true});
		});
	});
});

/******************************************************************************
Creation APIs
*******************************************************************************/

// Add course to library
app.post('/api/student/addcourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addCourse(decoded.id, req.body.course, function(err, data) {
			if (err) return next(err);
			res.sendStatus(data);
		});
	});
});

// Create new Course
app.post('/api/prof/createcourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.createCourse(req.body.name, decoded.id, req.body.description, req.body.keywords, decoded.firstname + " " + decoded.lastname, function(err, data) {
			if (err) return next(err);

			Database.getWorkingCourses(decoded.id, function(err, data) {
				if (err) return next(err);
		  		var publicCourses = [];
		  		var privateCourses = [];

		  		async.each(data, function(item, callback) {
		  			Database.getCourseData(item.id, function(err, data) {
		  				if (err) callback(err);
		  				Database.getCourseChapters(item.id, function(e, d) {
							if (e) callback(e);
							if (data[0].public == true) {
								publicCourses.push({
									courseInfo: data[0],
									chapters : d
								});
							} else {
								privateCourses.push({
									courseInfo: data[0],
									chapters : d
								});
							}
							callback();
						});
		  			});
		  		}, function(err) {
		  			if (err) return next(err);
		  			res.send([privateCourses, publicCourses]);
		  		});
		  	});
		});
	});
});

//Create new chapter
app.post('/api/prof/createchapter', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.createChapter(decoded.id, req.body.chapterName, req.body.contributors, req.body.checkout_dur, "", decoded.firstname + " " + decoded.lastname, req.body.keywords, req.body.description, function(err, data) {
			if (err) return next(err);
			Git.createNewRepo(data, function(e, d) {
				if (e) return next(err);
				Database.getWorkingChapters(decoded.id, function(err, data) {
					if (err) return next(err);
			  		var publicChapters = [];
			  		var privateChapters = [];

			  		async.each(data, function(item, callback) {
			  			Database.getWorkingChapterData(item.id, function(err, data, name) {
							if (err) callback(err);
							if (data[0].public == true) {
								publicChapters.push(data[0]);
							} else {
								privateChapters.push(data[0]);
							}
							callback();
						});
			  		}, function(err) {
			  			if (err) return next(err);
			  			res.send([privateChapters, publicChapters]);
			  		});
			  	});
			})
		});
	});
});

app.post('/api/prof/addchaptertocourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToCourse(req.body.chapter, req.body.course, function(err, data) {
			if (err) return next(err);
			res.sendStatus(data);
		});
	});
});

app.post('/api/student/addchaptertocoursenotes', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToCourseNotes(decoded.id, req.body.prof, req.body.chaptername, req.body.chapterauthor, req.body.coursename, function(err, data) {
			if (err) return next(err);
			Database.getCourses(decoded.id, function(err, data) {
		  		if (err) return next(err);
		  		var courses = [];

		  		async.each(data, function(item, callback) {
		  			Database.getCourseChapters(item.id, function(err, data) {
						if (err) callback(err);
						else {
							courses.push({
								courseName: item.name,
								chapters : data
							});
						}
						callback();
					});
		  		}, function(err) {
		  			if (err) throw Error(err);
		  			res.send(courses);
		  		});
		  	});
		});
	});
});

app.post('/api/student/addchaptertofolder', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToFolder(decoded.id, req.body.chaptername, req.body.chapterauthor, req.body.foldername, function(err, data) {
			if (err) return next(err);
			Database.getFolders(decoded.id, function(err, data) {
		  		if (err) throw Error(err);
		  		var folders = [];

		  		async.each(data, function(item, callback) {
		  			Database.getFolderChapters(decoded.id, item.foldername, function(err, data) {
						if (err) callback(err);
						else {
							folders.push({
								foldername: item.name,
								chapters : data
							});
						}
						callback();
					});
		  		}, function(err) {
		  			if (err) throw Error(err);
		  			res.send(folders);
		  		});
		  	});
		});
	});
});

// Create new Folder (Both Accounts)
app.post('/api/addfolder', function(req, res, next) {
	// Auth.verify(req.email);
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addFolder(decoded.id, req.body.folderName, function(err, data1) {
			if (err) return next(err);

			Database.getFolders(decoded.id, function(err, data2) {
		  		if (err) throw Error(err);
		  		var folders = [];

		  		async.each(data2, function(item, callback) {
		  			Database.getFolderChapters(decoded.id, item.id, function(err, folderdata) {
						if (err) callback(err);
						else {
							folders.push({
								foldername: item.name,
								chapters : folderdata
							});
						}
						callback();
					});
		  		}, function(err) {
		  			if (err) throw Error(err);
		  			res.send(folders);
		  		});
		  	});
		});
	});
});

app.post('/api/prof/upload', expjwt, upload.array('files'), function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		async.each(req.files, function(item, callback) {
			var pdfData = fs.readFile(item.path, 'base64', function(err, data) {
				Git.uploadFileToRepo(req.body.chapter, data, item.originalname, req.body.commitMessage, decoded.firstname + " " + decoded.lastname, function(e, d) {
					if (e) return next(e);
					fs.unlink(item.path);
					res.sendStatus(200);
				});
			})
		}, function(err) {
  			if (err) return next(err);
  			res.send();
  		});
	});
});

app.post('/api/prof/checkoutchapter', expjwt, function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.attemptCheckout(decoded.id, req.body.chapter, function(err, data) {
			if (err) return next(err);
			if (data != 200) {
				res.send({message : "Someone has already checked out this chapter"});
			} else {
				res.sendStatus(200);
			}
		});
	});
});

app.post('/api/prof/revertchaptertopreviousversion', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.revertRepoToOldCommit(sanitizeRepoName(req.body.chapterName), req.body.sha, req.body.commitMessage, decoded.firstname + " " + decoded.lastname, function(e, d) {
  		if (e) return next(e);
  		res.send(d);
  	});
  });
});

/******************************************************************************
Student Retreival APIs
*******************************************************************************/

app.post('/api/student/getcourses', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getCourses(decoded.id, function(err, data) {
  		if (err) return next(err);
  		var courses = [];

  		async.each(data, function(item, callback) {
  			Database.getCourseChapters(item.id, function(err, data, name) {
				if (err) callback(err);
				else {
					courses.push({
						courseName: name,
						chapters : data
					});
				}
				callback();
			});
  		}, function(err) {
  			if (err) return next(err);
  			res.send(courses);
  		});
  	});
  });
});

// Get all folder names
app.post('/api/getfolders', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getFolders(decoded.id, function(err, data) {
  		if (err) next(err);
  		var folders = [];

  		async.each(data, function(item, callback) {
  			Database.getFolderChapters(decoded.id, item.id, function(err, data) {
				if (err) callback(err);
				else {
					folders.push({
						foldername: item.name,
						chapters : data
					});
				}
				callback();
			});
  		}, function(err) {
  			if (err) throw Error(err);
  			res.send(folders);
  		});
  	});
  });
});

app.post('/api/getcoursenotes', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getCourseNotes(decoded.id, req.prof, req.courseName, function(err, data) {
  		if (err) throw Error(err);
  		res.send(data);
  	});
  });
});

/******************************************************************************
Prof Retrieval APIs
*******************************************************************************/

app.post('/api/prof/getchapterhistory', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.listCommitsForRepo(req.body.chapterId, function(e, d) {
  		if (e) return next(e);
  		res.send(d);
  	});
  });
});

app.post('/api/prof/getchaptercontents', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.getLatestContentsOfRepo(req.body.chapterId, function(e, d) {
  		if (e) return next(e);
  		res.send(d);
  	});
  });
});

app.post('/api/prof/getchaptercontentsprevious', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.getContentsOfRepoForCommit(req.body.chapterId, req.body.sha, function(e, d) {
  		if (e) return next(e);
  		res.send(d);
  	});
  });
});

app.post('/api/prof/getchapters', expjwt, function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.getWorkingChapters(decoded.id, function(err, data) {
			if (err) return next(err);
	  		var publicChapters = [];
	  		var privateChapters = [];

	  		async.each(data, function(item, callback) {
	  			Database.getWorkingChapterData(item.id, function(err, data, name) {
					if (err) callback(err);
					if (data[0].public == true) {
						publicChapters.push(data[0]);
					} else {
						privateChapters.push(data[0]);
					}
					callback();
				});
	  		}, function(err) {
	  			if (err) return next(err);
	  			res.send([privateChapters, publicChapters]);
	  		});
	  	});
	});
});

app.post('/api/prof/getcourses', expjwt, function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.getWorkingCourses(decoded.id, function(err, data) {
			if (err) return next(err);

			let privateCourses = [];
			let publicCourses = [];
			async.each(data, function(item, callback) {
				Database.getCourseData(item.id, function(err, data) {
				if (err) callback(err);
				Database.getCourseChapterCount(item.id, function(e, d) {
					if (e) callback(e);
					data[0]["count"] = d[0]["count"];
					if (data[0].public == true) {
						publicCourses.push(data[0]);
					} else {
						privateCourses.push(data[0]);
					}
					callback();
				});
				});
			}, function(err) {
	  			if (err) return next(err);
	  			res.send([privateCourses, publicCourses]);
	  		});
	  	});
	});
});

app.post('/api/prof/getcoursebyid', expjwt, function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.getCourseData(req.body.course, function(err, data) {
			if (err) callback(err);
			Database.getCourseChapters(req.body.course, function(e, d) {
				if (e) callback(e);
				res.send({
					courseInfo: data[0],
					chapters : d
				})
			});
		});
	});
});

/******************************************************************************
Search APIs
*******************************************************************************/

// Search the Database for Chapters
app.post('/api/searchchapters', function(req, res, next) {
	// Auth.verify(req.email);
	Database.searchChapters(req.body.searchQuery, function(err, data) {
		if (err) return next(err);
		res.end(data);
	});
});

// Search the Database for Chapters
app.post('/api/searchcourses', function(req, res, next) {
	// Auth.verify(req.email);
	Database.searchCourses(req.body.searchQuery, function(err, data) {
		if (err) return next(err);
		res.end(data);
	});
});

/******************************************************************************
Deletion APIs
*******************************************************************************/

// Delete a Student's Account
app.post('/api/student/delete', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.deleteStudent(decoded.id, function(err, data) {
			if (err) return next(err);
			res.sendStatus(data);
		});
	});
});

// Remove Course from a Student's Library
app.post('/api/student/removecourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.removeCourse(decoded.id, req.body.course, function(err, data) {
			if (err) return next(err);
			res.sendStatus(data);
		});
	});
});

// Delete a Chapter from Bookbag
app.post('/api/prof/deletechapter', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.deleteChapter(req.body.owner, req.body.chapterName, function(err, data) {
  		if (err) return next(err);
  		Git.deleteRepo(sanitizeRepoName(req.body.chapterName), function(e, d) {
  			if (e) return next(err);
  			res.sendStatus(200);
  		})
  	});
  });
});

// Remove Course from a Student's Library
app.post('/api/prof/removechapterfromcourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.removeChapterFromCourse(req.body.chapter, req.body.course, function(err, data) {
			if (err) return next(err);
			res.sendStatus(data);
		});
	});
});

function sanitizeRepoName(repoName) {
	return repoName.replace(' ', '-');
}

// Error Middleware
app.use(function(err, req, res, next) {
    res.status(202).json({
        error: err
    });
});
