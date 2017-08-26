const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// our routes
let extra = require('./routes/extra');
let auth = require('./routes/auth');

// we have to have an express app...
let app = express();

// because index.html is stored there
app.use(express.static('public'));

// bodyParser is required for form login to work with passport
app.use(bodyParser.urlencoded({ extended: false }));

// set up how the LocalStrategy will work
// callback get passed username and password from the login
// form and we need to check out persistent store (if we had one)
// to verify their credentials. we send an object back as the
// second argument to done indicating we have found a user.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // fake the auth by testing for a fixed user/pass
    if( username === 'e' && password === 'e' ) {
      return done(null, {username: username, password: password});
    } else {
      return done(null, false);
    }
  }
));

// serializeUser determines which data of the user object gets
// stored in session.
// user comes from the done call in passport.use(new LocalStrategy)
// in that callback the username and password are checked
// if they pass, we call done with a second argument of an object
// that object is what arrives in as user here.
// The result of the serializeUser method is attached to
// the session as req.session.passport.user = {}. Here for
// instance, it would be (as we provide the user id as the
// key) req.session.passport.user = {id:'xyz'}
// In my example, I just use the username as the key.
passport.serializeUser(function(user, done) {
  console.log('in serializeUser, receives user from LocalStrategy done');
  console.log(`user:`);
  console.dir(user);
  done(null, user.username);
});

// deserializeUser is used to retrieve the entire user object
// given the id.
// the id comes from the session store, which is accessed
// by the cookie that the browser sends to the server.
// In deserializeUser that key is matched with the in memory
// array / database or any data resource.
// the fetched object is attached to the request object
// as req.user -> whatever we put as the second arg to done
passport.deserializeUser(function(id, done) {
  console.log('in deserializeUser');
  console.log(`id: ${id}`);
  let err = null;
  done(err, {username: 'e', password: 'e'});
});

// not needed for functionality, but nice to have
// so that we can see what cookies are set in the logfile
app.use(cookieParser());

// express-session is required because we have to have somewhere
// to store the link between the cookie in the browser and the
// key to get the user info on the server
// in other words, deserializeUser will never be able to work
// secret is required and the last two options have to be there
// otherwise, we get a deprecation warning...
app.use(session({ secret: 'key', // used to sign the session ID cookie
                  resave: false, // forces session to be saved, even if it didn't change
                  saveUninitialized: false, // forces an uninitialized session to be saved to the store
                })
        );

app.use(passport.initialize());
app.use(passport.session()); // be sure express-session is BEFORE passport-session
                            // to ensure that login session is restored in the correct order

// to protect certain routes, we need to apply some middleware
// I'm using a function called requireLogin
const requireLogin = function(req, res, next) {
  if(req.user) {
    next(); // we authenticate, so give the user what they want
  } else {
    // this is whatever we want to have happen if the user
    // is not authenticated.
    res.send('You do not have access yet. Try logging in.');
  }
}

// BEGIN ROUTES
app.use('/', auth);
app.use('/', extra);


app.listen(3000, () => {
  console.log('listen 3000');
})
