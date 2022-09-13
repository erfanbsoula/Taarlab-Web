const path = require('path');
const express = require('express');

const {ObjectId, client} = require('./database.js');
const MongoStore = require('connect-mongo');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const router = express.Router();

// **********************************************************************
// setup sessions middleware with mongodb database
router.use(session({
	secret: 'keyboard cat',
	store: MongoStore.create({
		client: client,
		dbName: 'test',
		collectionName: 'sessions',
		autoRemove: 'interval',
		autoRemoveInterval: 60
	}),
	resave: false,
	saveUninitialized: true,
	unset: 'destroy',
	cookie: {
		// secure: true,
		sameSite: true,
		maxAge: 1000 * 60 * 60
	}
}));

// **********************************************************************
// setup passport js authentication with local strategy
passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	(username, password, done) => {
		client.db("test").collection("users").findOne({ username: username }, (err1, user1) => {
			if (err1) { return done(err1); }
			if (!user1) { 
				client.db("test").collection("admins").findOne({ username: username }, (err2, user2) => { 
					if (err2) { return done(err2); }
					if (!user2) { return done(null, false); }
					if (user2.password != password) { return done(null, false); }
					return done(null, user2);
				})
				return;
			}
			if (user1.password != password) { return done(null, false); }
			return done(null, user1);
		});
	}
))
	
passport.serializeUser(function(user, done) { done(null, user._id); });

passport.deserializeUser(function(id, done) {
	client.db("test").collection("users").findOne({ _id: ObjectId(id) }, (err, user) => {
		if (!user) {
			client.db("test").collection("admins").findOne({ _id: ObjectId(id) }, (err, user) => {
				done(err, user);
			})
			return;
		}
		done(err, user);
	});
});

router.use(passport.initialize());
router.use(passport.session());

// **********************************************************************
// User Authentication process and login page
function isAuthenticated(req) {
    return (
        req.user && req.session.passport &&
        req.session.passport.user
    );
}

function canLogin(req, res, next) {
    if (isAuthenticated(req)) {
        let result = {
            status: 'reject',
            message:  'already logged in!'
        }
        res.send(JSON.stringify(result))
    }
    else next();
}

router.get('/login', canLogin, (req, res) => {
    res.sendFile(path.join(process.env.FRONT_PATH, 'public', 'login', 'login.html'));
});

// fix this later
router.get('/login-failure', (req, res) => {
    res.send('login failed!');
});

router.post('/login', canLogin,
    passport.authenticate('local', {
        // keepSessionInfo: true,
        failureRedirect: '/login-failure',
        successRedirect: '/',
    })
);

router.use((req, res, next) => {
    if (!isAuthenticated(req)) {
        res.status(401).redirect('/login');
	}
    else next();
});

router.delete('/login', (req, res) => {
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
