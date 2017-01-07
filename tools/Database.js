/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

let pg = require('pg');
let Database = [];
const DATABASE_URL = 'postgres://xtlscmgxzqrpjq:su76vkQ798qEeiMi1MxsclLq_2@ec2-184-73-196-82.compute-1.amazonaws.com:5432/d3qu3p1gh95p7l';
var Hash = require('./auth/Hash.js');

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
			
		// bcrypt.compare(password, row.password, function(e, res) {
		// 	if 		(e)    callback("hash error");
		// 	else if (res)  callback(null, 200);
		// 	else if (!res) callback("password or username does not match");
		// });

		query.on('end', function(result) {
			if (result.rowCount == 0) callback("user does not exist");
			else {
				let uuid = result.rows[0]["id"];
				let name = result.rows[0]["name"];
				let prof = result.rows[0]["prof"];
				done();

				Hash.validatePassword(password, result.rows[0].password, function(e, res) {
					if (e)
						callback(e);

					if (res) callback(null, {id : uuid, name : name, prof : prof});
					else     callback("password or username does not match");

				});
			}		
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
				
				// Hash password then insert the new user into users
				Hash.hashPassword(password, function(e, hash) {
					if (e)
						callback(e);

					client.query("INSERT INTO users (email, name, password, prof) VALUES ('" + email + "' , '" + name + "' , '" + hash + "', FALSE)");

					client.query("SELECT * FROM users WHERE email = '" + email + "'").on('end', function(result) {
						let uuid = result.rows[0]["id"];
						// Add _courses table
						client.query("CREATE TABLE \"" + uuid + "_courses\" (id text)");
						// Add _folders table
						client.query("CREATE TABLE \"" + uuid + "_folders\" (id text, name varchar(160))");
						client.query("CREATE TRIGGER trigger_users_genid BEFORE INSERT ON \"" + uuid + "_folders\" FOR EACH ROW EXECUTE PROCEDURE unique_short_id()");
						done();
						callback(null, uuid);
					});
				});
			}
		});
	});
};

// Add a new prof
Database.addProf = function(email, name, password, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("SELECT EXISTS(SELECT * FROM users WHERE email = '" + email + "')").on('row', function(row, result) {
			if (row["exists"] == true) {
				done();
				let errorString = email + " is taken";
				callback(errorString);
			} else {
				
				// Hash password and insert the new user into users
				Hash.hashPassword(password, function(e, hash) {
					if (e)
						callback(e);

					client.query("INSERT INTO users (email, name, password, prof) VALUES ('" + email + "' , '" + name + "' , '" + hash + "', TRUE)");

					client.query("SELECT * FROM users WHERE email = '" + email + "'").on('end', function(result) {
						let uuid = result.rows[0]["id"];
						// Add _courses table
						client.query("CREATE TABLE \"" + uuid + "_working_courses\" (id text)");
						// Add _folders table
						client.query("CREATE TABLE \"" + uuid + "_folders\" (id text, name varchar(160))");
						client.query("CREATE TRIGGER trigger_users_genid BEFORE INSERT ON \"" + uuid + "_folders\" FOR EACH ROW EXECUTE PROCEDURE unique_short_id()");
						done();
						callback(null, uuid);
					});
				});	
			}
		});
	});
};

/******************************************************************************
Creation Queries
*******************************************************************************/

// Allows a professor to create a course
Database.createCourse = function(name, prof, desc, keys, profname, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let cn = name.replace(' ', '');

		client.query("INSERT INTO courses (name, prof, description, keywords, subscribers, profname) VALUES ('" + name + "', '" + prof + "', '" + desc + "', '" + keys + "', " + 0 + ", '" + profname + "') RETURNING id", function(err, result) {
			if (err) callback(err);

			client.query("CREATE TABLE \"" + result.rows[0].id + "_chapters\" (id text, url varchar(2083))");

			client.query("INSERT INTO \"" + prof + "_working_courses\" VALUES ('" + result.rows[0].id + "')");
			done();
			callback(null, "success");
		});
	});
}

// Add a course to a student's library
Database.addCourse = function(student, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		client.query("INSERT INTO \"" + student + "_courses\" VALUES ('" + course + "')");

		// Create a new table that holds all the student's notes for the course
		client.query("CREATE TABLE \"" + student + course + "_notes\" (id text, url varchar(2083))");

		client.query("UPDATE courses SET subscribers = subscribers + 1 WHERE id = '" + course + "'");

		done();
		callback(null, "success");
	});
};

// Add a new folder to a student's library
Database.addFolder = function(student, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		client.query("INSERT INTO \"" + student + "_folders\"(name) VALUES ('" + folderName + "') RETURNING id", function(err, result) {
			// Create a new table that holds all the chapters in this folder
			client.query("CREATE TABLE \"" + student + result.rows[0].id + "_chapters\" (id text, url varchar(2083))", function() {
				done();
				callback(null, "success");
			});
		});
	});
};

// Allows a professor to add a chapter to a course
Database.addChapterToCourse = function(chapter, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let s = "INSERT INTO \"" + course + "_chapters\" VALUES ('" + chapter + "', null)";
		client.query(s);
		done();
		callback(null, 200);
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
Database.createChapter = function(prof, chapterName, contributors, checkout_dur, pdf_url, profname, keywords, description, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		//Retreive pdf and src urls from git module
		let s = "INSERT INTO chapters(name, owner, contributors, pdf_url, checkout_dur, ownername, keywords, description) VALUES ('" + chapterName + "', '" + prof + "', '" + contributors + "', '" + pdf_url + "', " + checkout_dur + ", '" + profname + "', '" + keywords + "', '" + description + "')";
		client.query(s);
		done();
		callback(null, 200);
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
Database.getCourses = function(student, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM \"" + student + "_courses\"");
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
Database.getCourseChapters = function(course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let courseTable = course + "_chapters";
		let query = client.query("SELECT chapters.id, chapters.name, owner, contributors, pdf_url, checkout_user, checkout_exp, checkout_dur FROM chapters INNER JOIN \"" + courseTable + "\" on chapters.id = \"" + courseTable + "\".id");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			client.query("SELECT name FROM courses WHERE courses.id = \'" + course + "\'").on('end', function(r) {
				let name = r.rows[0].name;
				done();
				callback(null, result.rows, name);
			});
		});
	});
};

// Retreive a Student's course notes
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
Database.getFolders = function(student, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM \"" + student + "_folders\"");
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
Database.getFolderChapters = function(student, folder, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let folderTable = student + folder;
		let s = "SELECT chapters.id, chapters.name, owner, contributors, pdf_url, checkout_user, checkout_exp, checkout_dur FROM chapters INNER JOIN \"" + folderTable + "_chapters\" on chapters.id = \"" + folderTable + "_chapters\".id";
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

		let query = client.query("SELECT * FROM chapters WHERE name ILIKE '%" + searchQuery + "%' OR description ILIKE '%" + searchQuery + "%'");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			callback(null, JSON.stringify(result.rows, null, "    "));
		});
	});
};

// Search a user's query and return the results
Database.searchCourses = function(searchQuery, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM courses WHERE name ILIKE '%" + searchQuery + "%' OR description ILIKE '%" + searchQuery + "%' OR profname ILIKE '%" + searchQuery + "%'");
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
Database.deleteStudent = function(student, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		// Remove from users table
		client.query("DELETE FROM users WHERE id = '" + student + "'");

		// Remove all course-related data
		let userCourses = student + "_courses";

		// Scrub all of the course notes
		client.query("SELECT * FROM \"" + userCourses + "\"").on('row', function(row, result) {
			if (row != null) {
				client.query("DROP TABLE \"" + student + row.id + "_notes\"");
			}
		});
		client.query("DROP TABLE \"" + userCourses + "\"");

		// Remove all folder-related data
		let userFolders = student + "_folders";

		// Scrub all folders
		let query2 = client.query("SELECT id FROM \"" + userFolders + "\"");
		query2.on('row', function(row, result) {
			if (row != null) {
				client.query("DROP TABLE \"" + student + row.id + "_chapters\"");
			}
		});
		client.query("DROP TABLE \"" + userFolders + "\"");

		callback(null, "success");
	});
};

// Remove course from a student's library
Database.removeCourse = function(student, course, callback) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) callback(err);

		client.query("DROP TABLE \"" + student + course + "_notes\"");
		client.query("DELETE FROM \"" + student + "_courses\" WHERE id = '" + course + "'");
		client.query("UPDATE courses SET subscribers = subscribers - 1 WHERE id = '" + course + "'");
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
