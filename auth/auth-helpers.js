const bcrypt = require('bcryptjs');

const models = require('../db/models/index');

function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}

function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json({
        status: 'You are already logged in'
    });

    return next();
}

function createUser(req, res) {
    //encrypt password
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    //insert user into users table
    return models.User.create({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        dob: req.body.dob
    }).then(() => {
        //redirect to homepage
        res.redirect('/');
    });
}

// redirects users that aren't logged in
//gives error message if they are logged out
//calls next() to redirect them to user profile page if logged in
function loginRequired(req, res, next) {
    if (!req.user) return res.status(401).json({
        status: 'Please log in'
    });

    return next();
}

//do exports to avoid bugs!
module.exports = {
    comparePass,
    loginRedirect,
    loginRequired,
    createUser
}