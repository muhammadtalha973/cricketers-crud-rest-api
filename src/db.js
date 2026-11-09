const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "cricketers.db");

let SQL;
let db;

function persist() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  persist();
}

function lastInsertId() {
  const row = queryOne("SELECT last_insert_rowid() AS id");
  return row ? row.id : null;
}

function mapCricketer(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    role: row.role,
    battingStyle: row.batting_style,
    matches: row.matches,
    runs: row.runs
  };
}

async function initDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS cricketers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      role TEXT NOT NULL,
      batting_style TEXT,
      matches INTEGER NOT NULL DEFAULT 0,
      runs INTEGER NOT NULL DEFAULT 0
    )
  `);

  const countRow = queryOne("SELECT COUNT(*) AS total FROM cricketers");
  if (countRow && countRow.total === 0) {
    const seed = [
      ["Babar Azam", "Pakistan", "Batsman", "Right-hand", 120, 5729],
      ["Virat Kohli", "India", "Batsman", "Right-hand", 292, 13848],
      ["Jos Buttler", "England", "Wicket-keeper", "Right-hand", 181, 4845]
    ];
    seed.forEach((player) => {
      db.run(
        `INSERT INTO cricketers (name, country, role, batting_style, matches, runs)
         VALUES (?, ?, ?, ?, ?, ?)`,
        player
      );
    });
  }

  persist();
  return { queryAll, queryOne, run, lastInsertId, mapCricketer };
}

module.exports = { initDatabase };
