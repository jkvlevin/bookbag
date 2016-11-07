/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

let pg = require('pg');
let Database = [];
const DATABASE_URL = 'postgres://xtlscmgxzqrpjq:su76vkQ798qEeiMi1MxsclLq_2@ec2-184-73-196-82.compute-1.amazonaws.com:5432/d3qu3p1gh95p7l';

/******************************************************************************
Initial Database Connection
*******************************************************************************/

pg.defaults.ssl = true;
pg.connect(DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');
});

/******************************************************************************
STUDENT DATABASE QUERIES
*******************************************************************************/

// Get all of a user's classes and return them
Database.getClasses = function(userId) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		let query = client.query("SELECT name FROM " + userId + "_courses");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			return result.rows;
		});
	});
};

// Get all of the chapters in a give student's course
Database.getChapters = function(userId, courseName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		let query = client.query('SELECT * FROM ' + userId + courseName);
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			return result.rows;
		});
	});
};

// Search a user's query and return the results
Database.searchChapters = function(searchQuery, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) {
			callback(err);
		}
		let query = client.query("SELECT * FROM chapters WHERE title ILIKE '%" + searchQuery + "%'");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

// Add a new student
Database.addStudent = function(email, name, password, exp_date, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let insertString = "INSERT INTO students (email, name, password, exp_date) VALUES ('" + email + "' , '" + name + "' , '" + password + "' , to_date('" + exp_date + "', 'YYYY/MM/DD'))";
		client.query(insertString);
		let newEmail = email.replace('@', '').replace('.', '') + "_courses";
		let addString = "CREATE TABLE " + newEmail + " (courseName varchar(160))";
		client.query(addString);
		callback(null, "success");
	});
};

// Delete a student
Database.deleteStudent = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		client.query("DELETE FROM students WHERE email = '" + email + "'");

		let courses = email.replace('@', '').replace('.', '') + "_courses";
		let query = client.query("SELECT coursename FROM " + courses);
		query.on('row', function(row, result) {
			client.query("DROP TABLE " + email.replace('@', '').replace('.', '') + row.coursename.replace(' ', ''));
		});
		client.query("DROP TABLE " + courses);

		callback(null, "success");
	});
};

// Add a new course to a student
Database.addCourse = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		let newEmail = email.replace('@', '').replace('.', '') + "_courses";
		let insertString = "INSERT INTO " + newEmail + " VALUES ('" + courseName + "')";
		client.query(insertString);

		// Create a new table that holds all the chapters in this course
		let id = email.replace('@', '').replace('.', '') + courseName.replace(' ', '');
		client.query("CREATE TABLE " + id + " (chapter varchar(80))");
		callback(null, "success");
	});
};

// Add a chapter to a course
Database.addChapter = function(email, courseName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		
		// client.query("INSERT INTO " + addString + "VALUES ('" + courseName + "')");
		// client.query('CREATE TABLE ' + email + courseName + ' (chapter varchar(80))');
	});
};

// Remove course from a student
Database.deleteCourse = function(userId, courseName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DROP TABLE' + userId + courseName);
		client.query('DELETE FROM ' + userId + '_courses WHERE name = ' + courseName);
	});
};

// Remove a chapter from a student's course
Database.deleteChapter = function(userId, courseName, chapterName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DELETE FROM ' + userId + courseName + ' WHERE name = ' + chapterName);
	});
};

/******************************************************************************
PROFESSOR DATABASE QUERIES
*******************************************************************************/

module.exports = Database;