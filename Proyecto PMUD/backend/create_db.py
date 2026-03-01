import sqlite3

conn = sqlite3.connect("database.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS continents (
    code TEXT PRIMARY KEY,
    name TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name TEXT,
    flag TEXT,
    continent_code TEXT,
    FOREIGN KEY (continent_code) REFERENCES continents(code)
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS leagues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT,
    country_code TEXT NOT NULL,
    continent_code TEXT NOT NULL,
    logo TEXT,
    is_official INTEGER,
    troncal INTEGER,
    level TEXT
)
""")
cur.execute("""
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    league_id TEXT,
    name TEXT,
    full_name TEXT,
    short_name TEXT,
    country_code TEXT,
    shield TEXT,
    shield_big TEXT,
    flag TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS standings (
    league_id TEXT,
    season INTEGER,
    position INTEGER,
    team_name TEXT,
    points INTEGER,
    wins INTEGER,
    draws INTEGER,
    losses INTEGER,
    gf INTEGER,
    ga INTEGER,
    avg INTEGER,
    shield TEXT,
    PRIMARY KEY (league_id, season, position)
)
""")


cur.execute("""
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    date TEXT,
    hour TEXT,
    status INTEGER,
    league_id TEXT,
    local TEXT,
    visitor TEXT,
    local_shield TEXT,
    visitor_shield TEXT,
    result TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('league', 'team')) NOT NULL,
    league_id TEXT,
    team_id TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (league_id) REFERENCES leagues(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),

    UNIQUE(user_id, type, league_id, team_id)
)
""")

conn.commit()
conn.close()
print("Base de datos creada")