const path = require('path')
const { client } = require(
    path.join(process.env.APPLICATION_PATH, 'database.js')
);
const express = require('express');
const router = express.Router();

// **********************************************************************
// helper functions
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

function failHelper(res) {
    let response = {
        status: "fail",
        message: "something went wrong!"
    }
    res.status(500).send(JSON.stringify(response));
}

function isUsernameInvalid(username) {
	return (
		username.length < 3 || 10 < username.length ||
		/^[0-9]/g.test(username) ||
		!/^[a-zA-Z0-9_]+$/g.test(username)
	);
}

// **********************************************************************
function parseReportParams(res, body) {
    let username = body.username;
    if (!username) return loadRejectHelper(res, "username");
    if (isUsernameInvalid(username))
        return rejectHelper(res, "username");

    let date = body.date;
    if (!date) return loadRejectHelper(res, "date");
    // check if the input string is formatted as "yyyy-mm-dd"
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g.test(date))
        return rejectHelper("date");

    let time = body.time;
    if (!time) return loadRejectHelper(res, "time");
    // check if the input string is formatted as "hh:mm"
    if (!/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/g.test(time))
        return rejectHelper("time");

    let progress = body.progress;
    if (!progress && progress != 0) return loadRejectHelper(res, "progress");
    progress = Math.floor(progress);

    let steps = body.steps;
    if (!steps) return loadRejectHelper(res, "steps");
    if (!Array.isArray(steps)) return rejectHelper(res, "steps");
    if (steps.length !== 9) return rejectHelper(res, "steps");
    for (let i = 0; i < 9; i++) {
        if (typeof steps[i] != "boolean") {
            return rejectHelper(res, "steps");
        }
    }

    return {
        username: username,
        date: date,
        time: time,
        progress: progress,
        steps: steps,
    }
}

function saveLogInDB(res, log) {
    client.db("test").collection("logs").insertOne(log)
    .then(() => {
        let response = {
            status: "ok",
            message: "accepted!"
        }
        res.send(JSON.stringify(response));
    })
    .catch((err) => {
        console.log(err);
        failHelper(res);
    })
}

router.post('/api/report', (req, res) => {
    console.log(req.body);
    let log = parseReportParams(res, req.body);
    if (!log) return;

    if (log.username == "Unknown") {
        saveLogInDB(res, log);
        return;
    }

    client.db("test").collection("users").findOne({ username: log.username })
    .then((result) => {
        if (!result) {
            return rejectHelper(res, "username");
        }
        saveLogInDB(res, log);
    })
    .catch((err) => {
        console.log(err);
        failHelper(res);
    })
});

// **********************************************************************
router.get('/api/report', (req, res) => {
    if (req.query.username) {
        client.db("test").collection("logs")
        .find({ username: req.query.username })
        .project({_id: 0})
        .toArray((err, collection) => {
            if (err) {
                console.log(err);
                return failHelper(res);
            }
            res.send(JSON.stringify(collection));
        });
    }
    else {
        client.db("test").collection("logs")
        .find().project({_id: 0})
        .toArray((err, collection) => {
            if (err) {
                console.log(err);
                return failHelper(res);
            }
            res.send(JSON.stringify(collection));
        });
    }
});

module.exports.router = router;
