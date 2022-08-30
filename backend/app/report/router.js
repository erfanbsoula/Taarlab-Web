const client = require('../database.js').client;
const express = require('express');
const router = express.Router();

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

function isUsernameInvalid(username) {
	return (
		username.length < 3 || 10 < username.length ||
		/^[0-9]/g.test(username) ||
		!/^[a-zA-Z0-9_]+$/g.test(username)
	);
}

router.post('/api/report', (req, res) => {
    console.log(req.body);
    let username = req.body.username;
    if (!username) return loadRejectHelper(res, "username");
    if (isUsernameInvalid(username))
        return rejectHelper(res, "username");

    let date = req.body.date;
    if(!date) return loadRejectHelper(res, "date");

    let time = req.body.time;
    if(!time) return loadRejectHelper(res, "time");

    let progress = req.body.progress;
    if (!progress) return loadRejectHelper(res, "progress");

    let log = {
        username: username,
        date: date,
        time: time,
        progress: progress
    }

    client.db("test").collection("users").findOne({ username: username })
    .then((result) => {
        if (!result) {
            return rejectHelper(res, "username");
        }
        
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
            let response = {
                status: "reject",
                message: "something went wrong!"
            }
            res.status(500).send(JSON.stringify(response));
            return;
        })
    })
    .catch((err) => {
        console.log(err);
        let response = {
            status: "reject",
            message: "something went wrong!"
        }
        res.status(500).send(JSON.stringify(response));
        return;
    })
});

router.get('/api/report', (req, res) => {
    if (req.query.username) {
        client.db("test").collection("logs")
        .find({ username: req.query.username })
        .project({
            _id: 0,
            date: 1,
            time: 1,
            progress: 1
        })
        .toArray((err, collection) => {
            if (err) {
                console.log(err);
                let response = {
                    status: "reject",
                    message: "something went wrong!"
                }
                res.status(500).send(JSON.stringify(response));
                return;
            }
            res.send(JSON.stringify(collection));
        });
        return;
    }
    client.db("test").collection("logs")
    .find().project({
        _id: 0,
        username: 1,
        date: 1,
        time: 1,
        progress: 1
    })
    .toArray((err, collection) => {
        if (err) {
            console.log(err);
            let response = {
                status: "reject",
                message: "something went wrong!"
            }
            res.status(500).send(JSON.stringify(response));
            return;
        }
        res.send(JSON.stringify(collection));
    });
});

module.exports.router = router;
