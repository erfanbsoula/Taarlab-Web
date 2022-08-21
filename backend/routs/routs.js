const path = require('path');
const express = require('express');
const client = require('../database.js').client;
const printdb = require('../database.js').printdb;
const multer = require("multer");
const authenticator = require("./authenticate.js").authenticator;

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.use('/', express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));
router.use(authenticator);
router.use('/', express.static(path.join(__dirname, '..', '..', 'frontend', 'private')));
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'private', 'home', 'home.html'));
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

router.post("/add-user", upload.single("profilePic"),
	(err, req, res, next) => {
		if (err) {
			console.log(err.message);
			res.status(400).send("Server couldn't find the profile picture!");
		}
		else next();
	},
	(req, res) => {
		console.log(req.body);
		console.log(req.file);
		res.send('{"status" : "ok"}')
	}
);

// app.all('*', (req, res) => {
// 	res.status(404);
// 	res.send('<h1>Error: 404 not found!<h1>');
// })

module.exports = router;