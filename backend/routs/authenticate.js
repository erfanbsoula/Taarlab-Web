const path = require('path');
const express = require('express');
const passport = require("passport");

const authenticator = express.Router();

// **********************************************************************
// User Authentication process and login page
function isAuthenticated(req) {
    return req.session.passport && req.session.passport.user;
}

authenticator.get('/login-failure', (req, res) => {
	res.send('login failed!')
})

function canLogin(req, res, next) {
    if (isAuthenticated(req))
        res.send('you are already logged in!');
    else next();
}

authenticator.get('/login', canLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'public', 'login', 'login.html'));
});

authenticator.post('/login', canLogin,
    passport.authenticate('local', {
        // keepSessionInfo: true,
        failureRedirect: '/login-failure',
        successRedirect: '/home/home.html',
    })
);

authenticator.use((req, res, next) => {
    if (!isAuthenticated(req))
        res.redirect('/login');
    else next();
})

module.exports.authenticator = authenticator;
