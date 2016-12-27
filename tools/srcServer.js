import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';
import async from 'async';

/* eslint-disable no-console */

const app = express();
const compiler = webpack(config);

let Database = require('./Database.js');
let bodyParser = require('body-parser');
let Git = require('./Git.js');
// var Auth = require('Auth')

var expjwt = expressJWT({ secret : "JWT Secret"});

/******************************************************************************
Server Setup
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

var git = require('./Git.js')

git.createNewRepoWithUsers('Test3', function(e,d) { 
	if (e) 
		console.log(e);
	else 
		console.log(d);
});
//git.deleteRepo('Test');
//var contents = git.getLatestContentsOfRepo('Test2');
//git.listCommitsForRepo('Test2');
//git.getLatestContentsOfRepo('Test2');
//git.revertRepoToOldCommit('Test2', "bf5198b4d1bc3b60dcd8067c93abf157ca7b5916");

/******************************************************************************
Login/Account APIs
*******************************************************************************/

//login code
app.post('/api/login', function(req, res) {
  Database.validateUser(req.body.email, req.body.password, function(err, data) {
  	if (err) console.log(err);
  	jwt.sign({username : req.body.email}, 'JWT Secret', {expiresIn : "12h"}, function(err, token) {
  		res.status(data).json({token});
  	});
  });
});

// Create Student Account
app.post('/api/student/createaccount', function(req, res) {
	let name = req.body.name;
	let password = req.body.password;
	let email = req.body.email;

	Database.addStudent(email, name, password, function(err, data) {
		if (err) console.log(err);
		res.end(data);
	});
});

/******************************************************************************
Creation APIs
*******************************************************************************/

// Add course to library
app.post('/api/student/addcourse', function(req, res) {
	Database.addCourse(req.body.email, req.body.courseName, req.body.prof, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

// Create new Course (Prof-only)
app.post('/api/prof/createcourse', function(req, res) {
	Database.createCourse(req.body.name, req.body.prof, req.body.description, req.body.keywords, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

//Create new chapter
app.post('/api/prof/createchapter', function(req, res) {
	Database.createChapter(req.body.prof, req.body.chapterName, req.body.contributors, req.body.checkout_dur, req.body.pdf_url, function(err, data) {
		if (err) throw(err);
		Git.createNewRepoWithUsers(req.body.chapterName, function(e, d) {
			res.sendStatus(200);
		})
	});
});

app.post('/api/prof/addchaptertocourse', function(req, res) {
	Database.addChapterToCourse(req.body.prof, req.body.chaptername, req.body.chapterauthor, req.body.coursename, function(err, data) {
		if (err) throw(err);
		res.sendStatus(data);
	});
});

app.post('/api/student/addchaptertocoursenotes', function(req, res) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToCourseNotes(decoded.username, req.body.prof, req.body.chaptername, req.body.chapterauthor, req.body.coursename, function(err, data) {
			if (err) throw(err);
			Database.getCourses(decoded.username, function(err, data) {
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
});

app.post('/api/student/addchaptertofolder', function(req, res) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addChapterToFolder(decoded.username, req.body.chaptername, req.body.chapterauthor, req.body.foldername, function(err, data) {
			if (err) throw(err);
			Database.getFolders(decoded.username, function(err, data) {
		  		if (err) throw Error(err);
		  		var folders = [];

		  		async.each(data, function(item, callback) {
		  			Database.getFolderChapters(decoded.username, item.foldername, function(err, data) {
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
app.post('/api/addfolder', function(req, res) {
	// Auth.verify(req.email);
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
		Database.addFolder(decoded.username, req.body.folderName, function(err, data1) {
			if (err) throw(err);
			console.log(req.body.folderName);
			Database.getFolders(decoded.username, function(err, data2) {
		  		if (err) throw Error(err);
		  		var folders = [];
		  		console.log(data2);
		  		async.each(data2, function(item, callback) {
		  			Database.getFolderChapters(decoded.username, item.foldername, function(err, folderdata) {
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

/******************************************************************************
Student Retreival APIs
*******************************************************************************/

app.post('/api/student/getcourses', expjwt, function(req, res) {
  jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getCourses(decoded.username, function(err, data) {
  		if (err) throw Error(err);
  		var courses = [];

  		async.each(data, function(item, callback) {
  			Database.getCourseChapters(item.prof, item.coursename, function(err, data) {
				if (err) callback(err);
				else {
					console.log(data);
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
app.post('/api/getfolders', function(req, res) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getFolders(decoded.username, function(err, data) {
  		if (err) throw Error(err);
  		var folders = [];

  		async.each(data, function(item, callback) {
  			Database.getFolderChapters(decoded.username, item.foldername, function(err, data) {
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

app.post('/api/getcoursenotes', function(req, res) {
	jwt.verify(req.headers["authorization"].split(' ')[1], 'JWT Secret', function(err, decoded) {
  	Database.getCourseNotes(decoded.username, req.prof, req.courseName, function(err, data) {
  		if (err) throw Error(err);
  		res.send(data);
  	});
  });
});

/******************************************************************************
Search APIs
*******************************************************************************/

app.post('/api/search', function(req, res) {
	// Auth.verify(req.email);
	Database.searchChapters(req.body.searchQuery, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

/******************************************************************************
Deletion APIs
*******************************************************************************/

app.post('/api/deletestudentaccount', function(req, res) {
	let email = req.body.email;

	Database.deleteStudent(email, function(err, data) {
		if (err) console.log(err);
		res.send(data);
	});
});

app.post('/api/student/removecourse', function(req, res) {
	Database.removeCourse(req.body.email, req.body.prof, req.body.courseName, function(err, data) {
		if (err) console.log(err);
		res.sendStatus(data);
	});
});
