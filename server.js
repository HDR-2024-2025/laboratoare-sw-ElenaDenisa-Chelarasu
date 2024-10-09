const express = require("express");
const path = require("path");
const collection = require("./src/config.js");
const bcrypt = require('bcrypt');
// const sqlite3 = require('sqlite3').verbose();

// const routes = require("./src/routes/routes");

const SERVER_PORT = 3000

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));


app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')

app.get("/", (req, res) => {
    res.render("signup");
});

// let db = new sqlite3.Database('./db/utilizatori.db', (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Connected to the utilizatori database.');
// });

app.listen(process.env.PORT || SERVER_PORT);

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });