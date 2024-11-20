// db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// probleme de securitate: 
// Plaintext password storage
// No password hashing
// Weak authentication
// Simple token generation

class Database {
    constructor() {
        this.db = new sqlite3.Database('users.db', (err) => {
            if (err) {
                console.error('Error connecting to database:', err);
            } else {
                console.log('Connected to database successfully');
                this.initializeDatabase();
            }
        });
    }

    initializeDatabase() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        
        fs.readFile(schemaPath, 'utf8', (err, schema) => {
            if (err) {
                console.error('Error reading schema file:', err);
                return;
            }

            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('Error initializing database:', err);
                } else {
                    console.log('Database initialized successfully');
                }
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async login(username, password) {
        const sql = 'SELECT id, username FROM users WHERE username = ? AND passwd = ?';
        
        return new Promise((resolve, reject) => {
            this.db.get(sql, [username, password], (err, user) => {
                if (err) {
                    reject(err);
                } else if (!user) {
                    reject(new Error('Utilizator sau parolă incorectă'));
                } else {
                    resolve({ 
                        token: 'dummy_token', 
                        user: { 
                            id: user.id, 
                            username: user.username 
                        } 
                    });
                }
            });
        });
    }
}

module.exports = new Database();