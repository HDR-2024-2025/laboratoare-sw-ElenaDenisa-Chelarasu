const express = require('express');
const router = express.Router();
const db = require('../database');
// const { isAuthenticated } = require('./auth');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        console.log('req.session.user', req.session.user)
        next(); // Utilizatorul este autentificat
    } else {
        res.redirect('/auth/login'); // Redirecționăm către pagina de login
    };
};

// Get home page
router.get('/', isAuthenticated, (req, res) => {
    const userdId = req.session.user.id;
    const sql = `SELECT username, email, firstName, lastName, displayName, websiteUrl, profileImagePath FROM users WHERE id = ?`;
    db.get(sql, [userdId], (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect('/auth/login');
        }

        // Rendem pagina index cu informațiile utilizatorului
        res.render('index', { user });
    });
});


module.exports = router;