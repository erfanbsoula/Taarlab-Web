const path = require('path');
const express = require('express');
const passport = require("passport");
const client = require('./database.js').client;
const printdb = require('./database.js').printdb;
const router = express.Router();

// **********************************************************************
// User Authentication process and login page
function isAuthenticated(req) {
    return req.session.passport && req.session.passport.user;
}

router.use('/', express.static(path.join(__dirname, '..', 'frontend', 'public')));
router.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login', 'login.css'));
})

function canLogin(req, res, next) {
    if (isAuthenticated(req))
        res.send('you are already logged in!');
    else next();
}

router.get('/login', canLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login', 'login.html'));
});

router.post('/login', canLogin,
    passport.authenticate('local', {
        // keepSessionInfo: true,
        failureRedirect: '/login-failure',
        successRedirect: '/index.html',
    })
);

router.use((req, res, next) => {
    if (!isAuthenticated(req))
        res.redirect('/login');
    else next();
})

// **********************************************************************
// API for posting data to the DataBase
router.post('/data', (req, res) => {
	if (req.user.level != 2) {
		res.status(403).send("Unauthorizes Access!");
		return;
	}

	if (!req.body.username || !req.body.dateTime || !req.body.progress) {
		res.status(400).end();
		return;
	}

	client.db("test").collection("dataStorage").insertOne({
		username: req.body.username,
		dateTime: req.body.dateTime,
		progress: req.body.progress
	}, (error) => {
		if (error) {
			console.log(error.message);
			res.status(500).send("DataBase Error!");
			return;
		}

		res.status(200).send("Recieved!")
	});
})

// **********************************************************************
router.use('/', express.static(path.join(__dirname, '..', 'frontend', 'private')));

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'private', 'index.html'));
})

router.get('/api/users', (req, res) => {
	if (req.user.level == 1) {
		client.db("test").collection("users").find().toArray((error, result) => {
			if (error) {
				console.log(error.message);
				res.status(500).send("DataBase Error!");
				return;
			}
			res.send(JSON.stringify(result));
		});
	}
	else {
		res.status(403).send("Unauthorizes Access!");
		return;
	}
})

router.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'signup.html'));
})

router.post('/signup', (req, res) => {
	client.db("test").collection("users").insertOne({
		username: req.body.username,
		password: req.body.password
	});
	res.redirect('/login');
})

router.get('/print', (req, res) => {
	printdb();
	res.send("done!")
})

router.get('/login-failure', (req, res) => {
	res.send('login failed!')
})

router.get('/login-success', (req, res) => {
	res.send('login successful!')
})


// app.all('*', (req, res) => {
// 	res.status(404);
// 	res.send('<h1>Error: 404 not found!<h1>');
// })

module.exports = router;