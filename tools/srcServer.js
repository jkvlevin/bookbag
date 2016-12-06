import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';

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
		res.sendStatus(data);
	});
});

app.post('/api/prof/addchaptertocourse', function(req, res) {
	Database.addChapterToCourse(req.body.prof, req.body.chaptername, req.body.chapterauthor, req.body.coursename, function(err, data) {
		if (err) throw(err);
		res.sendStatus(data);
	});
});

app.post('/api/student/addchaptertocoursenotes', function(req, res) {
	Database.addChapterToCourseNotes(req.body.student, req.body.prof, req.body.chaptername, req.body.chapterauthor, req.body.coursename, function(err, data) {
		if (err) throw(err);
		res.sendStatus(data);
	});
});

app.post('/api/student/addchaptertofolder', function(req, res) {
	Database.addChapterToFolder(req.body.student, req.body.chaptername, req.body.chapterauthor, req.body.foldername, function(err, data) {
		if (err) throw(err);
		res.sendStatus(data);
	});
});

// Create new Folder (Both Accounts)
app.post('/api/addfolder', function(req, res) {
	// Auth.verify(req.email);
	Database.addFolder(req.body.email, req.body.folderName, function(err, data) {
		if (err) throw(err);
		res.end(data);
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
  		getCourseData(courses, data, req.body.email, function(d) {
  			res.send(d);
  		})
  	});
  });
});

var getCourseData = function(courses, courseData, email, callback) {
	for (var course in courseData) {
		getCourseCalls(courses, courseData[course].coursename, courseData[course].prof, function(data) {
			courses.push(data);
			if (courses.length == courseData.length) {
				callback(courses);
			}
		});
	}
};

var getCourseCalls = function(courses, coursename, prof, callback) {
	Database.getCourseChapters(prof, coursename, function(err, data) {
		if (err) throw Error(err);
		callback({
			courseName: coursename,
			chapters : data
		});
	});
};

// Get all folder names
app.post('/api/getfolders', function(req, res) {
	// Auth.verify(req.email);
	Database.getFolders(req.body.email, function(err, data) {
		if (err) throw Error(err);
		var folders = [];
		getFolderData(folders, data, req.body.email, function(d) {
			res.send(d);
		})
	});
});

var getFolderData = function(folders, folderData, email, callback) {
	for (var folder in folderData) {
		getFolderCalls(folders, folderData[folder].foldername, email, function(data) {
			folders.push(data);
			if (folders.length == folderData.length) {
				callback(folders);
			}
		});
	}
};

var getFolderCalls = function(courses, foldername, email, callback) {
	Database.getFolderChapters(email, foldername, function(err, data) {
		if (err) throw Error(err);
		callback({
			folderName: foldername,
			chapters : data
		});
	});
};

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

app.post('/api/searchShade', function(req, res) {
	// Auth.verify(req.userId);
	Database.shadeSearch(req.searchQuery, function(err, data) {
		res.send(data);
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
