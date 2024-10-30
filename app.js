const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

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
        timpInregistrare VARCHAR(30)
    )
`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta pentru afișarea formularului de înregistrare
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta pentru procesarea înregistrării
app.post('/signup', (req, res) => {
    const { username, email, password, first_name, last_name, display_name, website_url } = req.body;

    // Stocăm utilizatorul în baza de date
    db.run(
        `INSERT INTO users (username, email, password, first_name, last_name, display_name, website_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, email, password, first_name, last_name, display_name, website_url],
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