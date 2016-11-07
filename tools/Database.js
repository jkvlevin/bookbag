/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

var pg = require('pg');
var Database = [];
const DATABASE_URL = 'postgres://xtlscmgxzqrpjq:su76vkQ798qEeiMi1MxsclLq_2@ec2-184-73-196-82.compute-1.amazonaws.com:5432/d3qu3p1gh95p7l';

/******************************************************************************
Initial Database Connection
*******************************************************************************/

pg.defaults.ssl = true;
pg.connect(DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client.query('SELECT table_schema,table_name FROM information_schema.tables;').on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

/******************************************************************************
STUDENT DATABASE QUERIES
*******************************************************************************/

// Get all of a user's classes and return them
Database.getClasses = function(userId) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		var query = client.query("SELECT name FROM " + userId + "_courses");
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
	pg.connect(DATABASE_URL, function(err, client) {
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
Database.searchChapters = function(searchQuery, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) {
			callback(err)
		}
		var query = client.query("SELECT * FROM chapters WHERE title ILIKE '%" + searchQuery + "%'");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	})
}

// Add a new student
Database.addStudent = function(email, name, password, exp_date, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		var insertString = "INSERT INTO students (email, name, password, exp_date) VALUES ('" + email + "' , '" + name + "' , '" + password + "' , to_date('" + exp_date + "', 'YYYY/MM/DD'))";
		client.query(insertString);
		var newEmail = email.replace('@', '').replace('.', '') + "_courses";
		var addString = "CREATE TABLE " + newEmail + " (courseName varchar(160))";
		client.query(addString);
		callback(null, "success");
	})
}

// Delete a student
Database.deleteStudent = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		var query = client.query("DELETE FROM students WHERE email = '" + email + "'");
		callback(null, "success");
	})
}

// Add a new course to a student
Database.addCourse = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		var newEmail = email.replace('@', '').replace('.', '') + "_courses";
		var insertString = "INSERT INTO " + newEmail + " VALUES ('" + courseName + "')";
		client.query(insertString);

		// Create a new table that holds all the chapters in this course
		var id = email.replace('@', '').replace('.', '') + courseName.replace(' ', '');
		client.query("CREATE TABLE " + id + " (chapter varchar(80))");
		callback(null, "success");
	})
}

// Add a chapter to a course
Database.addChapter = function(email, courseName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		
		client.query("INSERT INTO " + addString + "VALUES ('" + courseName + "')");
		client.query('CREATE TABLE ' + userId + courseName + ' (chapter varchar(80))');
	})
}

// Remove course from a student
Database.deleteCourse = function(userId, courseName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DROP ' + userId + courseName);
		client.query('DELETE FROM ' + userId + '_courses WHERE name = ' + courseName);
	})
}

// Remove a chapter from a student's course
Database.deleteChapter = function(userId, courseName, chapterName) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query('DELETE FROM ' + userId + courseName + ' WHERE name = ' + chapterName);
	})
}

/******************************************************************************
PROFESSOR DATABASE QUERIES
*******************************************************************************/

module.exports = Database;