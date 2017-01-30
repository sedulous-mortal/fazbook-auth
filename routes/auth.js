const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/auth-helpers');
const passport = require('../auth/local');

router.get('/register', authHelpers.loginRedirect, (req, res) => {
    res.render('auth/register');
});

router.post('/register', (req, res, next) => {
    return authHelpers.createUser(req, res)
        .then((response) => {
            console.log('registration successful');
        })
        .catch((err) => {
            res.status(500).json({
                status: 'error'
            });
        });
});

//page to log in on
router.get('/login', authHelpers.loginRedirect, (req, res) => {
    res.render('auth/login');
});

//check if they are logged in
router.post('/login', passport.authenticate('local', {
    //if logged in, go to profile page
    successRedirect: '/user',
    //if not logged in, go to login page
    failureRedirect: '/auth/login',
    failureFlash: true
}));

//logout route
router.get('/logout', (req, res) => {
    //logs them out
    req.logout();
    //puts them back on the homepage
    res.redirect('/');
});

module.exports = router;