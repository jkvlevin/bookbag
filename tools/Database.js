/******************************************************************************
Module to Manage Database Connection & Queries
*******************************************************************************/

let pg = require('pg');
let Database = [];
const DATABASE_URL = 'postgres://xtlscmgxzqrpjq:su76vkQ798qEeiMi1MxsclLq_2@ec2-184-73-196-82.compute-1.amazonaws.com:5432/d3qu3p1gh95p7l';
var Hash = require('./auth/Hash.js');
var ptonVerify = require('./auth/ptonVerify.js');

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

		let query = client.query("SELECT * FROM users WHERE email = '" + email + "'").on('end', function(result) {
			if (result.rowCount == 0) callback("user does not exist");
			else {
				let uuid = result.rows[0]["id"];
				let firstname = result.rows[0]["firstname"];
				let lastname = result.rows[0]["lastname"];
				let prof = result.rows[0]["prof"];
				done();
				Hash.validatePassword(password, result.rows[0].password, function(e, res) {
					if (e) callback(e);
					if (res) callback(null, {id : uuid, firstname : firstname, lastname: lastname, prof : prof});
					else callback("password or username does not match");
				});
			}
		})
	});
};

// Add a new student
Database.addStudent = function(email, firstname, lastname, password, callback) {
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

					client.query("INSERT INTO users (email, firstname, lastname, password, prof) VALUES ('" + email + "' , '" + firstname + "' , '" + lastname + "', '" + hash + "', FALSE)");

					client.query("SELECT * FROM users WHERE email = '" + email + "'").on('end', function(result) {
						let uuid = result.rows[0]["id"];
						// Add _courses table
						client.query("CREATE TABLE \"" + uuid + "_courses\" (id text UNIQUE)");
						// Add _folders table
						client.query("CREATE TABLE \"" + uuid + "_folders\" (id text UNIQUE, name varchar(160))");
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
Database.addProf = function(email, firstname, lastname, password, callback) {
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
					if (e) callback(e);

					client.query("INSERT INTO users (email, firstname, lastname, password, prof) VALUES ('" + email + "' , '" + firstname + "' , '" + lastname + "', '" + hash + "', TRUE)");

					client.query("SELECT * FROM users WHERE email = '" + email + "'").on('end', function(result) {
						let uuid = result.rows[0]["id"];
						// Add _working_courses table
						client.query("CREATE TABLE \"" + uuid + "_working_courses\" (id text UNIQUE)");
						// Add _working_chapters table
						client.query("CREATE TABLE \"" + uuid + "_working_chapters\" (id text UNIQUE)");
						// Add _folders table
						client.query("CREATE TABLE \"" + uuid + "_folders\" (id text UNIQUE, name varchar(160))");
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

		client.query("INSERT INTO courses (name, prof, description, keywords, subscribers, profname, public) VALUES ('" + name + "', '" + prof + "', '" + desc + "', '" + keys + "', " + 0 + ", '" + profname + "', FALSE) RETURNING id", function(err, result) {
			if (err) callback(err);
			client.query("CREATE TABLE \"" + result.rows[0].id + "_chapters\" (id text UNIQUE, url varchar(2083))", function(er, re) {
				client.query("INSERT INTO \"" + prof + "_working_courses\" VALUES ('" + result.rows[0].id + "')", function(e, r) {
					done();
					callback(null, 200);
				});
			});
		});
	});
}

// Add a course to a student's library
Database.addCourse = function(student, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		client.query("INSERT INTO \"" + student + "_courses\" VALUES ('" + course + "') ON CONFLICT (id) DO NOTHING");

		// Create a new table that holds all the student's notes for the course
		client.query("CREATE TABLE \"" + student + course + "_notes\" (id text UNIQUE, url varchar(2083))");

		client.query("UPDATE courses SET subscribers = subscribers + 1 WHERE id = '" + course + "'");

		done();
		callback(null, 200);
	});
};

// Add a new folder to a student's library
Database.addFolder = function(student, folderName, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		// Insert the course into the student's courselist
		client.query("INSERT INTO \"" + student + "_folders\"(name) VALUES ('" + folderName + "') RETURNING id").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			// Create a new table that holds all the chapters in this folder
			client.query("CREATE TABLE \"" + student + result.rows[0].id + "_chapters\" (id text UNIQUE, url varchar(2083))", function(result) {
				done();
				callback(null, 200);
			});
		});
	});
};

// Allows a professor to add a chapter to a course
Database.addChapterToCourse = function(chapter, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("INSERT INTO \"" + course + "_chapters\" VALUES ('" + chapter + "', null) ON CONFLICT (id) DO NOTHING", function() {
			done();
			callback(null, 200);
		});
	});
};

Database.changeCourseInfo= function(course, name, description, keywords, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("UPDATE courses SET name = '" + name + "', keywords = '{" + keywords + "}', description = '" + description + "'  WHERE id = '" + course + "'", function() {
				done();
				callback(null, 200);
		});
	});
};

// Allows a student to add a chapter to course notes
// Database.addChapterToCourseNotes = function(student, prof, chapterName, chapterAuthor, courseName, callback) {
// 	pg.connect(DATABASE_URL, function(err, client, done) {
// 		let cn = courseName.replace(' ', '');
// 		if (err) callback(err);
// 		let s = "INSERT INTO " + sanitizeEmail(student) + cn + sanitizeEmail(prof) + "_notes VALUES ('" + chapterName + "', '" + chapterAuthor + "', null)";
// 		client.query(s);
// 		done();
// 		callback(null, 202);
// 	});
// };

// Allows a student to add a chapter to a folder
Database.addChapterToFolder = function(student, folder, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("INSERT INTO \"" + student + folder + "_chapters\" VALUES ('" + chapter + "', null) ON CONFLICT (id) DO NOTHING", function(result) {
			done();
			callback(null, 200);
		});
	});
};

// Create a Chapter for a prof
Database.createChapter = function(prof, chapterName, contributors, checkout_dur, pdf_url, profname, keywords, description, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		//Retreive pdf and src urls from git module
		client.query("INSERT INTO chapters(name, owner, contributors, pdf_url, checkout_dur, ownername, keywords, description, public) VALUES ('" + chapterName + "', '" + prof + "', '{}', '" + pdf_url + "', " + checkout_dur + ", '" + profname + "', '{" + keywords + "}', '" + description + "', FALSE) RETURNING id").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			client.query("INSERT INTO \"" + prof + "_working_chapters\" VALUES ('" + result.rows[0].id + "')");
			done();
			callback(null, result.rows[0].id);
		});
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

// Add a contributor to a chapter
Database.addContributorToChapter = function(contributor, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("UPDATE chapters SET contributors = array_append(contributors, '" + contributor + "') WHERE id = '" + chapter + "' AND NOT contributors::text[] @> ARRAY['" + contributor + "']");
		client.query("INSERT INTO \"" + contributor + "_working_chapters\" (id) VALUES ('" + chapter + "') ON CONFLICT (id) DO NOTHING");
		done();
		callback(null, 200);
	});
}

// Remove a contributor from a chapter
Database.removeContributorFromChapter = function(contributor, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("UPDATE chapters SET contributors = array_remove(contributors, '" + contributor + "') WHERE id = '" + chapter + "'");
		client.query("INSERT INTO \"" + contributor + "_working_chapters\" (id) VALUES ('" + chapter + "') ON CONFLICT (id) DO NOTHING");
		done();
		callback(null, 200);
	});
}

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
		let query = client.query("SELECT * FROM chapters INNER JOIN \"" + courseTable + "\" on chapters.id = \"" + courseTable + "\".id");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			client.query("SELECT name, description FROM courses WHERE courses.id = \'" + course + "\'").on('end', function(r) {
				done();
				callback(null, result.rows, r.rows[0].name, r.rows[0].description);
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
		let s = "SELECT * FROM chapters INNER JOIN \"" + folderTable + "_chapters\" on chapters.id = \"" + folderTable + "_chapters\".id";
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

// Get a user's name by their ID
Database.getUserNameById = function(user, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT firstname, lastname FROM users WHERE id = '" + user + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			callback(null, result.rows[0]);
		});
	});
}

// Get a chapter by ID
Database.getChapterById = function(chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT * FROM chapters WHERE id = '" + chapter + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			callback(null, result.rows[0]);
		});
	});
};

// Get a chapter's name by ID
Database.getChapterNameById = function(chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT name FROM chapters WHERE id = '" + chapter + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			callback(null, result.rows[0]);
		});
	});
};

// Get a folder's name by ID
Database.getFolderNameById = function(student, folder, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT name FROM \"" + student + "_folders\" +  WHERE id = '" + folder + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			callback(null, result.rows[0]);
		});
	});
};

// Get a course's name by ID
Database.getCourseNameById = function(course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT name FROM courses +  WHERE id = '" + course + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			callback(null, result.rows[0]);
		});
	});
};

Database.isCheckedOutByUser = function(user, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT * FROM users INNER JOIN chapters ON users.id = '" + user + "' AND chapters.id = '" + chapter + "' AND users.id = chapters.checkout_user").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			if (result.rowCount > 0) {
				done();
				callback(null, 200);
			}
			else {
				done();
				callback(null, 202);
			}
		});
	});
}

Database.isOwner = function(user, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT * FROM users INNER JOIN chapters ON users.id = '" + user + "' AND chapters.id = '" + chapter + "' AND users.id = chapters.owner").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			done();
			if (result.rowCount > 0) {
				done();
				callback(null, 200);
			}
			else {
				done();
				callback(null, 202);
			}
		});
	});
}

// Get all of a user's courses and return them
Database.getWorkingChapters = function(prof, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM \"" + prof + "_working_chapters\"");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

// Get all of the chapters in a give prof's library
Database.getWorkingChapterData = function(chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let s = "SELECT * FROM chapters WHERE id = '" + chapter + "'";
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


// Get all of a prof's courses and return them
Database.getWorkingCourses = function(prof, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM \"" + prof + "_working_courses\"");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

// Get metadata on a course
Database.getCourseData = function(course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		let s = "SELECT * FROM courses WHERE id = '" + course + "'";
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

Database.getCourseChapterCount = function(course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);
		client.query("SELECT COUNT(*) FROM \"" + course + "_chapters\"").on('end', function(result) {
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
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM chapters WHERE (name ILIKE '%" + searchQuery + "%' OR description ILIKE '%" + searchQuery + "%' OR ownername ILIKE '%" + searchQuery + "%' OR keywords::text[] @> ARRAY['" + searchQuery + "']) AND public = TRUE");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

// Search a user's query and return the results
Database.searchCourses = function(searchQuery, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		let query = client.query("SELECT * FROM courses WHERE (name ILIKE '%" + searchQuery + "%' OR description ILIKE '%" + searchQuery + "%' OR profname ILIKE '%" + searchQuery + "%' OR keywords::text[] @> ARRAY['" + searchQuery + "']) AND public = TRUE");
		query.on('row', function(row, result) {
			result.addRow(row);
		});
		query.on('end', function(result) {
			done();
			callback(null, result.rows);
		});
	});
};

Database.searchProfs = function(searchQuery, user, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("SELECT * FROM users WHERE prof = TRUE AND firstname || ' ' || lastname ILIKE '%" + searchQuery + "%' AND id != '" + user + "'").on('row', function (row, result) {
			result.addRow(row);
		}).on('end', function (result) {
			done();
			callback(null, result.rows);
		})
	})
}

/******************************************************************************
Checkout/in Queries
*******************************************************************************/

// Make a course public
Database.makeCoursePublic = function(course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		client.query("UPDATE courses SET public = TRUE WHERE id = '" + course + "'", function(err, result) {
			if (err) callback (err);
			done();
			callback(null, 200);
		});
	});
};

// Make a chapter public
Database.makeChapterPublic = function(chapter, pdf_url, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		client.query("UPDATE chapters SET public = TRUE WHERE id = '" + chapter + "'", function(err, result) {
			if (err) callback (err);
			client.query("UPDATE chapters SET pdf_url = '" + pdf_url + "' WHERE id = '" + chapter + "'", function(e, r) {
				done();
				callback(null, 200);
			});
		});
	});
};

// See if the user can upload
Database.prepUpload = function(chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		client.query("SELECT checkout_exp FROM chapters WHERE id = '" + chapter + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			let d1 = new Date(result.rows[0].checkout_exp);
			let d2 = new Date();
			client.query("UPDATE chapters SET checkout_exp = NULL, checkout_user = NULL WHERE id = '" + chapter + "'");
			if (d2 > d1) {
				// past checkout
				done();
				callback(null, "Chapter is past checkout date");
			} else {
				// time to check out
				done();
				callback(null, 200);
			}
		})
	});
}

// Attempt to check out chapter
Database.attemptCheckout = function(prof, chapter, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("SELECT checkout_user FROM chapters WHERE id = '" + chapter + "'").on('row', function(row, result) {
			result.addRow(row);
		}).on('end', function(result) {
			if (result.rows[0].checkout_user == null) {
				client.query("UPDATE chapters SET checkout_user = '" + prof + "' WHERE id = '" + chapter + "'");
				client.query("SELECT checkout_dur FROM chapters WHERE id = '" + chapter + "'", function(err, result) {
					let dur = result.rows[0].checkout_dur;
					client.query("UPDATE chapters SET checkout_exp = NOW() + INTERVAL '" + dur + " hour' WHERE id = '" + chapter + "'");
					done();
					callback(null, 200);
				})
			} else {
				done();
				callback(null, result.rows[0]);
			}
		});
	});
};

/******************************************************************************
Deletion Queries
*******************************************************************************/

// Delete a student
Database.deleteStudent = function(student, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
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

		done();
		callback(null, 200);
	});
};

// Remove course from a student's library
Database.removeCourse = function(student, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("DROP TABLE \"" + student + course + "_notes\"");
		client.query("DELETE FROM \"" + student + "_courses\" WHERE id = '" + course + "'");
		client.query("UPDATE courses SET subscribers = subscribers - 1 WHERE id = '" + course + "'");
		done();
		callback(null, 200);
	});
};

// Remove folder from a student's library
Database.removeCourse = function(student, folder, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("DROP TABLE \"" + student + folder + "_chapters\"");
		client.query("DELETE FROM \"" + student + "_folders\" WHERE id = '" + folder + "'");
		done();
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

Database.removeChapterFromCourse = function(chapter, course, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("DELETE FROM \"" + course + "_chapters\" WHERE id = '" + chapter + "'", function(err, result) {
			if (err) callback(err);
			done();
			callback(null, 200);
		});
	});
};

Database.removeChapterFromFolder = function(student, chapter, folder, callback) {
	pg.connect(DATABASE_URL, function(err, client, done) {
		if (err) callback(err);

		client.query("DELETE FROM \"" + student + folder + "_chapters\" WHERE id = '" + chapter + "'", function(err, result) {
			if (err) callback(err);
			done();
			callback(null, 200);
		});
	});
};

/******************************************************************************
Helper Functions
*******************************************************************************/

function sanitizeEmail(email) {
	return email.replace('@', '').replace('.', '');
}

module.exports = Database;
