
var http = require('http');

var ptonVerify = [];

ptonVerify.verifyProf = function(firstName, lastName, email, callback) {

	// Check if professor
	var keyword = 'professor';
	makeRequest(firstName, lastName, keyword, email, function(e, d) {

		if (d) {
			console.log(keyword);
			callback(null, true);
			return;
		}
		else if (e === "cannot verify " + keyword) {

			// Check if lecturer
			keyword = 'lecture';
			makeRequest(firstName, lastName, keyword, email, function(e, d) {
				if (d) {
					console.log(keyword);
					callback(null, true);
					return;
				}
				else if (e === "cannot verify " + keyword) {

					// Check if lecturer
					keyword = 'research';
					makeRequest(firstName, lastName, keyword, email, function(e, d) {
						if (e) callback("cannot verify professor");
						else {
							console.log(keyword);
							callback(null, true);
						}

					});
				}
				else callback(e);
			});
		}
		else callback(e);
	});
}

var makeRequest = function(firstName, lastName, keyword, email, callback) {

	var name = lastName + ', ' + firstName;
	var URL = 'http://search.princeton.edu/search?ff=c&f=' + firstName + '&af=c&a=&lf=c&l=' + lastName + '&pf=c&p=&tf=c&t=' + keyword + '&faf=c&fa=&df=c&d=&ef=c&e=&submit=submit'

	http.get(URL, (res) => {
		var statusCode = res.statusCode;

		let error;
		if (statusCode !== 200) {
	  		error = new Error(`Request Failed.\n` +
	                      	  `Status Code: ${statusCode}`);
	 	} 

		if (error) {
		    callback(error.message);
		    // consume response data to free up memory
		    res.resume();
		    return;
		}

		let body = '';
		res.on('data', (chunk) => body += chunk);
		res.on('end', () => {
			body = body.toLowerCase();
			if (!body.includes("Results 0") && body.includes(name.toLowerCase()) && body.includes(email.toLowerCase())) {

				callback(null, true);
				return;
			}

			// If not a professor, check if lecturer
			else {
				callback("cannot verify " + keyword);
			}
		});

	}).on('error', (e) => {
		callback(e.message);
	});
}

module.exports = ptonVerify;
