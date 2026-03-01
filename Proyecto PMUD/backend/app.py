from flask import Flask, request, jsonify, session
from flask_cors import CORS
from db import get_db, fetch_all, fetch_one
from datetime import date
import secrets


app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.secret_key = secrets.token_hex(32)
CORS(app, supports_credentials=True)

# -------- CONTINENTS --------
@app.route("/continents")
def get_continents():
    return jsonify(fetch_all("SELECT * FROM continents"))

# -------- COUNTRIES --------
@app.route("/countries/<continent_code>")
def get_countries(continent_code):
    return fetch_all(
        "SELECT * FROM countries WHERE continent_code=?",
        (continent_code,)
    )


# -------- LEAGUES --------
@app.route("/leagues/<country_code>")
def get_leagues(country_code):
    return fetch_all(
        "SELECT * FROM leagues WHERE country_code=?",
        (country_code,)
    )


# -------- TEAMS --------
@app.route("/teams/<league_id>")
def get_teams(league_id):
    return fetch_all(
        "SELECT * FROM teams WHERE league_id=?",
        (league_id,)
    )


# -------- LOGIN --------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = fetch_one(
        "SELECT id, name, email FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    )

    if user:
        session["user_id"] = user["id"]
        return jsonify(user)

    return {"error": "Credenciales incorrectas"}, 401

# -------- LOGOUT --------
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return {"status": "logged out"}

# -------- REGISTER --------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    if not data.get("email") or not data.get("password") or not data.get("name"):
        return {"error": "Faltan datos"}, 400

    exists = fetch_one(
        "SELECT id FROM users WHERE email=?",
        (data["email"],)
    )

    if exists:
        return {"error": "Email ya registrado"}, 409

    conn = get_db()
    conn.execute("""
        INSERT INTO users (name, country, email, password)
        VALUES (?, ?, ?, ?)
    """, (
        data["name"],
        data.get("country"),
        data["email"],
        data["password"]
    ))
    conn.commit()
    conn.close()

    return {"status": "user created"}, 201


# -------- FAVORITES --------
@app.route("/favorites")
def get_favorites():
    if "user_id" not in session:
        return {"error": "NOT_LOGGED"}, 401

    return fetch_all(
        "SELECT * FROM favorites WHERE user_id=?",
        (session["user_id"],)
    )

@app.route("/favorites", methods=["POST"])
def add_favorite():
    if "user_id" not in session:
        return {"error": "NOT_LOGGED"}, 401

    data = request.json

    fav_type = data["type"]
    league_id = data.get("externalId") if fav_type == "league" else None
    team_id = data.get("externalId") if fav_type == "team" else None

    conn = get_db()
    conn.execute("""
        INSERT OR IGNORE INTO favorites (user_id, type, league_id, team_id)
        VALUES (?, ?, ?, ?)
    """, (session["user_id"], fav_type, league_id, team_id))
    conn.commit()
    conn.close()

    return {"status": "ok"}, 201


@app.route("/favorites/<int:fav_id>", methods=["DELETE"])
def delete_favorite(fav_id):
    if "user_id" not in session:
        return {"error": "NOT_LOGGED"}, 401

    conn = get_db()
    conn.execute(
        "DELETE FROM favorites WHERE id=? AND user_id=?",
        (fav_id, session["user_id"])
    )
    conn.commit()
    conn.close()

    return {"status": "deleted"}


# -------- STANDINGS --------
@app.route("/standings/<league_id>/<int:season>")
def get_standings(league_id, season):
    return fetch_all(
        "SELECT * FROM standings WHERE league_id=? AND season=? ORDER BY position",
        (league_id, season)
    )

# -------- PARTIDOS --------
@app.route("/matches")
def get_matches():
    req_date = request.args.get("date")

    # 👉 si NO viene fecha → hoy
    if not req_date:
        req_date = date.today().isoformat()

    return fetch_all(
        "SELECT * FROM matches WHERE date=?",
        (req_date,)
    )

# -------- INFORMACIÓN LIGA --------
@app.route("/league/<league_id>")
def get_league_info(league_id):
    return fetch_one(
        "SELECT * FROM leagues WHERE id=?",
        (league_id,)
    )

# -------- EQUIPO ID --------
@app.route("/team/<team_id>")
def get_team(team_id):
    return fetch_one(
        "SELECT * FROM teams WHERE id=?",
        (team_id,)
    )



if __name__ == "__main__":
    app.run(debug=True)