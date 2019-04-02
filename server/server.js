var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var JWTAuth = require('./JWTAuth');
var saltRounds = 10;

var engines = require('consolidate');
var paypal = require('paypal-rest-sdk');
var config = require('./config');
var paypalApiKey = require('../paypal_api_key');
var ip = require('../ipstore');

const nodemailer = require('nodemailer');
const nodemailerOauth2Key = require('../nodemailer_oauth2_key');

app.engine('ejs', engines.ejs);
app.set('views', '../views');
app.set('view engine', 'ejs');

const validatorOptions = {
	customValidators: {
		greaterThan: (input, minValue) => {
			return input <= minValue;
		}
	}
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(expressValidator(validatorOptions));

if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let driverSocket = null;
let passengerSocket = null;

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('trackVehicle', (x) => {
		passengerSocket = socket;
		console.log('Passenger tracking vehicle');
	});

	socket.on('driverLocation', (driverLocation) => {
		passengerSocket.emit('driverLocation', driverLocation);
	});

	socket.on('connectDriver', () => {
		console.log('Driver has connected');
		driverSocket = socket;
	});
});

// Change to your credentials
// Use Database provided in folders or ask in Teams
var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'transport',
	password: ''
});

connection.connect((error) => {
	if (error) throw error;
	else console.log('Connected to MySQL Database');
});

paypal.configure({
	mode: 'sandbox', //sandbox or live
	client_id: paypalApiKey.client_id,
	client_secret: paypalApiKey.client_secret
});

app.all('*', (req, res, next) => {
	let JWTConfirmed = false;
	config.excludedRoutes.map((route) => {
		if (route === req.path) JWTConfirmed = true;
	});

	if (JWTConfirmed) return next();
	return JWTAuth.verifyJWTRESTRequest(req, res, next);
});

app.get('/journey', (req, res) => {
	const journeyId = req.query.journeyId;

	connection.query(
		'SELECT * FROM coordinate WHERE fk_journey_id = ? AND removed = 0',
		[ journeyId ],
		(error, rows, fields) => {
			if (error) throw error;

			connection.query('SELECT * FROM journey WHERE journey_id = ?', [ journeyId ], (error, row, fields) => {
				if (error) throw error;

				res.send({ results: rows, start_time: row[0].start_time, end_time: row[0].end_time });
			});
		}
	);
});

app.post('/register', (req, res) => {
	//Check for errors in user input
	req.checkBody('firstName', 'First name cannot be empty').notEmpty().trim();
	req.checkBody('lastName', 'Last name cannot be empty').notEmpty().trim();
	req.checkBody('phoneNumber', 'Phone number must be valid').len(5, 15).isNumeric();
	req.checkBody('email', 'Email address must be valid').isEmail().trim();
	req
		.checkBody('password', 'Password must include 8 characters, 1 upper case and 1 lower case')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
		.trim();
	req.checkBody('passwordConfirm', 'Passwords must match').equals(req.body.password);

	//Send errors back to client
	const errors = req.validationErrors();
	if (errors) {
		return res.send({ status: 0, errors: errors });
	}

	//Get form fields
	const email = req.body.email;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const phoneNumber = req.body.phoneNumber;
	const type = req.body.type;

	//Check if user exists
	connection.query('SELECT * FROM user WHERE email = ?', [ email ], (error, rows, fields) => {
		//if user exists, return and throw error
		if (error) throw error;
		if (rows.length >= 1) return res.send({ status: 1 });
		else {
			//If user doesnt exist insert new user
			bcrypt.hash(password, saltRounds, (error, hash) => {
				connection.query(
					'INSERT INTO user (email, password, forename, surname, phone_number, date_created, fk_user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
					[ email, hash, firstName, lastName, phoneNumber, new Date(), type ],
					(error, rows, fields) => {
						if (error) throw error;
						return res.send({ status: 10 });
					}
				);
			});
		}
	});
});

app.post('/login', (req, res) => {
	req.checkBody('email', null).notEmpty().trim();
	req.checkBody('password', null).notEmpty().trim();

	const errors = req.validationErrors();
	if (errors) {
		return res.send({ status: 0 });
	}

	connection.query('SELECT * FROM user WHERE email = ? LIMIT 1', [ req.body.email ], (error, rows, fields) => {
		if (error) throw error;
		if (rows.length < 1) return res.send({ status: 0 });

		bcrypt.compare(req.body.password, rows[0].password, (error, success) => {
			if (error) throw error;
			if (!success) return res.send({ status: 0 });
			else {
				var token = JWTAuth.createJWTToken(rows[0].user_id);
				localStorage.setItem('userId', rows[0].user_id);
				return res.send({ content: rows[0], status: 10, token: token });
			}
		});
	});
});

app.post('/booking/sendEmail', (req, res) => {
	//Get form fields
	const data = req.body.data;
	const date = req.body.date;
	const time = req.body.time;
	const email = req.body.email;
	const returnTicket = req.body.returnTicket;

	const output = `
		<h1> Your confirmed booking</h1>
		<p> Thank you for your recent booking with us. Here is a reminder of your journey details:</p>
		<ul>
			<li>Date: ${date}</li>
			<li>Time: ${time}</li>
			<li>Ticket type: ${returnTicket === 1 ? 'RETURN' : 'SINGLE'}</li>
			<li>From: ${data.startLocation}</li>
			<li>To: ${data.endLocation}</li>
			<li>Number of passengers: ${data.passenger}</li>
			<li>Number of wheelchairs: ${data.wheelchair}</li>
		</ul>
	`;

	('use strict');

	// Referenced from https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
	async function main() {
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				type: 'OAuth2',
				user: 'tfwirt.test@gmail.com',
				clientId: nodemailerOauth2Key.clientId,
				clientSecret: nodemailerOauth2Key.clientSecret,
				refreshToken: nodemailerOauth2Key.refreshToken
			}
		});

		// setup email data
		let mailOptions = {
			from: '"TfW Booking" <tfwirt.test@gmail.com>', // sender address
			to: email, // receiver address
			subject: 'Your booking details', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};

		// send mail with defined transport object
		let info = await transporter.sendMail(mailOptions);

		console.log('Message sent: %s', info.messageId);
	}

	main().catch(console.error);
});

app.get('/driver/schedule', function(req, res) {
	const journeyId = req.query.id;
	connection.query(
		`SELECT DISTINCT c.street, c.city, c.fk_coordinate_type_id, c.longitude, c.latitude, j.start_time, j.end_time, t.no_of_passengers, t.no_of_wheelchairs FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE c.fk_journey_id = ? AND c.removed = 0 ORDER BY (CASE fk_coordinate_type_id WHEN 1 THEN 1 WHEN 3 THEN 2 WHEN 2 THEN 3 END) ASC`,
		[ journeyId ],
		(error, rows, fields) => {
			if (error) console.log(error);
			else {
				res.send(rows);
			}
		}
	);
});

app.get('/ticket/pickup', function(req, res) {
	const { id } = req.query;
	connection.query(
		'SELECT c.latitude, c.longitude, c.street, t.no_of_passengers FROM coordinate c JOIN ticket t ON t.fk_coordinate_id = c.coordinate_id WHERE t.ticket_id = ?',
		[ id ],
		(error, rows, fields) => {
			if (error) console.log(error);
			else {
				res.send(rows[0]);
			}
		}
	);
});

app.get('/user/cancelTicket/journey', function(req, res) {
	const { ticketId } = req.query;
	connection.query(
		`SELECT DISTINCT j.end_time FROM ticket t JOIN user_journey uj ON t.ticket_id = uj.fk_ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON c.fk_journey_id = j.journey_id WHERE t.ticket_id = ? LIMIT 1`,
		[ ticketId ],
		(error, rows, fields) => {
			if (error) console.log(error);
			else {
				res.send(rows[0].end_time);
			}
		}
	);
});

app.get('/journey', function(req, res) {
	connection.query(
		`SELECT c.street, c.city, c.fk_coordinate_type_id, t.date_of_journey, t.time_of_journey, t.no_of_passengers, t.no_of_wheelchairs
		FROM ticket t
		JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id 
		JOIN journey j ON uj.fk_journey_id = j.journey_id 
		JOIN coordinate c ON j.journey_id = c.fk_journey_id
		ORDER BY j.journey_id DESC LIMIT 2`,
		function(error, rows, fields) {
			if (error) console.log(error);
			else {
				res.send(rows);
			}
		}
	);
});

app.post('/booking/book', (req, res) => {
	const {
		place_id,
		street,
		city,
		country,
		lat,
		lng,
		startType,
		date,
		time,
		numPassenger,
		numWheelchair
	} = req.body.jData;
	const { jId } = req.body;

	connection.beginTransaction((err) => {
		if (err) throw error;

		connection.query(
			'SELECT * FROM coordinate WHERE fk_journey_id = ? AND place_id = ?',
			[ jId, place_id ],
			(error, row, fields) => {
				if (error) {
					return connection.rollback(function() {
						throw error;
					});
				}

				new Promise((resolve, reject) => {
					if (row.length >= 1) {
						if (row[0].removed === 1) {
							connection.query(
								'UPDATE coordinate SET removed = 0 WHERE coordinate_id = ?',
								[ row[0].coordinate_id ],
								(error, row1, fields) => {
									if (error) {
										return connection.rollback(function() {
											throw error;
										});
									}
									return resolve(row[0].coordinate_id);
								}
							);
						} else return resolve(row[0].coordinate_id);
					} else {
						connection.query(
							'INSERT INTO coordinate (place_id, street, city, country, latitude, longitude, fk_coordinate_type_id, fk_journey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
							[ place_id, street, city, country, lat, lng, startType, jId ],
							(error, row1, fields) => {
								if (error) {
									return connection.rollback(function() {
										throw error;
									});
								}
								return resolve(row1.insertId);
							}
						);
					}
				})
					.then((id) => {
						connection.query(
							'INSERT INTO ticket (no_of_passengers, no_of_wheelchairs, used, expired, date_of_journey, time_of_journey, date_created, fk_coordinate_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
							[ numPassenger, numWheelchair, 0, 0, date, time, new Date(), id ],
							(error, row2, fields) => {
								if (error) {
									return connection.rollback(function() {
										throw error;
									});
								}

								connection.query(
									'INSERT INTO user_journey (fk_journey_id, fk_user_id, fk_ticket_id, paid) VALUES (?, ?, ?, ?)',
									[ jId, req.userId, row2.insertId, 1 ],
									(error, row3, fields) => {
										if (error) {
											return connection.rollback(function() {
												throw error;
											});
										}

										connection.commit((err) => {
											if (err) {
												return connection.rollback(() => {
													throw err;
												});
											}
										});
									}
								);
							}
						);
					})
					.catch((error) => {
						throw error;
					});
			}
		);
	});
});

app.get('/paypal-button', (req, res) => {
	res.render('index');
});

app.get('/paypal', (req, res) => {
	localStorage.setItem('paypalAmount', parseFloat(req.query.amount).toFixed(2));
	var create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal'
		},
		redirect_urls: {
			return_url: `http://${ip}:3000/success`,
			cancel_url: `http://${ip}:3000/cancel`
		},
		transactions: [
			{
				item_list: {
					items: [
						{
							name: 'item',
							sku: 'item',
							price: req.query.amount,
							currency: 'GBP',
							quantity: 1
						}
					]
				},
				amount: {
					currency: 'GBP',
					total: req.query.amount
				},
				description: 'Add funds to Transport for Wales wallet'
			}
		]
	};

	paypal.payment.create(create_payment_json, function(error, payment) {
		if (error) throw error;
		else {
			res.redirect(payment.links[1].href);
		}
	});
});

app.get('/user/amount', (req, res) => [
	connection.query('SELECT funds FROM user WHERE user_id = ?', [ req.userId ], (error, rows, fields) => {
		if (error) throw error;
		else {
			res.send(rows[0]);
		}
	})
]);

app.get('/user/transactions', (req, res) => [
	connection.query(
		'SELECT t.*, tt.type FROM transaction t JOIN transaction_type tt ON tt.transaction_type_id = t.fk_transaction_type_id WHERE fk_user_id = ? ORDER BY date DESC',
		[ req.userId ],
		(error, rows, fields) => {
			if (error) throw error;
			else {
				res.send(rows);
			}
		}
	)
]);

app.get('/driver/journeys', (req, res) => {
	connection.query(
		`SELECT j.*, c.* FROM journey j JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE c.fk_coordinate_type_id = 1 OR c.fk_coordinate_type_id = 2 AND c.removed = 0`,
		function(error, rows, fields) {
			if (error) throw error;
			else {
				res.send(rows);
			}
		}
	);
});

app.get('/driver/stops', function(req, res) {
	const journeyId = req.query.id;
	connection.query(
		`SELECT DISTINCT c.street, c.city, c.fk_coordinate_type_id, j.start_time, j.end_time, t.no_of_passengers, t.no_of_wheelchairs FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE c.fk_journey_id = ? AND c.removed = 0 ORDER BY (CASE fk_coordinate_type_id WHEN 1 THEN 1 WHEN 3 THEN 2 WHEN 2 THEN 3 END) ASC`,
		[ journeyId ],
		(error, rows, fields) => {
			if (error) throw error;
			else {
				res.send(rows);
			}
		}
	);
});

app.get('/success', (req, res) => {
	var PayerID = req.query.PayerID;
	var paymentId = req.query.paymentId;
	var execute_payment_json = {
		payer_id: PayerID,
		transactions: [
			{
				amount: {
					currency: 'GBP',
					total: parseFloat(localStorage.getItem('paypalAmount')).toFixed(2)
				}
			}
		]
	};

	paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
		if (error) {
			throw error;
		} else {
			var userId = parseInt(localStorage.getItem('userId'));
			var paypalAmount = parseFloat(localStorage.getItem('paypalAmount')).toFixed(2);

			connection.query(
				'UPDATE user SET funds = funds + ? WHERE user_id = ?',
				[ paypalAmount, userId ],
				(error, row, fields) => {
					if (error) throw error;
				}
			);

			connection.query(
				'INSERT INTO transaction (current_funds, spent_funds, date, fk_transaction_type_id, fk_user_id) SELECT user.funds, ?, ?, ?, ? from user WHERE user_id = ?',
				[ paypalAmount, new Date(), 2, userId, userId ],
				(error, row, fields) => {
					if (error) throw error;
				}
			);
			res.render('success');
		}
	});
});

app.post('/user/addTransaction', (req, res) => {
	const current_funds = req.body.current_funds;
	const spent_funds = req.body.spent_funds;
	const fk_transaction_type_id = req.body.fk_transaction_type_id;

	connection.query(
		'INSERT INTO transaction (current_funds, spent_funds, date, fk_transaction_type_id, fk_user_id) VALUES(?, ?, ?, ?, ?)',
		[ current_funds, spent_funds, new Date(), fk_transaction_type_id, req.userId ],
		(error, row, fields) => {
			if (error) throw error;
			connection.query(
				'UPDATE user SET funds = funds - ? WHERE user_id = ?',
				[ spent_funds, req.userId ],
				(error, row, fields) => {
					if (error) throw error;
					else {
						res.send({ status: 10 });
					}
				}
			);
		}
	);
});

app.post('/user/cancelTicket', (req, res) => {
	const { ticketId, amount, cancellationFeeApplied } = req.body;

	connection.beginTransaction((err) => {
		if (err) throw error;

		connection.query(
			'SELECT COUNT(*) AS count FROM ticket WHERE cancelled = 0 AND expired = 0 AND fk_coordinate_id = (SELECT fk_coordinate_id FROM ticket WHERE ticket_id = ?)',
			[ ticketId ],
			(error, row, fields) => {
				if (error) {
					return connection.rollback(function() {
						throw error;
					});
				}

				connection.query(
					'UPDATE ticket t JOIN user_journey uj ON t.ticket_id = uj.fk_ticket_id SET t.cancelled = 1, t.expired = 1 WHERE uj.fk_user_id = ? AND uj.fk_ticket_id = ?',
					[ req.userId, ticketId ],
					(error, row1, fields) => {
						if (error) {
							return connection.rollback(function() {
								throw error;
							});
						}

						console.log(row[0].count);
						//Remove coordinate if it connected to only 1 ticket, before the ticket gets cancelled/expired (only remove if its a virtual bus stop (fk_coordinate_type_id = 3))
						if (row[0].count === 1) {
							connection.query(
								'UPDATE coordinate SET removed = 1 WHERE coordinate_id = (SELECT fk_coordinate_id FROM ticket WHERE ticket_id = ?) AND fk_coordinate_type_id = 3',
								[ ticketId ],
								(error, row, fields) => {
									if (error) {
										return connection.rollback(function() {
											throw error;
										});
									}
								}
							);
						}
					}
				);
			}
		);

		if (cancellationFeeApplied) {
			connection.query(
				'UPDATE user SET funds = funds - ? WHERE user_id = ?',
				[ amount, req.userId ],
				(error, row, fields) => {
					if (error) {
						return connection.rollback(function() {
							throw error;
						});
					}
				}
			);
		}

		connection.commit((err) => {
			if (err) {
				return connection.rollback(() => {
					throw err;
				});
			}
		});
	});
});

app.get('/cancel', (req, res) => {
	res.render('cancel');
});

app.get('/tickets', function(req, res) {
	connection.query('SELECT ticket_id FROM ticket WHERE expired = 0', function(error, rows, fields) {
		if (error) throw error;

		res.send({ ticket: rows });
	});
});

app.get('/ticketsExpired', function(req, res) {
	connection.query('SELECT ticket_id FROM ticket WHERE expired = 1', function(error, rows, fields) {
		if (error) throw error;

		res.send({ ticket: rows });
	});
});

app.get('/user/tickets', function(req, res) {
	connection.query(
		'SELECT t.ticket_id, t.accessibility_required, t.used, t.expired, t.cancelled, uj.completed, uj.paid, j.start_time, j.end_time, c.street, c.city, c.fk_coordinate_type_id FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id',
		function(error, rows, fields) {
			if (error) throw error;

			res.send({ ticket: rows });
		}
	);
});

app.get('/user/tickets', function(req, res) {
	const userId = localStorage.getItem('userId');

	connection.query(
		'SELECT t.ticket_id, t.accessibility_required, t.used, t.expired, t.no_of_passengers, t.no_of_wheelchairs, t.returnTicket, t.cancelled, t.date_of_journey, t.time_of_journey, uj.completed, uj.favourited, uj.paid, j.start_time, j.end_time, c.street, c.city, c.fk_coordinate_type_id FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE uj.fk_user_id = ? ORDER BY t.date_of_journey ASC',
		[ userId ],
		function(error, rows, fields) {
			if (error) throw error;

			res.send({ ticket: rows });
		}
	);
});

app.get('/journeyResults', (req, res) => {
	const street = req.query.street;
	const city = req.query.city;

	connection.query(
		'SELECT j.journey_id FROM coordinate c JOIN journey j ON j.journey_id = c.fk_journey_id WHERE c.street = ? AND c.city = ? AND c.fk_coordinate_type_id = 2',
		[ street, city ],
		(error, rows, fields) => {
			if (error) throw error;
			res.send({ results: rows });
		}
	);
});

app.post('/toggleFavourite', (req, res) => {
	const ticketId = req.body.ticketId;
	const favourited = req.body.favourited;

	connection.query(
		`UPDATE user_journey SET favourited = ?
		WHERE fk_ticket_id = ?`,
		[ favourited, ticketId ],
		(error, row, fields) => {
			if (error) throw error;
			else {
				res.send({ status: 10 });
			}
		}
	);
});

app.post('/amendTicket', (req, res) => {
	req.checkBody('numWheelchair', 'Please enter a numeric value for wheelchairs.').isNumeric();
	req
		.checkBody('numWheelchair', 'The number of wheelchairs exceeds the number of passengers.')
		.greaterThan(req.body.numPassenger);

	//Send errors back to client
	const errors = req.validationErrors();
	if (errors) {
		return res.send({ status: 0, errors: errors });
	}

	const date = req.body.date;
	const time = req.body.time;
	const numWheelchair = req.body.numWheelchair;
	const ticketId = req.body.ticketId;

	connection.query(
		`UPDATE ticket SET date_of_journey = ?, time_of_journey = ?, no_of_wheelchairs = ?
		WHERE ticket_id = ?`,
		[ date, time, numWheelchair, ticketId ],
		(error, row, fields) => {
			if (error) throw error;
			else {
				res.send({ status: 10 });
			}
		}
	);
});

app.start = app.listen = function() {
	return server.listen.apply(server, arguments);
};

app.start(config.port);
