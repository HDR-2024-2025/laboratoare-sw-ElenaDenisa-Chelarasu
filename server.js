const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('./public/js/logger');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/api');

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
app.use('/api', authRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
