const path = require('path');
const express = require('express');
const client = require('../database.js').client;

let router = express.Router();
router.use('/userView/', express.static(path.join(process.env.FRONT_PATH, 'private', 'userView')));

router.use('/', (req, res, next) => {
    if (req.query.username != req.user.username) {
        let result = {
            status: 'reject',
            message: 'user can only view itself'
        }
        res.send(JSON.stringify(result));
        return;
    }

    next();
})

router.get('/api/user', (req, res) => {
    let result = {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        nationalID: req.user.nationalID,
        birthDate: req.user.birthDate,
        signupDate: req.user.signupDate,
    }
    res.send(JSON.stringify(result));
})

router.get('api/report', (req, res) => {
    client.db("test").collection("logs")
    .find({ username: req.user.username })
    .project({
        _id: 0,
        date: 1,
        time: 1,
        progress: 1,
        steps: 1,
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
