/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

var pg = require('pg');
var Database = [];

/******************************************************************************
Initial Database Connection
*******************************************************************************/

Database.init = function() {
	pg.defaults.ssl = true;
	pg.connect(process.env.DATABASE_URL, function(err, client) {
	  if (err) throw err;
	  console.log('Connected to postgres! Getting schemas...');

	  client.query('SELECT table_schema,table_name FROM information_schema.tables;').on('row', function(row) {
	      console.log(JSON.stringify(row));
	    });
	});
}

/******************************************************************************
STUDENT DATABASE QUERIES
*******************************************************************************/

// Get all of a user's classes and return them
Database.getClasses = function(userId) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		var query = client.query('SELECT name FROM ' + userId + '_courses');
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			return result.rows;
		})
	})
}

// Get all of the chapters in a give student's course
Database.getChapters = function(userId, courseName) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		var query = client.query('SELECT * FROM ' + userId + courseName);
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			return result.rows;
		})
	})
}

// Search a user's query and return the results
Database.search = function(searchQuery) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		var query = client.query('SELECT * from chapters WHERE chapters.name = ' + searchQuery);
	})
}

// Add a new student
Database.addStudent = function(name, email) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		var query = client.query('INSERT INTO students VALUES (' + name + ',' + email + ')');
	})
}

// Delete a student
Database.deleteStudent = function(email) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		// var query = client.query('DELETE FROM students WHERE email = ' + email);
	})
}

// Add a new course to a student
Database.addCourse = function(userId, courseName) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('INSERT INTO ' + userId + '_courses VALUES (' + courseName + ')');
		client.query('CREATE TABLE ' + userId + courseName + 'chapter varchar(80)');
	})
}

// Add a chapter to a course
Database.addChapter = function(userId, courseName) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('INSERT INTO ' + userId + '_courses VALUES (' + courseName + ')');
		client.query('CREATE TABLE ' + userId + courseName + 'chapter varchar(80)');
	})
}

// Remove course from a student
Database.deleteCourse = function(userId, courseName) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DROP ' + userId + courseName);
		client.query('DELETE FROM ' + userId + '_courses WHERE name = ' + courseName);
	})
}

// Remove a chapter from a student's course
Database.deleteChapter = function(userId, courseName, chapterName) {
	pg.connect(process.env.DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DELETE FROM ' + userId + courseName + ' WHERE name = ' + chapterName);
	})
}

/******************************************************************************
PROFESSOR DATABASE QUERIES
*******************************************************************************/

module.exports = Database;