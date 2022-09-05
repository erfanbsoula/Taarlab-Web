const http = require('http');
const express = require('express');

const {ObjectId, client} = require('./database.js');
const MongoStore = require('connect-mongo');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const router = require('./router.js');

const app = express();
const port = 3000;

// **********************************************************************
// clear the residual sessions from the previous execution
// client.db("test").collection("sessions").drop((err, delOK) => {
// 	if (err) {
// 		console.log(err.errmsg);
// 	};
// 	if (delOK) {
// 		console.log("sessions collection deleted");
// 	}
// 	let adminDB = client.db("test").admin();
// 	console.log('listing the database:')
// 	adminDB.listDatabases(function(err, result) {
// 		if (err) {
// 			console.log(err.errmsg);
// 		};
// 		console.log(result.databases);
// 	}); 
// });

// **********************************************************************
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// **********************************************************************
// setup sessions middleware with mongodb database
app.use(session({
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

app.use(passport.initialize());
app.use(passport.session());

// **********************************************************************
app.use(router);

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
