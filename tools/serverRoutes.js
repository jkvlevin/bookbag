import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';

var Database = require('Database')
var Auth = require('Auth')

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

//login code
app.get('/login', function(req, res) {
  var userId = req.userId;
  var pw = req.pw;

  // Auth.login should try login, send either the correct user data
  // or a notification of login failure
  res = Auth.login(userId, pw);
});

app.get('/signup', function(req, res) {
	var name = req.name;
	var pw = req.pw;
	var email = req.email;

	// Auth.creatAccount should try to create account and return either
	// creation verification or creation error
	Auth.createAccount(name, pw, email);
	Database.addStudent(name, pw, email);
});

app.get('/student', function(req, res) {
	Auth.verify(req.email);
	data = Database.getClasses(req.userId);
	res.send(data);
});

app.get('/student/search', function(req, res) {
	Auth.verify(req.email);
	data = Database.search(req.searchQuery);
	res.send(data);
});

app.post('/student/searchShade', function(req, res) {
	Auth.verify(req.userId);
	data = Database.shadeSearch(req.searchQuery);
	res.send(data);
})
