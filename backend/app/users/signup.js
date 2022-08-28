const path = require('path');
const fs = require('fs');
const client = require('../database.js').client;

const multer = require("multer");
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads-tmp');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

function loadRejectHelper(res, field) {
	let response = {
		status: "reject",
		message: "server couldn't load " + field + " field!"
	}
	res.status(400).send(JSON.stringify(response));
}

function rejectHelper(res, field) {
	let response = {
		status: "reject",
		message: "ivalid " + field + " field!"
	}
	res.status(400).send(JSON.stringify(response));
}

function hasLengthError(str, max=32, min=3) {
    return str.length < min || max < str.length;
}

function isUsernameInvalid(username) {
	return (
		hasLengthError(username, 10) ||
		/^[0-9]/g.test(username) ||
		!/^[a-zA-Z0-9_]+$/g.test(username)
	);
}

// Validates that the input string is a valid date formatted as "yyyy-mm-dd"
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g.test(dateString))
        return false;

    // Parse the date parts to integers
    let year = parseInt(dateString.substring(0, 4));
	let month = parseInt(dateString.substring(5, 7));
	let day = parseInt(dateString.substring(8));

    // Check the ranges of month and year
    if(year < 1960 || year > 2020 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function loadBodyParams(req, res) {
	// load the body parameters needed to crete user object
	let firstname = req.body.firstname;
	if (!firstname) return loadRejectHelper(res, "firstname");
	if (hasLengthError(firstname) || !/^[a-zA-Z\s]+$/g.test(firstname))
		return rejectHelper(res, "firtname");
	firstname = firstname.trim();

	let lastname = req.body.lastname;
	if (!lastname) return loadRejectHelper(res, "lastname");
	if (hasLengthError(lastname) || !/^[a-zA-Z\s]+$/g.test(lastname))
		return rejectHelper(res, "lastname");
	lastname = lastname.trim();

	let nationalID = req.body.nationalID;
	if (!nationalID) return loadRejectHelper(res, "nationalID");
	if (hasLengthError(nationalID, 10) || !/^[0-9]+$/g.test(nationalID))
		return rejectHelper(res, "nationalID");
	
	let birthDate = req.body.birthDate;
	if (!birthDate) return loadRejectHelper(res, "birthDate");
	if (birthDate.length != 10 || !isValidDate(birthDate))
		return rejectHelper(res, "birthDate");

	let username = req.body.username;
	if (!username) return loadRejectHelper(res, "username");
	if (isUsernameInvalid(username))
		return rejectHelper(res, "username");

	let password = req.body.password;
	if (!password) return loadRejectHelper(res, "password");
	if (hasLengthError(password) || /[\0\n\s]/g.test(password))
		return rejectHelper(res, "password");

	return {
		firstname: firstname.toLowerCase(),
		lastname: lastname.toLowerCase(),
		nationalID: nationalID,
		birthDate: birthDate,
		username: username,
		password: password
	}
}

function addUserHandler(req, res) {
	let params = loadBodyParams(req, res);
	if (!params) return;

	let filepath = path.join(__dirname, '..', '..', req.file.path);
	fs.readFile(filepath, {encoding: 'base64'}, (err, data) => {
		if (err) {
			console.log(err);
			let response = {
				status: "reject",
				message: "something went wrong!"
			}
			res.send(JSON.stringify(response));
			return;
		}
		client.db("test").collection("users").insertOne({
			firstname: params.firstname,
			lastname: params.lastname,
			nationalID: params.nationalID,
			birthDate: params.birthDate,
			username: params.username,
			password: params.password,
			profilePic: {
				data: data,
				contentType: req.file.mimetype
			}
		}).then (() => {
			let response = {
				status: "ok",
				message: "accepted!"
			}
			res.send(JSON.stringify(response));
			fs.unlink(filepath, (err) => {
				if (err) console.log(err);
			})
		})
	})
}

function signupHandler(req, res) {
	let profilUpload = upload.single("profilePic");
	profilUpload(req, res, (err) => {
		if (err instanceof multer.MulterError || !req.file) {
			console.log(err);
			let response = {
				status: "reject",
				message: "Server couldn't load the profile picture!"
			}
			res.status(400).send(JSON.stringify(response));
		}
		else if (err) {
			console.log(err);
			let response = {
				status: "reject",
				message: "Something went wrong processing the request!"
			}
			res.status(400).send(JSON.stringify(response));
		}
		else {
			console.log(req.body);
			console.log(req.file);
			addUserHandler(req, res);
		}
	});
}

module.exports.handler = signupHandler;
