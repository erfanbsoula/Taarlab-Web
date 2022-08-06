const path = require('path');
const express = require('express');
const passport = require("passport");
const client = require('./database.js').client;
const printdb = require('./database.js').printdb;
const router = express.Router();

router.get('/', (req, res) => {
	let text = "";
	if (req.session.counter) {
		req.session.counter++;
		text = `<h3>you are the session #${req.session.counter}</h3>`;
	}
	else {
		req.session.counter = 1;
		text = `<h3>counter set</h3>`;
	}
	if (req.session.passport && req.session.passport.user) {
		text += "<h4>logged in<h4>";
	}
	res.send(text);
})

router.get('/login', (req, res) => {
	if (req.session.passport && req.session.passport.user) {
		res.send('you are already logged in!');
		return;
	}
	res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
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

router.post('/login', passport.authenticate('local', {successRedirect: '/login-success', failureRedirect: '/login-failure'}))

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

router.use(express.static(path.join(__dirname, '..', 'frontend')))

// app.all('*', (req, res) => {
// 	res.status(404);
// 	res.send('<h1>Error: 404 not found!<h1>');
// })

module.exports = router;