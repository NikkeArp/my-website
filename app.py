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


@app.route("/login", methods=["POST", "GET"])
def login_page():
    try:
        if session["logged_in"]:
            return redirect(url_for("account/account_page"))
    except:
        pass

    try:
        password_hasher = hashlib.sha512()
        user_hasher = hashlib.sha512()

        password_hasher.update(request.form["password"])
        user_hasher.update(request.form["username"])

        if password_hasher.hexdigest() == password and user_hasher.hexdigest() == user:
            session["logged_in"] = True
            session["account_name"] = request.form["username"].capitalize()

            return redirect(url_for("account_page"))
        elif password_hasher.hexdigest() == admin_password and user_hasher.hexdigest() == admin_user:
            session["admin_logged_in"] = True
            return redirect(url_for("admin_page"))
        else:
            return render_template("internal/login.html")
    except:
        return render_template("internal/login.html")


@app.route("/account")
def account_page():
    return render_template("account/account.html")


@app.route("/admin")
def admin_page():
    return render_template("account/admin.html")


@app.route("/logout")
def logout():

    session["logged_in"] = False
    session["account_name"] = ""
    session["admin_logged_in"] = False

    return redirect(url_for("index_page"))


@app.route("/playground")
def playground_page():
    return render_template("internal/playground.html")


@app.route("/languages")
def language_page():
    return render_template("internal/languages.html")


@app.route("/media")
def media_page():
    return render_template("internal/media.html")


@app.route("/games")
def games():
    return render_template("internal/games.html")


@app.route("/games/dota")
def dota_page():
    return render_template("games/dota.html")


@app.route("/code")
def code_page():
    return render_template("internal/code.html")


@app.route("/editor")
def editor_page():
    return render_template("internal/editor.html")


if __name__ == '__main__':
    app.secret_key = urandom(24)
    app.run(debug=True)
