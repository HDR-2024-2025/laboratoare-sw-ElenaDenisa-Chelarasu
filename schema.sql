-- schema.sql
-- Tabela utilizatori
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwd TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    displayName TEXT NOT NULL,
    websiteUrl TEXT,
    typeOf TEXT DEFAULT 'utilizator' NOT NULL,
    registrationTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profileImagePath TEXT,
    CONSTRAINT email_format CHECK (email LIKE '%@%.%'),
    CONSTRAINT username_format CHECK (length(username) >= 3 AND length(username) <= 20)
);

-- Indexuri pentru îmbunătățirea performanței căutărilor
-- CREATE INDEX IF NOT EXISTS idx_users_name ON users(firstName, lastName);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Inserare utilizator admin implicit (opțional)
INSERT OR IGNORE INTO users (
    username, 
    email, 
    passwd, 
    firstName, 
    lastName, 
    displayName, 
    typeOf
) VALUES (
    'admin',
    'admin@example.com',
    'admin123',  -- În producție ar trebui să fie un hash
    'Admin',
    'System',
    'Administrator',
    'administrator'
);