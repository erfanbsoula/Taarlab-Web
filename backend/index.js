const express = require('express');
const session = require("express-session");
const http = require('http');
const path = require('path');
const app = express();
const port = 3000;

let mysession = null;

const dataBase = require('./mongoTest.js').databaseConnection
dataBase((client) => {
	let adminDB = client.db("test").admin();
	adminDB.listDatabases(function(err, result) {
		console.log(result.databases);
		client.close();
		console.log('closed DataBase connection!');
	});
})

app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}))

app.get('/', (req, res) => {
	if (req.session.id = mysession) {
		res.send('Hello World!')
		console.log(`sesion id: ${req.session.id}`)
	}
	else {
		res.send('I dont know you!')
		mysession = req.session.id;
	}
})

app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.all('*', (req, res) => {
	res.status(404);
	res.send('<h1>Error: 404 not found!<h1>');
})

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
