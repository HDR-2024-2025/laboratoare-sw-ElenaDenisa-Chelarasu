//api.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');

const logger = require('../public/js/logger');

const router = express.Router();


// multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/profileImages')); // saving directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type not supported! Upload only an image.'));
        }
    }
});

router.get('/login', (req, res, next) => {
    logger.info('Login page', {
        method: req.method,
        route: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        statusCode: res.statusCode
    });
    res.render('login');
});

//Lab 8
router.post('/login', (req, res, next) => {
    //Validation:
    if (!req.body.username || !req.body.password) {
        logger.warn(`Redirecting to login page: Missing credentials`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        return res.redirect('/api/login?error=Missing credentials');
    };

    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        db.get(sql, [req.body.username], async (err, user) => {
            if (err || !user) {
                logger.warn(`Redirecting to login page: Invalid username or password`, {
                    method: req.method,
                    route: req.originalUrl || req.url,
                    ip: req.ip || req.connection.remoteAddress,
                    statusCode: res.statusCode
                });
                return res.redirect('/api/login?error=Invalid username or password');
            };

            //Verify password
            const passwordsMatch = req.body.password === user.passwd; // Daca parolele NU sunt hash-uite

            if (!passwordsMatch) {
                logger.warn(`Redirecting to login page: Invalid username or password`, {
                    method: req.method,
                    route: req.originalUrl || req.url,
                    ip: req.ip || req.connection.remoteAddress,
                    statusCode: res.statusCode
                });
                return res.redirect('/api/login?error=Invalid username or password');
            };

            //Saving user data in session
            req.session.user = {
                id: user.id,
                username: user.username
            };

            //Redirect to profile page
            logger.info('Redirecting to profile page', {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            res.redirect('/');
        })
    } catch(e){
        logger.warn(`Redirecting to login page: Server error: ${err.message}`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.redirect('/api/login?error=Server error');
    };
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});


router.post('/signup', upload.single('profileImage'), (req, res, next) => {
    try {

        //Password validation
        if (req.body.password !== req.body.confirmPassword) {
            logger.warn(`Redirecting to signup page: Passwords do not match`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            return res.redirect('/api/signup?error=Passwords do not match');
        }

        //Filling of required fields validation
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.displayName) {
            logger.warn(`Redirecting to signup page: Missing required fields`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            return res.redirect('/api/signup?error=Missing required fields');
        }

        let profileImagePath = null;
        if (req.file) {
            profileImagePath = req.file.path; //Path of saved file
        }

        // SQL to insert user
        const sql = `INSERT INTO users (
            username, email, passwd, firstName, lastName, 
            displayName, websiteUrl, profileImagePath
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute insertion
        db.run(sql, [
            req.body.username, 
            req.body.email,
            req.body.password,
            req.body.firstName,
            req.body.lastName,
            req.body.displayName,
            req.body.websiteUrl,
            req.body.profileImagePath
        ], function(err) {
            if (err) {
                logger.error(`Redirecting to signup page: Database error: ${err.message}`);
                logger.error(`Redirecting to signup page: Database error: ${err.message}`, {
                    method: req.method,
                    route: req.originalUrl || req.url,
                    ip: req.ip || req.connection.remoteAddress,
                    statusCode: res.statusCode
                });
                return res.redirect('/api/signup?error=Database error');
            }

            //Success
            logger.info(`New user created`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            res.redirect('/');
        });

    } catch (e) {
        logger.error(`Redirecting to signup page: Server error: ${err.message}`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.redirect('/api/signup?error=Server error');
    };
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            logger.error(`Redirecting to login page: ${err.message}`, {
                method: req.method,
                route: req.originalUrl || req.url,
                ip: req.ip || req.connection.remoteAddress,
                statusCode: res.statusCode
            });
            return res.redirect('/');
        };

        logger.info(`Logout successful.`, {
            method: req.method,
            route: req.originalUrl || req.url,
            ip: req.ip || req.connection.remoteAddress,
            statusCode: res.statusCode
        });
        res.clearCookie('connect.sid');
        res.redirect('/api/login');
    });
});

//Lab - 5
router.get('/date', (req, res, next) => {
    res.render('signup');
});
module.exports = router;
