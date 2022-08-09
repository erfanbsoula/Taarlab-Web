const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const ObjectId = Mongo.ObjectId;
module.exports.ObjectId = ObjectId;

// the default is local host because the mongodb is installed locally
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
client.connect();
module.exports.client = client;

process.on('SIGINT', () => {
	console.log('closing DataBase connections');
	client.close();
	console.log('exiting the program');
	process.exit();
});

function printdb () {
	client.db("test").collection("sessions").find({}).toArray((err, result) => {
		if (err) {
			console.log(err.message);
			return;
		};
		console.log(result);
		client.db("test").collection("users").find({}).toArray(function(err, result) {
			if (err) {
				console.log(err.message);
				return;
			};
			console.log(result);
		});
	});
}
module.exports.printdb = printdb;
