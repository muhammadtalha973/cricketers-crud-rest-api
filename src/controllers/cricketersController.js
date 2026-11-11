const { Cricketer } = require("../models/Cricketer");
const { validateCricketer, parseId } = require("../validators/cricketerValidator");

function toCricketer(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    name: doc.name,
    country: doc.country,
    role: doc.role,
    battingStyle: doc.battingStyle || null,
    matches: doc.matches,
    runs: doc.runs
  };
}

function invalidIdResponse(res) {
  return res.status(400).json({
    error: "Invalid ID",
    message: "Cricketer ID must be a valid MongoDB ObjectId."
  });
}

function notFoundResponse(res, id) {
  return res.status(404).json({
    error: "Not Found",
    message: `No cricketer found with id ${id}.`
  });
}

async function listCricketers(req, res, next) {
  try {
    const docs = await Cricketer.find().sort({ _id: 1 });
    return res.status(200).json(docs.map(toCricketer));
  } catch (error) {
    return next(error);
  }
}

async function getCricketer(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return invalidIdResponse(res);
    }

    const doc = await Cricketer.findById(id);
    if (!doc) {
      return notFoundResponse(res, req.params.id);
    }

    return res.status(200).json(toCricketer(doc));
  } catch (error) {
    return next(error);
  }
}

async function createCricketer(req, res, next) {
  try {
    const errors = validateCricketer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request body.",
        details: errors
      });
    }

    const created = await Cricketer.create({
      name: req.body.name.trim(),
      country: req.body.country.trim(),
      role: req.body.role.trim(),
      battingStyle: req.body.battingStyle ? String(req.body.battingStyle).trim() : null,
      matches: req.body.matches === undefined ? 0 : req.body.matches,
      runs: req.body.runs === undefined ? 0 : req.body.runs
    });

    return res.status(201).json(toCricketer(created));
  } catch (error) {
    return next(error);
  }
}

async function updateCricketer(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return invalidIdResponse(res);
    }

    const existing = await Cricketer.findById(id);
    if (!existing) {
      return notFoundResponse(res, req.params.id);
    }

    const errors = validateCricketer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request body.",
        details: errors
      });
    }

    existing.name = req.body.name.trim();
    existing.country = req.body.country.trim();
    existing.role = req.body.role.trim();
    existing.battingStyle = req.body.battingStyle ? String(req.body.battingStyle).trim() : null;
    existing.matches = req.body.matches === undefined ? existing.matches : req.body.matches;
    existing.runs = req.body.runs === undefined ? existing.runs : req.body.runs;

    await existing.save();
    return res.status(200).json(toCricketer(existing));
  } catch (error) {
    return next(error);
  }
}

async function deleteCricketer(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return invalidIdResponse(res);
    }

    const existing = await Cricketer.findById(id);
    if (!existing) {
      return notFoundResponse(res, req.params.id);
    }

    await Cricketer.deleteOne({ _id: id });
    return res.status(200).json({
      message: `Cricketer with id ${req.params.id} was deleted.`,
      deleted: toCricketer(existing)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCricketers,
  getCricketer,
  createCricketer,
  updateCricketer,
  deleteCricketer
};
