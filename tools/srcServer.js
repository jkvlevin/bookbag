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

// Error Middleware
app.use(function(err, req, res, next) {
    res.status(202).send({
        error: err
    });
});

var ptonVerify = require('./auth/ptonVerify.js');

ptonVerify.verifyProf('Yuan', 'K', function(err, res) {

	if (err)
		console.log(err);
	else 
		console.log(res);

});


/******************************************************************************
Login/Account APIs
*******************************************************************************/

//login code
app.post('/api/login', function(req, res, next) {
	Database.validateUser(req.body.email, req.body.password, function(err, data) {
		if (err) return next(err);
		jwt.sign({username : req.body.email, name : data.name, id : data.id}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
				res.status(200).json({token});
			});
	});
});

// Create Student Account
app.post('/api/student/createaccount', function(req, res, next) {
	let name = req.body.name;
	let password = req.body.password;
	let email = req.body.email;

	Database.addStudent(email, name, password, function(err, data) {
		if (err) return next(err);
		jwt.sign({username : email, name : name, id : data}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
			res.status(200).json({token});
		});
	});
});

// Create Prof Account
app.post('/api/prof/createaccount', function(req, res, next) {
	let name = req.body.name;
	let password = req.body.password;
	let email = req.body.email;

	Database.addProf(email, name, password, function(err, data) {
		if (err) return next(err);
		jwt.sign({username : email, name : name, id : data}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
			res.status(200).json({token});
		});
	});
});

/******************************************************************************
Creation APIs
*******************************************************************************/

// Add course to library
app.post('/api/student/addcourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addCourse(decoded.id, req.body.courseName, req.body.prof, req.body.profname, function(err, data) {
			if (err) return next(err);
			res.end(data);
		});
	});
});

// Create new Course (Prof-only)
app.post('/api/prof/createcourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.createCourse(req.body.name, decoded.id, req.body.description, req.body.keywords, decoded.name, function(err, data) {
			if (err) return next(err);
			res.end(data);
		});
	});
});

//Create new chapter
app.post('/api/prof/createchapter', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.createChapter(decoded.id, req.body.chapterName, req.body.contributors, req.body.checkout_dur, req.body.pdf_url, req.body.profname, function(err, data) {
			if (err) return next(err);
			Git.createNewRepo(decoded.id, function(e, d) {
				if (e) return next(err);
				res.sendStatus(d);
			})
		});
	});
});

app.post('/api/prof/addchaptertocourse', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToCourse(decoded.id, req.body.chapter, req.body.course, function(err, data) {
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
		  			Database.getCourseChapters(item.prof, item.coursename, function(err, data) {
						if (err) callback(err);
						else {
							courses.push({
								courseName: item.coursename,
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
								foldername: item.foldername,
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
		  			Database.getFolderChapters(decoded.id, item.foldername, function(err, folderdata) {
						if (err) callback(err);
						else {
							folders.push({
								foldername: item.foldername,
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

app.post('/api/prof/upload', expjwt, upload.single('pdf'), function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		var pdfData = fs.readFile(req.file.path, 'base64', function(err, data){
			Git.uploadFileToRepo(sanitizeRepoName(req.body.chapterName), data, req.file.originalname, req.body.commitMessage, function(e, d) {
				if (e) console.log(e);
				fs.unlink(req.file.path);
				res.sendStatus(200);
		});
		})
	});
});

app.post('/api/prof/revertchaptertopreviousversion', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.revertRepoToOldCommit(sanitizeRepoName(req.body.chapterName), req.body.sha, req.body.commitMessage, function(e, d) {
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
  		if (err) throw Error(err);
  		var courses = [];

  		async.each(data, function(item, callback) {
  			Database.getCourseChapters(item.prof, item.coursename, function(err, data) {
				if (err) callback(err);
				else {
					courses.push({
						courseName: item.coursename,
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

// Get all folder names
app.post('/api/getfolders', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getFolders(decoded.id, function(err, data) {
  		if (err) throw Error(err);
  		var folders = [];

  		async.each(data, function(item, callback) {
  			Database.getFolderChapters(decoded.id, item.foldername, function(err, data) {
				if (err) callback(err);
				else {
					folders.push({
						foldername: item.foldername,
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
  	Git.listCommitsForRepo(sanitizeRepoName(req.body.chapterName), function(e, d) {
  		res.send(d);
  	});
  });
});

app.post('/api/prof/getchaptercontents', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.getLatestContentsOfRepo(sanitizeRepoName(req.body.chapterName), function(e, d) {
  		res.send(d);
  	});
  });
});

app.post('/api/prof/getchaptercontentsprevious', expjwt, function(req, res, next) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Git.getContentsOfRepoForCommit(sanitizeRepoName(req.body.chapterName), req.body.sha, function(e, d) {
  		res.send(d);
  	});
  });
});

/******************************************************************************
Search APIs
*******************************************************************************/

app.post('/api/search', function(req, res, next) {
	// Auth.verify(req.email);
	Database.searchChapters(req.body.searchQuery, function(err, data) {
		if (err) return next(err);
		res.end(data);
	});
});

/******************************************************************************
Deletion APIs
*******************************************************************************/

app.post('/api/deletestudentaccount', function(req, res, next) {
	let email = req.body.email;

	Database.deleteStudent(email, function(err, data) {
		if (err) console.log(err);
		res.send(data);
	});
});

app.post('/api/student/removecourse', function(req, res, next) {
	Database.removeCourse(req.body.email, req.body.prof, req.body.courseName, function(err, data) {
		if (err) console.log(err);
		res.sendStatus(data);
	});
});

app.post('/api/prof/deletechapter', function(req, res, next) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.deleteChapter(req.body.owner, req.body.chapterName, function(err, data) {
  		if (err) return next(err);
  		Git.deleteRepo(sanitizeRepoName(req.body.chapterName), function(e, d) {
  			if (e) throw(e);
  			res.sendStatus(200);
  		})
  	});
  });
});

function sanitizeRepoName(repoName) {
	return repoName.replace(' ', '-');
}
