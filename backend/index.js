const express = require('express');
const { client, db } = require('./mongoTest.js');
const MongoStore = require('connect-mongo');
const session = require("express-session");
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
	adminDB.listDatabases(function(err, result) {
		if (err) {
			console.log(err.errmsg);
		};
		console.log(result.databases);
	}); 
});

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

app.get('/', (req, res) => {
	db.collection("sessions").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
	});
	if (req.session.counter) {
		req.session.counter++;
		res.send(`<h3>you are the session #${req.session.counter}</h3>`);
		return;
	}
	req.session.counter = 1;
	res.send(`<h3>counter set</h3>`);
})

// app.use(express.static(path.join(__dirname, '..', 'frontend')))

// app.all('*', (req, res) => {
// 	res.status(404);
// 	res.send('<h1>Error: 404 not found!<h1>');
// })

app.get('/close', (req, res) => {
	client.close();
	console.log('database connection closed!');
})

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
