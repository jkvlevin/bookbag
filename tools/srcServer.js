import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';

/* eslint-disable no-console */

const app = express();
const compiler = webpack(config);

let Database = require('./Database.js');
let bodyParser = require('body-parser');
// var Auth = require('Auth')

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
  	res.sendStatus(data);
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

// Create new Course (Prof-only)
app.post('/api/student/addcourse', function(req, res) {
	Database.addCourse(req.body.email, req.body.courseName, req.body.prof, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

app.post('/api/prof/createcourse', function(req, res) {
	Database.createCourse(req.body.name, req.body.prof, req.body.description, req.body.keywords, function(err, data) {
		if (err) throw(err);
		res.end(data);
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

app.post('/api/student/getcourses', function(req, res) {
	Database.getCourses(req.body.email, function(err, data) {
		if (err) throw Error(err);
		var courses = [];
		getCourseData(courses, data, req.body.email, function(d) {

			res.send(d);
		})
	});
});

app.post('/api/getfolders', function(req, res) {
	// Auth.verify(req.email);
	Database.getFolders(req.body.email, function(err, data) {
		if (err) throw Error(err);
		res.send(data);
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

app.post('/api/getfolderchapters', function(req, res) {
	// Auth.verify(req.email);
	var folders = [];
	getFolderData(folders, req.body.folders, req.body.email, function(data) {
		res.send(data);
	})
});

var getFolderData = function(folders, rfolders, email, callback) {
	for (var course in rfolders) {
		getFolderCalls(folders, rfolders[folder].coursename, email, function(data) {
			folders.push(data);
			if (foldres.length == rfolders.length) {
				callback(folders);
			}
		});
	}
};

var getFolderCalls = function(courses, coursename, email, callback) {
	Database.getCourseChapters(email, coursename, function(err, data) {
		if (err) throw Error(err);
		callback({
			courseName: coursename,
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
		res.end(data);
	});
});
