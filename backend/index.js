const express = require('express');
const { client, db } = require('./mongoTest.js');
const MongoStore = require('connect-mongo');
const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const http = require('http');
const path = require('path');
const app = express();
const port = 3000;

db.collection("sessions").drop((err, delOK) => {
	if (err) {
		console.log(err.errmsg);
	};
	if (delOK) {
		console.log("sessions collection deleted");
	}
	let adminDB = db.admin();
	console.log('listing the database:')
	adminDB.listDatabases(function(err, result) {
		if (err) {
			console.log(err.errmsg);
		};
		console.log(result.databases);
	}); 
});

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: 'keyboard cat',
	store: MongoStore.create({
		client: client,
		dbName: 'test',
		collectionName: 'sessions',
		autoRemove: 'interval',
		autoRemoveInterval: 60
	}),
	resave: false,
	saveUninitialized: true,
	unset: 'destroy',
	cookie: {
		// secure: true,
		maxAge: 1000 * 60 * 60
	}
}));

// passport.use(new LocalStrategy(
// 	{
// 		usernameField: 'username',
// 		passwordField: 'password'
// 	},
// 	(username, password, done) => {
// 		db.collection("users").findOne({ username: username }, function (err, user) {
// 			if (err) { return done(err); }
// 			if (!user) { return done(null, false); }
// 			if (user.password != password) { return done(null, false); }
// 			return done(null, user);
// 		});
// 	}
// ))

// passport.serializeUser(function(user, done) {
// 	done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
// 	db.collection("users").findOne({ _id: id }, function (err, user) {
// 		console.log(`deserialized user is ${user}`)
// 		done(err, user);
// 	});
// });

// app.use(passport.initialize());

function printdb () {
	db.collection("sessions").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
	});
	db.collection("users").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
	});
}

app.get('/', (req, res) => {
	let text = "";
	if (req.session.counter) {
		req.session.counter++;
		text = `<h3>you are the session #${req.session.counter}</h3>`;
	}
	else {
		req.session.counter = 1;
		text = `<h3>counter set</h3>`;
	}
	if (req.session.loggedIn) {
		text += "<h4>logged in<h4>";
	}
	res.send(text);
})

app.get('/login', (req, res) => {
	if (req.session.loggedIn) {
		res.send('you are already logged in!');
		return;
	}
	res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
})

app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'signup.html'));
})

app.post('/signup', (req, res) => {
	db.collection("users").insertOne({
		username: req.body.username,
		password: req.body.password
	});
	res.redirect('/login');
})

app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	db.collection("users").findOne({ username: username }, function (err, user) {
		if (err) {
			console.log(err.message);
			res.send('something went wrong...');
			return;
		}
		if (!user) {
			res.send('wrong username');
			return;
		}
		if (user.password != password) {
			res.send('wrong password');
			return;
		}
		req.session.loggedIn = true;
		res.redirect('/login-success')
	});
})

app.get('/print', (req, res) => {
	printdb();
	res.send("done!")
})

app.get('/login-failure', (req, res) => {
	res.send('login failed!')
})

app.get('/login-success', (req, res) => {
	res.send('login successful!')
})

app.use(express.static(path.join(__dirname, '..', 'frontend')))

// app.all('*', (req, res) => {
// 	res.status(404);
// 	res.send('<h1>Error: 404 not found!<h1>');
// })

app.get('/close', (req, res) => {
	client.close();
	console.log('database connection closed!');
	res.send('done!')
})

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
