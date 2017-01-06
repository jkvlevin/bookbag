/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

let pg = require('pg');
let Database = [];
const DATABASE_URL = 'postgres://xtlscmgxzqrpjq:su76vkQ798qEeiMi1MxsclLq_2@ec2-184-73-196-82.compute-1.amazonaws.com:5432/d3qu3p1gh95p7l';
var bcrypt  = require('bcrypt-nodejs');

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
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) {
			done();
			callback(err);
		}

		let query = client.query("SELECT * FROM users WHERE email = '" + email + "'");
		query.on('row', function(row, result) {
			done();

			bcrypt.compare(password, row.password, function(e, res) {
				if 		(e)    callback("hash error");
				else if (res)  callback(null, 200);
				else if (!res) callback("password or username does not match");
			});
		});
		query.on('end', function(result) {
			if (result.rowCount == 0) callback("user does not exist");
		})
	});
};

// Add a new student
Database.addStudent = function(email, name, password, callback) {

	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("SELECT EXISTS(SELECT * FROM users WHERE email = '" + email + "')").on('row', function(row, result) {
			if (row["exists"] == true) {
				done();
				let errorString = email + " is taken";
				callback(errorString);
			} else {

				if (e) {
					console.log(e);
					callback(e);
				}

				else {
					console.log(hash);

					// Insert the new user into users
					client.query("INSERT INTO users (id, email, name, password, prof) VALUES (uuid_generate_v4(), '" + email + "' , '" + name + "' , '" + hash + "', FALSE)");
					// Add _courses table
					client.query("CREATE TABLE " + sanitizeEmail(email) + "_courses (coursename varchar(160), prof varchar(160))");
					// Add _folders table
					client.query("CREATE TABLE " + sanitizeEmail(email) + "_folders (foldername varchar(160))");
					done();
					callback(null, "success");
				}
			}
		});
	});
};

/******************************************************************************
Creation Queries
*******************************************************************************/

// Allows a professor to create a course
Database.createCourse = function(name, prof, desc, keys, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let cn = name.replace(' ', '');

		client.query("INSERT INTO courses (id, name, prof, description, keywords, subscribers) VALUES (uuid_generate_v4(), '" + name + "', '" + prof + "', '" + desc + "', '" + keys + "', " + 0 + ")");
		client.query("CREATE TABLE " + sanitizeEmail(prof) + cn + "_chapters (name varchar(160), prof varchar(160), url varchar(2083))");
		done();
		callback(null, "success");
	});
}

// Add a course to a student's library
Database.addCourse = function(email, courseName, prof, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

	    let cn = courseName.replace(' ', '');

		// Insert the course into the student's courselist
		client.query("INSERT INTO " + sanitizeEmail(email) + "_courses VALUES ('" + cn + "', '"+ prof + "')");

		// Create a new table that holds all the student's notes for the course
		client.query("CREATE TABLE " + sanitizeEmail(email) + cn + sanitizeEmail(prof) + "_notes (name varchar(160), prof varchar(160), url varchar(2083))");
		done();
		callback(null, "success");
	});
};

// Add a new folder to a student's library
Database.addFolder = function(email, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

	    let fn = folderName.replace(' ', '');

		// Insert the course into the student's courselist
		client.query("INSERT INTO " + sanitizeEmail(email) + "_folders VALUES ('" + fn + "')", function() {
			// Create a new table that holds all the chapters in this course
			client.query("CREATE TABLE " + sanitizeEmail(email) + fn + " (name varchar(160), prof varchar(160), url varchar(2083))", function() {
					done();
					callback(null, "success");
			});
		});
	});
};

// Allows a professor to add a chapter to a course
Database.addChapterToCourse = function(prof, chapterName, chapterAuthor, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		let cn = courseName.replace(' ', '');
		if (err) callback(err);
		let s = "INSERT INTO " + sanitizeEmail(prof) + cn + "_chapters VALUES ('" + chapterName + "', '" + chapterAuthor + "', null)";
		client.query(s);
		done();
		callback(null, 202);
	});
};

// Allows a student to add a chapter to course notes
Database.addChapterToCourseNotes = function(student, prof, chapterName, chapterAuthor, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		let cn = courseName.replace(' ', '');
		if (err) callback(err);
		let s = "INSERT INTO " + sanitizeEmail(student) + cn + sanitizeEmail(prof) + "_notes VALUES ('" + chapterName + "', '" + chapterAuthor + "', null)";
		client.query(s);
		done();
		callback(null, 202);
	});
};

// Allows a student to add a chapter to a folder
Database.addChapterToFolder = function(student, chapterName, chapterAuthor, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		let fn = folderName.replace(' ', '');
		if (err) callback(err);
		let s = "INSERT INTO " + sanitizeEmail(student) + fn + " VALUES ('" + chapterName + "', '" + chapterAuthor + "', null)";
		client.query(s);
		done();
		callback(null, 202);
	});
};

// Create a Chapter for a prof
Database.createChapter = function(prof, chapterName, contributors, checkout_dur, pdf_url, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		//Retreive pdf and src urls from git module
		let s = "INSERT INTO chapters(id, name, owner, contributors, pdf_url, checkout_dur) VALUES (uuid_generate_v4(), '" + chapterName + "', '" + prof + "', '" + contributors + "', '" + pdf_url + "', " + checkout_dur + ")";
		client.query(s);
		done();
		callback(null, 202);
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
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM " + sanitizeEmail(email) + "_courses");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

// Get all of the chapters in a give student's course
Database.getCourseChapters = function(prof, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let cn = courseName.replace(' ', '');
		let courseTable = sanitizeEmail(prof) + cn + "_chapters";
		let query = client.query('SELECT id, chapters.name, owner, contributors, src_url, pdf_url, checkout_user, checkout_exp, checkout_dur FROM chapters INNER JOIN ' + courseTable + ' on chapters.name = ' + courseTable + '.name AND ' + courseTable + ".prof IS NOT NULL");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

Database.getCourseNotes = function(user, prof, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let cn = courseName.replace(' ', '');
		let notesTable = sanitizeEmail(user) + cn + sanitizeEmail(prof) + "_notes";
		let query = client.query("SELECT name, url FROM " + notesTable + " where prof IS NULL");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		})
	});
};

// Get all of a user's folders and return them
Database.getFolders = function(email, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM " + sanitizeEmail(email) + "_folders");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

// Get all of the chapters in a give student's folder
Database.getFolderChapters = function(email, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let fn = folderName.replace(' ', '');
		let folderTable = sanitizeEmail(email) + fn;
		let s = "SELECT id, chapters.name, owner, contributors, src_url, pdf_url, checkout_user, checkout_exp, checkout_dur FROM chapters INNER JOIN " + folderTable + " on chapters.name = " + folderTable + ".name AND " + folderTable + ".prof IS NOT NULL";
		let query = client.query(s);
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
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

		let query = client.query("SELECT * FROM chapters WHERE name ILIKE '%" + searchQuery + "%'");
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

// Remove course from a student's library
Database.removeCourse = function(email, prof, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		client.query('DROP TABLE' + email + courseName + prof + "_notes");
		client.query("DELETE FROM " + email + "_courses WHERE name = '" + courseName + "'");
		client.query("UPDATE courses SET subscribers = subscribers - 1 WHERE name = '" + courseName + "' AND prof = '" + prof + "'");
		callback(null, 200);
	});
};

Database.deleteCourse = function(prof, courseName, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Remove from course master list
		client.query("DELETE FROM courses WHERE name = '" + courseName + "' AND prof = '" + prof + "'");
		// Remove from prof's courses
		client.query("DELETE FROM " + prof + "_courses WHERE name = '" + courseName + "'");
		// Remove from any student's courselist
		client.query("DROP TABLE IN (SELECT * FROM pg_tables WHERE SUBSTRING(tablename FROM '" + courseName + prof + "') <> ''");

		callback(null, 200);

	});
};

Database.deleteChapter = function(prof, chapterName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("DELETE FROM chapters WHERE name = '" + chapterName + "' and owner = '" + prof + "'");
		done();
		callback(null, 200);
	});
}

/******************************************************************************
Helper Functions
*******************************************************************************/

function sanitizeEmail(email) {
	return email.replace('@', '').replace('.', '');
}

module.exports = Database;
