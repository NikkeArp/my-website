from flask import Flask
from flask import redirect, render_template, request, session, url_for
import hashlib
from os import urandom

app = Flask(__name__)

# ------------------------------------------------- #
#            Development properties                 #
# ------------------------------------------------- #
password = '460c3fa001ac44fb13bcd002358bde73ef6ab1dd19521aa4aca3404f11c7caff7f238da26975a0c4d8ae9a6fe94a52caf866ac02cd65f506d628d7f673564bca'
user = '9b2c112045357c3dfcc994c30fa6a9af2e07ce6b93b9cbc0bfbf0c039cad4d8f162876d6d2d1d84e9075f57621e798f6fef164e5aa28b21c8c09e7dcfa795e31'
admin_password = 'c4e2828a08ae8731a82e64a9d46736878201138643eaa30195519d90d1a90d70607e6a5ab506a68af225a6c2effc8c627fafe9afb58ffaf2aaa32bd504c2b4a7'
admin_user = 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec'


@app.route("/")
def index_page():
    return render_template("index.html")


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/account")
def account_page():
    return render_template("account.html")


@app.route("/admin")
def admin_page():
    return render_template("admin.html")


@app.route("/logout")
def logout():
    return redirect(url_for("index_page"))


@app.route("/playground")
def playground_page():
    return render_template("playground.html")


@app.route("/languages")
def language_page():
    return render_template("languages.html")


if __name__ == '__main__':
    app.secret_key = urandom(24)
    app.run(debug=True)
