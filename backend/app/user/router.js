const path = require('path');
const express = require('express');
const client = require.main.require('./database.js').client;

let router = express.Router();

const USER_VIEW_PATH = path.join(process.env.FRONT_PATH, 'private', 'userView');
router.use('/userView/', express.static(USER_VIEW_PATH));
router.use('/assets/', express.static(path.join(process.env.FRONT_PATH, 'private', 'assets')));
router.use('/components/', express.static(path.join(process.env.FRONT_PATH, 'private', 'components')));
router.get('/', (req, res) => {res.redirect('/userView/userHome.html?username=' + req.user.username)});

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

router.get('/api/profilePic', (req, res) => {
    client.db("test").collection("users")
    .findOne({ username: req.user.username }, (err, result) => {
        if (err) {
            console.error("database request error in '/api/profilePic' handler:");
            console.log(err);
            let result = {
                status: "fail",
                message: "something went wrong!"
            };
            res.status(500).send(JSON.stringify(result));
            return;
        }
        if (!result) {
            let result = {
                status: "reject",
                message: "user not found!"
            };
            res.status(404).send(JSON.stringify(result));
            return;
        }
        let img = Buffer.from(result.profilePic.data, "base64");
        res.setHeader('Content-Type', result.profilePic.contentType)
        res.status(200).send(img);
    });
});

router.get('/api/report', (req, res) => {
    client.db("test").collection("logs")
    .find({ username: req.user.username })
    .project({_id: 0})
    .toArray((err, collection) => {
        if (err) {
            console.log(err);
            let response = {
                status: "fail",
                message: "something went wrong!"
            }
            res.status(500).send(JSON.stringify(response));
            return;
        }
        res.send(JSON.stringify(collection));
    });
});

module.exports.router = router;
