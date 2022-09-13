require('dotenv').config()

const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PRODUCTION ? 80 : 3000;

// **********************************************************************
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// **********************************************************************
app.use(require('./router.js'));

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
