const MongoClient = require('mongodb').MongoClient;

// Connect URL
// the default is local host because the mongodb is installed locally
const url = 'mongodb://127.0.0.1:27017/';

/*
    databaseConnect((client) => {
        your code goes here
        client.close()
    });
*/
// Always remember to close the client connection

function databaseConnect(callback) {
    MongoClient.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, client) => {
            if (err) {
                console.log(err);
                throw(err);
            }

            console.log(`DataBase connected: ${url}`);
            callback(client);
        }
    );
}

module.exports.databaseConnection = databaseConnect