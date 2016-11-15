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
Account Queries
*******************************************************************************/

// Log in a user
Database.validateUser = function(email, password, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let query = client.query("SELECT * FROM users WHERE email = '" + email + "'");
		query.on('row', function(row, result) {
			if(row.password == password) callback(null, 200);
			else if(row.password != password) callback(null, 202);
		});
	});
};

// Add a new student
Database.addStudent = function(email, name, password, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		// Insert the new user into users
		client.query("INSERT INTO users (id, email, name, password, prof) VALUES (uuid_generate_v4(), '" + email + "' , '" + name + "' , '" + password + "', FALSE)");
		// Add _courses table
		client.query("CREATE TABLE " + sanitizeEmail(email) + "_courses (courseName varchar(160), prof varchar(80))");
		// Add _folders table
		client.query("CREATE TABLE " + sanitizeEmail(email) + "_folders (folderName varchar(160))");
		callback(null, "success");
	});
};

/******************************************************************************
Creation Queries
*******************************************************************************/

// Allows a professor to create a course
Database.createCourse = function(name, prof, desc, keys, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let cn = name.replace(' ', '');
		client.query("INSERT INTO courses (id, name, prof, description, keywords, subscribers) VALUES (uuid_generate_v4(), '" + name + "', '" + prof + "', '" + desc + "', '" + keys + "', " + 0 + ")");
		client.query("CREATE TABLE " + sanitizeEmail(prof) + cn + "_chapters (chapter varchar(80), pdf_url varchar(200))");
		callback(null, "success");	
	});
}

// Add a course to a student's library
Database.addCourse = function(email, courseName, prof, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

	    let cn = courseName.replace(' ', '');

	    // If the course exists, insert it into the student's courselist

		// Insert the course into the student's courselist
		let insertString = "INSERT INTO " + sanitizeEmail(email) + "_courses VALUES ('" + cn + "', '"+ prof + "')";
		client.query(insertString);

		// Create a new table that holds all the student's notes for the course
	    let createString = "CREATE TABLE " + sanitizeEmail(email) + cn + sanitizeEmail(prof) + "_notes (chapter varchar(80), pdf_url varchar(200))";
		client.query(createString);
		callback(null, "success");
	});
};

// Add a new folder to a student's library
Database.addFolder = function(email, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

	    let fn = folderName.replace(' ', '');

		// Insert the course into the student's courselist
		let insertString = "INSERT INTO " + sanitizeEmail(email) + "_folders VALUES ('" + fn + "')";
		client.query(insertString);

		// Create a new table that holds all the chapters in this course
	    let createString = "CREATE TABLE " + sanitizeEmail(email) + fn + " (chapter varchar(80), pdf_url varchar(200))";
		client.query(createString);
		callback(null, "success");
	});
};

// Add a chapter to a course
Database.addChapter = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);


		// client.query("INSERT INTO " + addString + "VALUES ('" + courseName + "')");
		// client.query('CREATE TABLE ' + email + courseName + ' (chapter varchar(80))');
	});
};

// Add a note to a course
Database.addNote = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);


		// client.query("INSERT INTO " + addString + "VALUES ('" + courseName + "')");
		// client.query('CREATE TABLE ' + email + courseName + ' (chapter varchar(80))');
	});
};

/******************************************************************************
Retreival Queries
*******************************************************************************/


// Get all of a user's courses and return them
Database.getCourses = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM " + sanitizeEmail(email) + "_courses");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, result.rows);
		});
	});
};

// Get all of a user's courses and return them
Database.getFolders = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM " + sanitizeEmail(email) + "_folders");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

// Get all of the chapters in a give student's course
Database.getCourseChapters = function(prof, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let cn = courseName.replace(' ', '');
		let query = client.query('SELECT * FROM ' + sanitizeEmail(prof) + cn + "_chapters");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

/******************************************************************************
Search Queries
*******************************************************************************/

// Search a user's query and return the results
Database.searchChapters = function(searchQuery, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM chapters WHERE title ILIKE '%" + searchQuery + "%'");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

/******************************************************************************
Deletion Queries
*******************************************************************************/

// Delete a student
Database.deleteStudent = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Remove from users table
		client.query("DELETE FROM users WHERE email = '" + email + "'");

		// Remove all course-related data
		let userCourses = sanitizeEmail(email) + "_courses";

		// Scrub all of the course notes
		let query1 = client.query("SELECT * FROM " + userCourses);
		query1.on('row', function(row, result) {
			if (row != null) {
				client.query("DROP TABLE " + sanitizeEmail(email) + row.coursename.replace(' ', '') + sanitizeEmail(row.prof) + "_notes");
			}
		});
		client.query("DROP TABLE " + userCourses);

		// Remove all folder-related data
		let userFolders = sanitizeEmail(email) + "_folders";

		// Scrub all folders
		let query2 = client.query("SELECT foldername FROM " + userFolders);
		query2.on('row', function(row, result) {
			if (row != null) {
				client.query("DROP TABLE " + sanitizeEmail(email) + row.foldername.replace(' ', ''));
			}
		});
		client.query("DROP TABLE " + userFolders);

		callback(null, "success");
	});
};

// Remove course from a student
Database.deleteCourse = function(userId, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		client.query('DROP TABLE' + userId + courseName);
		client.query('DELETE FROM ' + userId + '_courses WHERE name = ' + courseName);
		callback("successfully deleted course " + courseName);
	});
};

// Remove a chapter from a student's course
Database.deleteChapter = function(email, courseName, chapterName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		client.query('DELETE FROM ' + sanitizeEmail(email) + courseName + ' WHERE name = ' + chapterName);
	});
};

/******************************************************************************
Helper Functions
*******************************************************************************/

function sanitizeEmail(email) {
	return email.replace('@', '').replace('.', '');
}

module.exports = Database;
