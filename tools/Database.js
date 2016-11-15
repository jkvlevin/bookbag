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

// Log in a user
Database.validateUser = function(email, password, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let query = client.query("SELECT * FROM students WHERE email = '" + email + "'");
		query.on('row', function(row, result) {
			if(row.password == password) callback(null, 200);
			else if(row.password != password) callback(null, 202);
		});
	});
};

// Get all of a user's courses and return them
Database.getCourses = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM " + sanitizeEmail(email) + "_courses");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
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
Database.getCourseChapters = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query('SELECT * FROM ' + sanitizeEmail(email) + courseName);
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

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

// Add a new student
Database.addStudent = function(email, name, password, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);
		let insertString = "INSERT INTO users (id, email, name, password, prof) VALUES (uuid_generate_v4(), '" + email + "' , '" + name + "' , '" + password + "', FALSE)";
		client.query(insertString);
		let newEmail = email.replace('@', '').replace('.', '');
		let addString = "CREATE TABLE " + newEmail + "_courses (courseName varchar(160))";
		client.query(addString);
		client.query("CREATE TABLE " + newEmail + "_folders (folderName varchar(160))")
		callback(null, "success");
	});
};

// Delete a student
Database.deleteStudent = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Remove from users table
		client.query("DELETE FROM users WHERE email = '" + email + "'");

		// Remove all course-related data
		let userCourses = email.replace('@', '').replace('.', '') + "_courses";
		let query1 = client.query("SELECT courseName FROM " + userCourses);
		query1.on('row', function(row, result) {
			client.query("DROP TABLE " + email.replace('@', '').replace('.', '') + row.courseName.replace(' ', ''));
			client.query("DROP TABLE " + email.replace('@', '').replace('.', '') + row.courseName.replace(' ', '') + "_notes");
		});
		client.query("DROP TABLE " + userCourses);

		// Remove all folder-related data
		let userFolders = email.replace('@', '').replace('.', '') + "_folders";
		let query2 = client.query("SELECT folderName FROM " + userFolders);
		query2.on('row', function(row, result) {
			client.query("DROP TABLE " + email.replace('@', '').replace('.', '') + row.folderName.replace(' ', ''));
			client.query("DROP TABLE " + email.replace('@', '').replace('.', '') + row.folderName.replace(' ', '') + "_notes");
		});
		client.query("DROP TABLE " + userFolders);

		callback(null, "success");
	});
};

Database.createCourse = function(name, prof, desc, keys, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let insertString = "INSERT INTO courses (id, name, prof, description, keywords, subscribers) VALUES (uuid_generate_v4(), '" + name + "', '" + prof + "', '" + desc + "', '" + keys + "', '" + 0 + ")";
		clienty.query(insertString);
		callback(null, "success");
	});
};

// Add a new course to a student
Database.addCourse = function(email, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

	    let cn = courseName.replace(' ', '');

	    // If the course exists, insert it into the student's courselist

		// Insert the course into the student's courselist
		let insertString = "INSERT INTO " + sanitizeEmail(email) + "_courses VALUES ('" + cn + "')";
		client.query(insertString);

		// Create a new table that holds all the student's notes for the course
	    let createString = "CREATE TABLE " + sanitizeEmail(email) + cn + "_notes (chapter varchar(80), pdf_url varchar(200))";
		client.query(createString);
		callback(null, "success");
	});
};

// Add a new course to a student
Database.addFolder = function(email, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

	    let fn = folderName.replace(' ', '');

		// Insert the course into the student's courselist
		let insertString = "INSERT INTO " + sanitizeEmail(email) + "_folders VALUES ('" + fn + "')";
		client.query(insertString);

		// Create a new table that holds all the chapters in this course
	    let createString = "CREATE TABLE " + sanitizeEmail(email) + fn + "_notes (chapter varchar(80), pdf_url varchar(200))";
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

function sanitizeEmail(email) {
	return email.replace('@', '').replace('.', '');
}

/******************************************************************************
PROFESSOR DATABASE QUERIES
*******************************************************************************/

module.exports = Database;
