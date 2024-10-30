const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('./users.db');

const SERVER_PORT = 3000

// Creăm tabelul pentru utilizatori, dacă nu există deja
db.run(`
    CREATE TABLE IF NOT EXISTS USERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tip VARCHAR(13) CHECK( tip IN ('utilizator','administrator') ) ,
        username VARCHAR(40),
        email VARCHAR(30),
        password VARCHAR(20),
        firstname VARCHAR(30),
        lastname VARCHAR(30),
        displayname VARCHAR(30),
        url VARCHAR(100),
        picture VARCHAR(100),
        profile_image_path VARCHAR(100),
        timpInregistrare VARCHAR(30)
    )
`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurare multer pentru stocarea imaginilor de profil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const username = req.body.username;
        const userDir = path.join(__dirname, 'uploads/profiles', username);

        // Creăm un director pentru fiecare utilizator, dacă nu există
        fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        // Salvează imaginea cu un nume unic
        const ext = path.extname(file.originalname);
        cb(null, `profile${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Doar fișiere de tip JPG, PNG și GIF sunt permise"));
        }
        cb(null, true);
    }
});


// Ruta pentru afișarea formularului de înregistrare
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta pentru procesarea înregistrării
app.post('/signup', upload.single('profileImage'), (req, res) => {
    const { username, email, password, first_name, last_name, display_name, website_url } = req.body;
    const profileImagePath = req.file ? req.file.path : null;

    // Stocăm utilizatorul în baza de date
    db.run(
        `INSERT INTO users (username, email, password, first_name, last_name, display_name, website_url, profileImagePath)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, email, password, first_name, last_name, display_name, website_url, profileImagePath],
        (err) => {
            if (err) {
                return res.status(500).send("A apărut o eroare în timpul înregistrării.");
            }
            res.send("Înregistrarea a fost realizată cu succes!");
        }
    );
});

const PORT = 3000;
app.listen(process.env.PORT || SERVER_PORT);