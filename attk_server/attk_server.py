from flask import Flask, request
import logging
from datetime import datetime
from flask_cors import CORS

#Config logging
logging.basicConfig(
    filename='server.log',
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)
app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes
@app.route("/")
def hello_world():
    return "<p>Hai sa fugim aici: http://127.0.0.1:5000/api/data </p>"

@app.route("/api/data", methods=['OPTIONS', 'POST'])
def apiDate():
    if request.method == 'OPTIONS':
        return '', 200
    else:
        #Informatii la consola serverului
        print(f"[INFO] Received request to /api/date from {request.remote_addr}")
        print(f"Request Method (Metoda HTTP a cererii): {request.method}")
        print(f"Request Headers (Header-ele HTTP): {request.headers}")
        print(f"Query Parameters (request.args) (Parametrii URL-ului (query params) – perechi cheie valoare): "
              f"{request.args.to_dict()}")
        print(f"Form Data (request.form) (Conținutul cererii/body (rezultatul completarii unui formular)): "
              f"{request.form.to_dict()}")
        print(f"Uploaded Files (request.files) (Fisierele incarcate): {[f.filename for f in request.files.values()]}")
        print(f"Combined Data (request.values) (Informatiile din request.args si request.form): {request.values.to_dict()}")
        print(f"JSON Body (request.json) (Continutul cererii în format JSON (doar daca tipul media este application/json)): "
              f"{request.json}")
        print(f"Cookies (Cookie-urile trimise de catre client): {request.cookies}")

        #Logging info about req
        app.logger.info(f"---------------------------------------")
        app.logger.info(f"Request Method (Metoda HTTP a cererii): {request.method}")
        app.logger.info(f"Request Headers (Header-ele HTTP): {request.headers}")
        app.logger.info(f"Query Parameters (request.args) (Parametrii URL-ului (query params) – perechi cheie valoare): "
              f"{request.args.to_dict()}")
        app.logger.info(f"Form Data (request.form) (Conținutul cererii/body (rezultatul completarii unui formular)): "
              f"{request.form.to_dict()}")
        app.logger.info(f"Uploaded Files (request.files) (Fisierele incarcate): {[f.filename for f in request.files.values()]}")
        app.logger.info(f"Combined Data (request.values) (Informatiile din request.args si request.form): {request.values.to_dict()}")
        app.logger.info(f"JSON Body (request.json) (Continutul cererii în format JSON (doar daca tipul media este application/json)): "
              f"{request.json}")
        app.logger.info(f"Cookies (Cookie-urile trimise de catre client): {request.cookies}")
        app.logger.info(f"\n")

    return "Data logged successfully!", 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)