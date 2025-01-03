//index.js

const express = require('express');
const router = express.Router();
const db = require('../database');

const logger = require('../public/js/logger');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        logger.info(`isAuthenticated: req.session.user: ${req.session.user}`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        next(); //User authenticated
    } else {
        logger.warn(`Redirecting to profile page: User not authenticated`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.redirect('/api/login');
    };
};

// Get home page
router.get('/', isAuthenticated, (req, res) => {
    const userdId = req.session.user.id;
    const sql = `SELECT username, email, firstName, lastName, displayName, websiteUrl, profileImagePath FROM users WHERE id = ?`;
    db.get(sql, [userdId], (err, user) => {
        if (err) {
            logger.critical(`Redirecting to login page: Database error: ${err.message}`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            return res.redirect('/api/login');
        }

        //Render profile page
        logger.info(`Redirecting to profile page`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.render('index', { user });
    });
});

module.exports = router;
