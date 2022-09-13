const path = require('path');
const express = require('express');
const client = require('./database.js').client;

const router = express.Router();

router.use('/', express.static(path.join(process.env.FRONT_PATH, 'public')));
router.use(require("./auth.js").router);
router.get('/', (req, res) => {
	res.sendFile(path.join(process.env.FRONT_PATH, 'private', 'home', 'home.html'));
})
router.use('/', express.static(path.join(process.env.FRONT_PATH, 'private')));
router.use(require("./admin/router.js").router);

// **********************************************************************
// clear the residual sessions from the previous execution
// client.db("test").collection("sessions").drop((err, delOK) => {
// 	if (err) {
// 		console.log(err.errmsg);
// 	};
// 	if (delOK) {
// 		console.log("sessions collection deleted");
// 	}
// 	let adminDB = client.db("test").admin();
// 	console.log('listing the database:')
// 	adminDB.listDatabases(function(err, result) {
// 		if (err) {
// 			console.log(err.errmsg);
// 		};
// 		console.log(result.databases);
// 	}); 
// });

// **********************************************************************
module.exports = router;
