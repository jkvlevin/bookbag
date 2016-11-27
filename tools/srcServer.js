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
let Auth = require('./Auth.js')
let jwt = require('jsonwebtoken')
var con  = require('./config')


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
Route middlewhere to verify token
*******************************************************************************/

// var apiRoutes = express.Router();

// apiRoutes.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   console.log("hello");

//   // decode token
//   if (token) {

//   	  console.log("hi");

//     // verifies secret and checks exp
//     jwt.verify(token, con.secret, function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// });


/******************************************************************************
Routes
*******************************************************************************/

//login code
app.post('/api/login', function(req, res) {
  Database.validateUser(req.body.email, req.body.password, function(err, data) {
  	if (err) return;

  	var token = Auth.generateToken(req.body.email);
	// res.json({
	// 	success: true,
	// 	message: 'Enjoy your token!',
	// 	token: token
	// });
  	
  	res.sendStatus(data);
  });
});

app.post('/api/createstudentaccount', function(req, res) {
	let name = req.body.name;
	//let pw = req.body.pw;
	let pw = Auth.hashPassword(req.body.pw);
	console.log(pw);
	let email = req.body.email;
	let exp_date = '2017-12-12';

	// Auth.creatAccount should try to create account and return either
	// creation verification or creation error
	// Auth.createAccount(name, pw, email);
	Database.addStudent(email, name, pw, exp_date, function(err, data) {
		if (err) throw Error(err);

		var token = Auth.generateToken(email);

		res.end(data);
		// res.json({
		// 	success: true,
		// 	token: token
		// });
	});
});

app.post('/api/deleteStudent', function(req, res) {
	let email = req.body.email;

	Database.deleteStudent(email, function(err, data) {
		if (err) throw Error(err);
		res.end(data);
	});
});

app.post('/api/getcourses', function(req, res) {
	// Auth.verify(req.email);
	Database.getCourses(req.body.email, function(err, data) {
		if (err) throw Error(err);
		res.send(data);
	});
});

app.post('/api/getcoursechapters', function(req, res) {
	// Auth.verify(req.email);
	var courses = [];
	loopFunction(courses, req.body.courses, req.body.email, function(data) {
		res.send(data);
	})
});

var loopFunction = function(courses, rcourses, email, callback) {
	for (var course in rcourses) {
		getCourseCalls(courses, rcourses[course].coursename, email, function(data) {
			courses.push(data);
			if (courses.length == rcourses.length) {
				callback(courses);
			}
		});
	}
};

var getCourseCalls = function(courses, coursename, email, callback) {
	Database.getCourseChapters(email, coursename, function(err, data) {
		if (err) throw Error(err);
		callback({
			courseName: coursename,
			chapters : data
		});
	});
};

app.post('/api/search', function(req, res) {
	// Auth.verify(req.email);
	Database.searchChapters(req.body.searchQuery, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

app.post('/api/addCourse', function(req, res) {
	// Auth.verify(req.email);
  console.log("The Course is " + req.body.courseName);
	Database.addCourse(req.body.email, req.body.courseName, function(err, data) {
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
