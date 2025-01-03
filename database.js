// db.js
const sqlite3 = require('sqlite3').verbose();
const dbName = 'users.db';

const logger = require('./public/js/logger');

let db = new sqlite3.Database(dbName, (err) => {
    if(err){
        console.error(err.message);
    }
    else {
        logger.info(`Connected to the database.`);
        db.run(
            'CREATE TABLE IF NOT EXISTS users ( \
                id INTEGER PRIMARY KEY AUTOINCREMENT, \
                username TEXT UNIQUE NOT NULL, \
                email TEXT UNIQUE NOT NULL, \
                passwd TEXT NOT NULL, \
                firstName TEXT NOT NULL,\
                lastName TEXT NOT NULL,\
                displayName TEXT NOT NULL,\
                websiteUrl TEXT, \
                typeOf TEXT DEFAULT \'utilizator\' NOT NULL,\
                registrationTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,\
                profileImagePath TEXT,\
                CONSTRAINT email_format CHECK (email LIKE \'%@%.%\'), \
                CONSTRAINT username_format CHECK (length(username) >= 3 AND length(username) <= 20)\
            );', (err) => {
                if(err){
                    logger.critical(`Redirecting to login page: Database error: ${err.message}`);
                }
                else {
                    logger.info(`Table created or existed.`);
                }
            }
        )
    }
});

module.exports = db;