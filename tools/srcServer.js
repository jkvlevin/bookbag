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
Routes
*******************************************************************************/

//login code
app.get('/login', function(req, res) {
  let userId = req.body.email;
  let pw = req.body.pw;

  // Auth.login should try login, send either the correct user data
  // or a notification of login failure
  // res = Auth.login(userId, pw);
});

app.post('/signup', function(req, res) {
	let name = req.body.name;
	let pw = req.body.pw;
	let email = req.body.email;
	let exp_date = '2017-12-12';

	// Auth.creatAccount should try to create account and return either
	// creation verification or creation error
	// Auth.createAccount(name, pw, email);
	Database.addStudent(email, name, pw, exp_date, function(err, data) {
		if (err) throw Error(err);
		res.end(data);
	});
});

app.post('/deleteStudent', function(req, res) {
	let email = req.body.email;

	Database.deleteStudent(email, function(err, data) {
		if (err) throw Error(err);
		res.end(data);
	});
});

app.get('/student', function(req, res) {
	// Auth.verify(req.email);
	Database.getClasses(req.body.email, function(err, data) {
		if (err) throw Error(err);
		res.send(data);
	});
});

app.post('/search', function(req, res) {
	// Auth.verify(req.email);
	Database.searchChapters(req.body.searchQuery, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

app.post('/addCourse', function(req, res) {
	// Auth.verify(req.email);
	Database.addCourse(req.body.email, req.body.courseName, function(err, data) {
		if (err) throw(err);
		res.end(data);
	});
});

app.post('/student/searchShade', function(req, res) {
	// Auth.verify(req.userId);
	Database.shadeSearch(req.searchQuery, function(err, data) {
		res.send(data);
	});
});
