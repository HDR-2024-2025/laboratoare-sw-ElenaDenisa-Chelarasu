//server.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const logger = require("./public/js/logger");

//Lab11
const https = require('https');
const fs = require('fs');

//Lab9
var memoryStore = new session.MemoryStore();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/api");

const app = express();

app.use(
  session({
    secret: "marelboEsteUnMagazinDePosete",
    resave: false,
    saveUninitialized: false,
  })
);

//Lab9
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = require('./public/js/keycloakConfig').initKeycloak(memoryStore);
app.use(keycloak.middleware());

//Lab9
app.get('/private', keycloak.protect(), (req, res) => {
  res.send('<h1>Welcome to the private area!</h1>');
});

//Set up private and public key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate
};

//HTTPS server
const httpsServer = https.createServer(credentials, app);

// Set up middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", authRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4567;
httpsServer.listen(PORT, () => {
  logger.info(`Server running on https://localhost:${PORT}`);
});