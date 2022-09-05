const client = require('../database.js').client;
const express = require('express');
const router = express.Router();

router.post('/api/signup', require('./signup.js').handler);
router.get('/api/users', (req, res) => {
    client.db('test').collection("users").find()
    .project({
        _id: 0,
        firstname: 1,
        lastname: 1,
        nationalID: 1,
        birthDate: 1,
        username: 1,
        signupDate: 1,
    })
    .toArray((err, collection) => {
        if (err) {
            console.log(err);
            res.status(500).send("error!");
            return;
        }
        res.send(JSON.stringify(collection));
    });
});

const db_user_options = 

router.get('/api/user', (req, res) => {
    if (!req.query.username) {
        res.status(400).send("Bad Request!");
        return;
    }
    client.db("test").collection("users")
    .findOne({ username: req.query.username },
        {
            projection: {
                _id: 0,
                firstname: 1,
                lastname: 1,
                nationalID: 1,
                birthDate: 1,
                signupDate: 1,
            }
        },
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("error!");
                return;
            }
            if (!result) {
                res.status(404).send("error!");
                return;
            }
            res.send(JSON.stringify(result));
        }
    );
});

router.get('/api/profilePic', (req, res) => {
    if (!req.query.username) {
        res.status(400).send("Bad Request!");
        return;
    }
    client.db("test").collection("users")
    .findOne({ username: req.query.username }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("error!");
            return;
        }
        if (!result) {
            res.status(404).send("error!");
            return;
        }
        let img = Buffer.from(result.profilePic.data, "base64");
        res.setHeader('Content-Type', result.profilePic.contentType)
        res.send(img);
    });
});

module.exports.router = router;
