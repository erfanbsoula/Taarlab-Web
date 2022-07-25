const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.all('*', (req, res) => {
	res.status(404);
	res.send('<h1>Error: 404 not found!<h1>');
})

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
