const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;

// the default is local host because the mongodb is installed locally
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
client.connect();

process.on('SIGINT', () => {
	console.log('closing DataBase connections');
	client.close();
	console.log('exiting the program');
	process.exit();
});

module.exports.ObjectId = Mongo.ObjectId;
module.exports.client = client;
