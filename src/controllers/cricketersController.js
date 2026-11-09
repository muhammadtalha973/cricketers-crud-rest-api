const { validateCricketer, parseId } = require("../validators/cricketerValidator");

function createController(database) {
  const { queryAll, queryOne, run, lastInsertId, mapCricketer } = database;

  function getByIdFromDb(id) {
    const row = queryOne("SELECT * FROM cricketers WHERE id = ?", [id]);
    return mapCricketer(row);
  }

  function listCricketers(req, res) {
    const rows = queryAll("SELECT * FROM cricketers ORDER BY id ASC");
    const cricketers = rows.map(mapCricketer);
    return res.status(200).json(cricketers);
  }

  function getCricketer(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Cricketer ID must be a positive integer."
      });
    }

    const cricketer = getByIdFromDb(id);
    if (!cricketer) {
      return res.status(404).json({
        error: "Not Found",
        message: `No cricketer found with id ${id}.`
      });
    }

    return res.status(200).json(cricketer);
  }

  function createCricketer(req, res) {
    const errors = validateCricketer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request body.",
        details: errors
      });
    }

    const name = req.body.name.trim();
    const country = req.body.country.trim();
    const role = req.body.role.trim();
    const battingStyle = req.body.battingStyle ? String(req.body.battingStyle).trim() : null;
    const matches = req.body.matches === undefined ? 0 : req.body.matches;
    const runs = req.body.runs === undefined ? 0 : req.body.runs;

    run(
      `INSERT INTO cricketers (name, country, role, batting_style, matches, runs)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, country, role, battingStyle, matches, runs]
    );

    const created = getByIdFromDb(lastInsertId());
    return res.status(201).json(created);
  }

  function updateCricketer(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Cricketer ID must be a positive integer."
      });
    }

    const existing = getByIdFromDb(id);
    if (!existing) {
      return res.status(404).json({
        error: "Not Found",
        message: `No cricketer found with id ${id}.`
      });
    }

    const errors = validateCricketer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request body.",
        details: errors
      });
    }

    const name = req.body.name.trim();
    const country = req.body.country.trim();
    const role = req.body.role.trim();
    const battingStyle = req.body.battingStyle ? String(req.body.battingStyle).trim() : null;
    const matches = req.body.matches === undefined ? existing.matches : req.body.matches;
    const runs = req.body.runs === undefined ? existing.runs : req.body.runs;

    run(
      `UPDATE cricketers
       SET name = ?, country = ?, role = ?, batting_style = ?, matches = ?, runs = ?
       WHERE id = ?`,
      [name, country, role, battingStyle, matches, runs, id]
    );

    return res.status(200).json(getByIdFromDb(id));
  }

  function deleteCricketer(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Cricketer ID must be a positive integer."
      });
    }

    const existing = getByIdFromDb(id);
    if (!existing) {
      return res.status(404).json({
        error: "Not Found",
        message: `No cricketer found with id ${id}.`
      });
    }

    run("DELETE FROM cricketers WHERE id = ?", [id]);
    return res.status(200).json({
      message: `Cricketer with id ${id} was deleted.`,
      deleted: existing
    });
  }

  return {
    listCricketers,
    getCricketer,
    createCricketer,
    updateCricketer,
    deleteCricketer
  };
}

module.exports = { createController };
