const express = require('express');
const router = express.Router();
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
    res.render('index', { username: req.session.user.username });
});


module.exports = router;