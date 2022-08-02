const MongoClient = require('mongodb').MongoClient;

// the default is local host because the mongodb is installed locally
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);

client.connect();
console.log('Connected successfully to server');
const db = client.db("test");

/*
    databaseConnect((client) => {
        your code goes here
        client.close()
    });
*/
// Always remember to close the client connection

// async function databaseConnect(callback) {

//     await 
//     const collection = db.collection('documents');

//   // the following code examples can be pasted here...

//   return 'done.';
//     MongoClient.connect(
//         url,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         },
//         (err, client) => {
//             if (err) {
//                 console.log(err);
//                 throw(err);
//             }

//             console.log(`DataBase connected: ${url}`);
//             callback(client);
//         }
//     );
// }

module.exports.client = client;
module.exports.db = db;