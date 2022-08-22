const path = require('path');
const express = require('express');
const client = require('../database.js').client;
const printdb = require('../database.js').printdb;
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

function loadRejectHelper(res, field) {
	let response = {
		status: "reject",
		message: "server couldn't load " + field + " field!"
	}
	res.status(400).send(JSON.stringify(response));
}

function hasLengthError(res, str, field, max=32, min=3) {
    if (str.length < min || max < str.length) {
		let response = {
			status: "reject",
			message: "length error at field " + field
		}
		res.status(400).send(JSON.stringify(response));
		return true;
	}

	return false;
}

function charRejectHelper(res, field) {
	let response = {
		status: "reject",
		message: "some characters in the field " + field + " are not allowed!"
	}
	res.status(400).send(JSON.stringify(response));
}

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function vlidateDateString(res, str) {
	if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g.test(str)) {
		let response = {
			status: "reject",
			message: "invalid date for birthDate Field!"
		}
		res.status(400).send(JSON.stringify(response));
		return false;
	}
	let year = parseInt(str.substring(0, 4));
	let month = parseInt(str.substring(5, 7));
	let day = parseInt(str.substring(8));

	let 
}

function addUserHandler(req, res) {
	let firstname = req.body.firstname;
	if (!firstname) return loadRejectHelper(res, "firstname");
	if (hasLengthError(res, firstname, "firtname")) return;
	if (!/^[a-zA-Z\s]+$/g.test(firstname)) charRejectHelper(res, "firstname");
	firstname = firstname.trim();

	let lastname = req.body.lastname;
	if (!lastname) return loadRejectHelper(res, "lastname");
	if (hasLengthError(res, lastname, "lastname")) return;
	if (!/^[a-zA-Z\s]+$/g.test(lastname)) charRejectHelper(res, "lastname");
	lastname = lastname.trim();
	
	let nationalID = req.body.nationalID;
	if (!nationalID) return loadRejectHelper(res, "nationalID");
	if (hasLengthError(res, nationalID, "nationalID")) return;
	if (!/^[0-9]+$/g.test(nationalID)) charRejectHelper(res, "nationalID");
	
	let birthDate = req.body.birthDate;
	if (!birthDate) return loadRejectHelper(res, "birthDate");
	if (hasLengthError(res, birthDate, "birthDate", 10, 10)) return;



}

router.post("/api/add-user", (req, res) => {
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
			let response = {
				status: "ok",
				message: "accepted!"
			}
			res.send(JSON.stringify(response));
		}
	});
});

module.exports.router = router;
