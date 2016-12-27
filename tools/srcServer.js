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
//git.uploadFilesToRepo('Test2', "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PCAvVGl0bGUgMTUgMCBSIC9Qcm9kdWNlciAxNiAwIFIgL0NyZWF0b3IgMTcgMCBSIC9DcmVhdGlvbkRhdGUgMTggMCBSIC9Nb2REYXRlCjE4IDAgUiAvS2V5d29yZHMgMTkgMCBSIC9BQVBMOktleXdvcmRzIDIwIDAgUiA+PgplbmRvYmoKeHJlZgowIDIxCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwNzE5MSAwMDAwMCBuIAowMDAwMDAwMjY1IDAwMDAwIG4gCjAwMDAwMDE3NDEgMDAwMDAgbiAKMDAwMDAwMDAyMiAwMDAwMCBuIAowMDAwMDAwMjQ2IDAwMDAwIG4gCjAwMDAwMDAzNjkgMDAwMDAgbiAKMDAwMDAwMTcwNiAwMDAwMCBuIAowMDAwMDAxODc0IDAwMDAwIG4gCjAwMDAwMDA0NjYgMDAwMDAgbiAKMDAwMDAwMTY4NSAwMDAwMCBuIAowMDAwMDAxODI0IDAwMDAwIG4gCjAwMDAwMDIyMzMgMDAwMDAgbiAKMDAwMDAwMjQ4MyAwMDAwMCBuIAowMDAwMDA2OTgwIDAwMDAwIG4gCjAwMDAwMDcwMDEgMDAwMDAgbiAKMDAwMDAwNzAzMCAwMDAwMCBuIAowMDAwMDA3MDgzIDAwMDAwIG4gCjAwMDAwMDcxMTAgMDAwMDAgbiAKMDAwMDAwNzE1MiAwMDAwMCBuIAowMDAwMDA3MTcxIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMjEgL1Jvb3QgMTEgMCBSIC9JbmZvIDEgMCBSIC9JRCBbIDxjN2YyNzg0OTE0Zjg2MzA5ZTk2ZDIwOTM1YjFlNTc0Nj4KPGM3ZjI3ODQ5MTRmODYzMDllOTZkMjA5MzViMWU1NzQ2PiBdID4+CnN0YXJ0eHJlZgo3MzM1CiUlRU9GCg==", "testing another file upload");
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
			res.sendStatus(d);
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
