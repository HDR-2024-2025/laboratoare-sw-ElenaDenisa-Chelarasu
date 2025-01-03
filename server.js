const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database');


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();


app.use(session({
    secret: 'marelboEsteUnMagazinDePosete',
    resave: false,
    saveUninitialized: false
}));


// Set up middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || 3000);
