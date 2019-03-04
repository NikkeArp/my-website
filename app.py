from flask import Flask
from flask import redirect, render_template, request, session, url_for
import hashlib
from os import urandom

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.secret_key = urandom(24)
    app.run(debug=True)
