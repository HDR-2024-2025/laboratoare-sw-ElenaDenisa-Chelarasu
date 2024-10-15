CREATE DATABASE sw_db;
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
	timpInregistrare VARCHAR(30),
);
