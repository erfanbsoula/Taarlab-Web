const path = require('path');
const express = require('express');
const passport = require("passport");

const router = express.Router();

// **********************************************************************
// User Authentication process and login page
function isAuthenticated(req) {
    return req.session.passport && req.session.passport.user;
}

router.get('/login-failure', (req, res) => {
	res.send('login failed!');
});

function canLogin(req, res, next) {
    if (isAuthenticated(req))
        res.send('you are already logged in!');
    else next();
}

router.get('/login', canLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'public', 'login', 'login.html'));
});

router.post('/login', canLogin,
    passport.authenticate('local', {
        // keepSessionInfo: true,
        failureRedirect: '/login-failure',
        successRedirect: '/home/home.html',
    })
);

router.use((req, res, next) => {
    if (!isAuthenticated(req))
        res.redirect('/login');
    else next();
});

router.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log(err);
            return;
        }
        let result = {
            status: "ok",
            message: "logged out!"
        };
        res.send(JSON.stringify(result));
    });
});

module.exports.router = router;
