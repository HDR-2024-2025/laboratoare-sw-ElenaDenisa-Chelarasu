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

// Lab - 4 + updated at lab 6
router.get('/cauta', (req, res) => {
    // Preluam parametrul 'q' din query string
    const queryParam = req.query.q || '';

    // const searchName = req.query.nume || ''; //Search parameter // With sanitiastion
    // Directly inject user input into the SQL query
    const sql = `SELECT firstName, lastName FROM users WHERE firstName LIKE '%${req.query.nume}%'`;

    logger.info(`Searching for: ${req.query.nume}`, {
        method: req.method,
        route: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        statusCode: res.statusCode
    });

    //Cautam utilizatori in baza de date
    db.all(sql, (err, rows) => {
        if (err) {
            logger.error(`Redirecting to login page: Database error: ${err.message}`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            return res.redirect('/api/login');
        }

        //Rending found stuff
        logger.info(`Rendering cauta page`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.render('cauta', {
            searchParameter: { name: req.query.nume },
            foundPeople: rows,
            qq: queryParam
        });
    });
});

// Lab - 5
router.get('/trigger-attack', (req, res) => {
    logger.info(`Redirecting to trigger attack page`, {
        method: req.method,
        route: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        statusCode: res.statusCode
    });
    res.render('trigger-attack');
});


module.exports = router;
