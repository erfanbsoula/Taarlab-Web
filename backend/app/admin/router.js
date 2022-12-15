const path = require('path')
const { client } = require(
    path.join(process.env.APPLICATION_PATH, 'database.js')
);
const express = require('express');
const router = express.Router();

// **********************************************************************
// this middleware blocks unauthorized access requests
router.use((req, res, next) => {
    if (req.user.level != 1) {
        let result = {
            status: "reject",
            message: "unauthorized access!"
        };
        res.status(403).send(JSON.stringify(result));
    }
    else next();
})

// **********************************************************************
// serving static pages
const PRIVATE_FRONT_PATH = path.join(process.env.FRONT_PATH, 'private', 'admin');
const HOMEPAGE_PATH = path.join(PRIVATE_FRONT_PATH, 'home', 'home.html');

router.get('/', (req, res) => { res.sendFile(HOMEPAGE_PATH); })
router.use('/', express.static(PRIVATE_FRONT_PATH));

// **********************************************************************
// init signup and edit-user handlers
router.use(require('./signup.js').router);

// **********************************************************************
// api to get all users info
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
            console.error("database request error in '/api/users' handler:");
            console.log(err);
            let result = {
                status: "fail",
                message: "something went wrong!"
            };
            res.status(500).send(JSON.stringify(result));
            return;
        }
        res.send(JSON.stringify(collection));
    });
});

// **********************************************************************
// api to get single user info
router.get('/api/user', (req, res) => {
    if (!req.query.username) {
        let result = {
            status: "reject",
            message: "missing query params!"
        }
        res.status(400).send(JSON.stringify(result));
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
                console.error("database request error in '/api/user' handler:");
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
            res.send(JSON.stringify(result));
        }
    );
});

// **********************************************************************
// api to get a single user's profile picture
router.get('/api/profilePic', (req, res) => {
    if (!req.query.username) {
        let result = {
            status: "reject",
            message: "missing query params!"
        }
        res.status(400).send(JSON.stringify(result));
        return;
    }
    client.db("test").collection("users")
    .findOne({ username: req.query.username }, (err, result) => {
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

// **********************************************************************
router.use(require('./report.js').router);

module.exports.router = router;
