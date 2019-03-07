var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var saltRounds = 10;

var engines = require('consolidate');
var paypal = require('paypal-rest-sdk');
var paypalApiKey = require('../paypal_api_key');
var ip = require('../ipstore');

app.engine('ejs', engines.ejs);
app.set('views', '../views');
app.set('view engine', 'ejs');

const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./server/scratch');
}

// Change to your credentials
// Use Database provided in folders or ask in Teams
var connection = mysql.createConnection({
	host: 'localhost',
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
				localStorage.setItem('userId', rows[0].user_id);
				return res.send({ content: rows[0], status: 10 });
			}
		});
	});
});

app.post('/book', (req, res) => {
	//Get form fields
	const data = req.body.data;
	const date = req.body.date;

	// startLocation: `${street}, ${city}`,
	// 			endLocation: `${endStreet}, ${endCity}`,
	// 			passenger: numPassenger,
	// 			Wheelchair: numWheelchair
	const output = `
		<h1> Your confirmed booking</h1>
		<p> Thank you for your recent booking with us. Here is a reminder of your journey details:</p>
		<ul>
			<li>Date: ${date}</li>
			<li>From: ${data.startLocation}</li>
			<li>To: ${data.endLocation}</li>
			<li>Number of passengers: ${data.passenger}</li>
			<li>Number of wheelchairs: ${data.wheelchair}</li>
		</ul>
	`;

	('use strict');
	const nodemailer = require('nodemailer');

	async function main() {
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'tfwirt.test@gmail.com',
				pass: 'TfwTest123'
			}
		});

		// setup email data
		let mailOptions = {
			from: '"TfW Booking" <tfwirt.test@gmail.com>', // sender address
			to: 'alsaaba@cardiff.ac.uk', // list of receivers
			subject: 'Your booking details', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};

		// send mail with defined transport object
		let info = await transporter.sendMail(mailOptions);

		console.log('Message sent: %s', info.messageId);
	}

	res.send({ status: 10 });
	main().catch(console.error);
});

app.get('/driver/schedule', function(req, res) {
	connection.query(
		`  SELECT c.street, c.city, c.fk_coordinate_type_id, c.longitude, c.latitude, t.date_of_journey, t.time_of_journey,
	t.no_of_passengers, t.no_of_wheelchairs
FROM ticket t
JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id 
JOIN journey j ON uj.fk_journey_id = j.journey_id 
JOIN coordinate c ON j.journey_id = c.fk_journey_id
WHERE c.fk_coordinate_type_id = 1;`,
		function(error, rows, fields) {
			if (error) console.log(error);
			else {
				res.send(rows);
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

app.post('/booking/temp', (req, res) => {
	const startPlaceId = req.body.place_id;
	const startStreet = req.body.street;
	const startCity = req.body.city;
	const startCountry = req.body.country;
	const startLat = req.body.lat;
	const startLng = req.body.lng;
	const startType = req.body.startType;

	const endPlaceId = req.body.endPlaceID;
	const endStreet = req.body.endStreet;
	const endCity = req.body.endCity;
	const endCountry = req.body.endCountry;
	const endLat = req.body.endLat;
	const endLng = req.body.endLng;
	const endType = req.body.endType;

	const date = req.body.date;
	const time = req.body.time;
	const numPassenger = req.body.numPassenger;
	const numWheelchair = req.body.numWheelchair;

	console.log(localStorage.getItem('userId'));
	// const userID = req.session.userId !== undefined ? req.session.userId : 1;
	connection.query(
		'INSERT INTO ticket (no_of_passengers, no_of_wheelchairs, used, expired, date_of_journey, time_of_journey, date_created) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[ numPassenger, numWheelchair, 0, 0, date, time, new Date() ],
		(error, row1, fields) => {
			if (error) throw error;

			connection.query(
				'INSERT INTO journey (start_time, end_time) VALUES (?, ?)',
				[ new Date(), new Date() ],
				(error, row, fields) => {
					if (error) throw error;
					// console.log(row.insertId, userID, row1.insertId, 1);

					connection.query(
						'INSERT INTO user_journey (fk_journey_id, fk_user_id, fk_ticket_id, paid) VALUES (?, ?, ?, ?)',
						[ row.insertId, 1, row1.insertId, 1 ],
						(errors, rows, fields) => {
							if (errors) throw errors;
						}
					);

					connection.query(
						'INSERT INTO coordinate (place_id, street, city, country, latitude, longitude, fk_coordinate_type_id, fk_journey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						[
							startPlaceId,
							startStreet,
							startCity,
							startCountry,
							startLat,
							startLng,
							startType,
							row.insertId
						],
						(error, row, fields) => {
							if (error) throw error;
						}
					);

					connection.query(
						'INSERT INTO coordinate (place_id, street, city, country, latitude, longitude, fk_coordinate_type_id, fk_journey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						[ endPlaceId, endStreet, endCity, endCountry, endLat, endLng, endType, row.insertId ],
						(error, row, fields) => {
							if (error) throw error;
						}
					);
				}
			);
		}
	);
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
	connection.query(
		'select funds from user where user_id = ?',
		[ localStorage.getItem('userId') ],
		(error, rows, fields) => {
			if (error) throw error;
			else {
				res.send(rows[0]);
			}
		}
	)
]);

app.get('/user/transactions', (req, res) => [
	connection.query(
		'SELECT t.*, tt.type FROM transaction t JOIN transaction_type tt ON tt.transaction_type_id = t.fk_transaction_type_id WHERE fk_user_id = ? ORDER BY date DESC',
		[ localStorage.getItem('userId') ],
		(error, rows, fields) => {
			if (error) throw error;
			else {
				res.send(rows);
			}
		}
	)
]);

app.get('/driver/stops', function(req, res) {
	connection.query(
		`SELECT c.street, c.city, c.fk_coordinate_type_id, t.date_of_journey, t.time_of_journey, t.no_of_passengers, t.no_of_wheelchairs
		FROM ticket t
		JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id 
		JOIN journey j ON uj.fk_journey_id = j.journey_id 
		JOIN coordinate c ON j.journey_id = c.fk_journey_id
		WHERE c.fk_coordinate_type_id = 1`,
		function(error, rows, fields) {
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
	const userId = localStorage.getItem('userId');

	connection.query(
		'INSERT INTO transaction (current_funds, spent_funds, date, fk_transaction_type_id, fk_user_id) VALUES(?, ?, ?, ?, ?)',
		[ current_funds, spent_funds, new Date(), fk_transaction_type_id, userId, userId ],
		(error, row, fields) => {
			if (error) throw error;
			connection.query(
				'UPDATE user SET funds = funds - ? WHERE user_id = ?',
				[ spent_funds, userId ],
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

app.get('/ticketsQuery', function(req, res) {
	const id = req.query.id;
	const expired = req.query.expired;

	connection.query(
		'SELECT DISTINCT t.ticket_id, t.accessibility_required, t.used, t.expired, uj.paid, j.start_time, j.end_time, c.street, c.city, c.fk_coordinate_type_id FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE t.ticket_id = ? AND t.expired = ?',
		[ id, expired ],
		function(error, rows, fields) {
			if (error) throw error;

			res.send({ ticket: rows });
		}
	);
});

app.get('/ticketsQuery1', function(req, res) {
	const id = req.query.id;

	connection.query(
		'SELECT DISTINCT t.ticket_id, t.accessibility_required, t.used, t.expired, uj.paid, j.start_time, j.end_time, c.street, c.city, c.fk_coordinate_type_id FROM ticket t JOIN user_journey uj ON uj.fk_ticket_id = t.ticket_id JOIN journey j ON uj.fk_journey_id = j.journey_id JOIN coordinate c ON j.journey_id = c.fk_journey_id WHERE t.ticket_id = ?',
		[ id ],
		function(error, rows, fields) {
			if (error) throw error;

			res.send({ ticket: rows });
		}
	);
});

app.listen(PORT);
