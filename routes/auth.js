const express = require('express');
const passport = require('passport');

let router = express.Router();

const requireLogin = function(req, res, next) {
  if(req.user) {
    next(); // we authenticate, so give the user what they want
  } else {
    // this is whatever we want to have happen if the user
    // is not authenticated.
    res.send('You do not have access yet. Try logging in.');
  }
}

// useful for seeing what req.user is and any cookies the browser sent to us
router.get('/', (req, res) => {
  console.log(req.cookies);
  // we might not always be authenticated, so an if is required
  if( req.user ) {
    console.log(`req.user: ${req.user}`);
    console.log(`req.user.username: ${req.user.username}`);
    console.log(`req.user.password: ${req.user.password}`);
    console.log(`req.session.passport.user: ${req.session.passport.user}`);
  }
  res.send('hello');
});

// send the login form to the user
router.get('/login', (req, res) => {
  res.sendFile('/Users/eabell/sandbox/passport-local-auth-example/public/login.html')
})

// this is where the login form posts to
// we can also tell passport where to go if login passed or failed
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                 })
);

// this is our protected route because of the requireLogin middleware
router.get('/secret', requireLogin, (req, res, next) => {
  res.send('you have reached the protect page!');
});


module.exports = router;
