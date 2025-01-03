const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');

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
    res.render('login');
});

router.post('/login', (req, res, next) => {
    // Validare câmpuri
    if (!req.body.username || !req.body.password) {
        return res.redirect('/auth/login?error=Missing credentials');
    };

    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        db.get(sql, [req.body.username], async (err, user) => {
            if (err || !user) {
                return res.redirect('/auth/login?error=Invalid username or password');
            };

            // Verificăm parola
            // const passwordsMatch = await bcrypt.compare(password, user.passwd); // Dacă parolele sunt hash-uite
            const passwordsMatch = req.body.password === user.passwd; // Daca parolele NU sunt hash-uite

            if (!passwordsMatch) {
                return res.redirect('/auth/login?error=Invalid username or password');
            };

            // Salvăm informațiile utilizatorului în sesiune
            req.session.user = {
                id: user.id,
                username: user.username
            };

            // Redirecționăm către pagina principală
            res.redirect('/');
        })
    } catch(e){
        console.error(e);
        res.redirect('/auth/login?error=Server error');
    }
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});


router.post('/signup', upload.single('profileImage'), (req, res, next) => {
    try {

        // Validare parole
        if (req.body.password !== req.body.confirmPassword) {
            return res.redirect('/auth/signup?error=Passwords do not match');
        }

        // Validare câmpuri obligatorii
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.displayName) {
            return res.redirect('/auth/signup?error=Missing required fields');
        }

        // Procesare imagine
        let profileImagePath = null;
        if (req.file) {
            profileImagePath = req.file.path; // Calea fișierului salvat
        }

        // SQL to insert user
        const sql = `INSERT INTO users (
            username, email, passwd, firstName, lastName, 
            displayName, websiteUrl, profileImagePath
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute insertion
        db.run(sql, [
            req.body.username, 
            req.body.email,req.body.password,req.body.firstName,
            req.body.lastName,req.body.displayName,req.body.websiteUrl,
            req.body.profileImagePath
        ], function(err) {
            if (err) {
                console.error(err);
                return res.redirect('/auth/signup?error=Database error');
            }

            // Înregistrare cu succes
            res.redirect('/');
        });

    } catch (e) {
        console.error(e);
        res.redirect('/auth/signup?error=Server error');
    };
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.err(err);
            return res.redirect('/');
        };

        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    })
})

module.exports = router;
