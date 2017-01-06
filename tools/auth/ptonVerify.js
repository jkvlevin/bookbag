
var http = require('http');
var htmlparser = require("htmlparser2");



var ptonVerify = [];

ptonVerify.verifyProf = function(firstName, lastName, callback) {

	var name = lastName + ', ' + firstName;

	// Check if professor
	var URL = 'http://search.princeton.edu/search?ff=c&f=' + firstName + '&af=c&a=&lf=c&l=' + lastName + '&pf=c&p=&tf=c&t=professor&faf=c&fa=&df=c&d=&ef=c&e=&submit=submit'

	http.get(URL, (res) => {
		const statusCode = res.statusCode;
		const contentType = res.headers['content-type'];

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

			if (!body.includes("Results 0") && body.includes(name)) {
				callback(null, true);
				return;
			}

			else {

				// Check if lecturer
				URL = 'http://search.princeton.edu/search?ff=c&f=' + firstName + '&af=c&a=&lf=c&l=' + lastName + '&pf=c&p=&tf=c&t=lecture&faf=c&fa=&df=c&d=&ef=c&e=&submit=submit'

				http.get(URL, (res) => {
					const statusCode = res.statusCode;
					const contentType = res.headers['content-type'];

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

						if (!body.includes("Results 0") && body.includes(name)) {
							callback(null, true);
							return;
						}

						else {

							// Check if researcher

							URL = 'http://search.princeton.edu/search?ff=c&f=' + firstName + '&af=c&a=&lf=c&l=' + lastName + '&pf=c&p=&tf=c&t=research&faf=c&fa=&df=c&d=&ef=c&e=&submit=submit'

							http.get(URL, (res) => {
								const statusCode = res.statusCode;
								const contentType = res.headers['content-type'];

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

									if (!body.includes("Results 0") && body.includes(name)) {
										callback(null, true);
										return;
									}
								});

							}).on('error', (e) => {
								callback(e.message);
							});
						}
					});

				}).on('error', (e) => {
					callback(e.message);
				});

			}
		});

	}).on('error', (e) => {
		callback(e.message);
	});





}

module.exports = ptonVerify;



