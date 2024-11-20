// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const app = express();

// Configurare multer pentru upload imagini
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile-images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB max
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Doar imaginile sunt permise!'));
        }
        cb(null, true);
    }
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rută de login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await db.login(username, password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// Ruta pentru înregistrare
app.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        // Destructure and validate input
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            displayName,
            websiteUrl
        } = req.body;

        // Validate server side
        if (!username || !email || !password || !firstName || !lastName || !displayName) {
            return res.status(400).json({ error: 'Toate câmpurile obligatorii sunt necesare' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Format email invalid' });
        }

        // Username validation (3-20 characters, alphanumeric and underscores)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ 
                error: 'Numele de utilizator trebuie să aibă între 3-20 caractere, doar litere, cifre și underscores' 
            });
        }

        // Optional website URL validation
        if (websiteUrl && websiteUrl.trim() !== '') {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlRegex.test(websiteUrl)) {
                return res.status(400).json({ error: 'URL website invalid' });
            }
        }

        // Prepare profile image path
        const profileImagePath = req.file ? req.file.path : null;

        // SQL to insert user
        const sql = `INSERT INTO users (
            username, email, passwd, firstName, lastName, 
            displayName, websiteUrl, profileImagePath
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute insertion
        const result = await db.run(sql, [
            username,
            email,
            password,
            firstName,
            lastName,
            displayName,
            websiteUrl,
            profileImagePath
        ]);

        res.status(201).json({ 
            message: "Utilizator înregistrat cu succes!",
            userId: result.id 
        });
    } catch (err) {
        // Handle potential duplicate username/email
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Utilizator sau email deja existente' });
        }
        
        // Generic error handler
        res.status(400).json({ error: err.message });
    }
});

// Ruta pentru căutare utilizatori
app.get('/cauta', async (req, res) => {
    try {
        const numeCautat = req.query.nume;
        const sql = `SELECT username, firstName, lastName, displayName, profileImagePath 
                    FROM users 
                    WHERE firstName LIKE ? OR lastName LIKE ?`;
        
        const users = await db.all(sql, [`%${numeCautat}%`, `%${numeCautat}%`]);
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Gestiune erori
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'A apărut o eroare!' });
});

// Închidere grațioasă a conexiunii la baza de date
process.on('SIGINT', async () => {
    try {
        await db.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database:', err);
        process.exit(1);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});