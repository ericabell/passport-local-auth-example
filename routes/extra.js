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

router.get('/extra/public', (req, res) => {
  res.send('extra public page.');
});

router.get('/extra/private', requireLogin, (req, res) => {
  res.send('extra protected page');
});

module.exports = router;
