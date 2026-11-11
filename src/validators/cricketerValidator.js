const mongoose = require("mongoose");
const { ALLOWED_ROLES } = require("../models/Cricketer");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function validateCricketer(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object."];
  }

  ["name", "country", "role"].forEach((field) => {
    if (body[field] === undefined) {
      errors.push(`"${field}" is required.`);
    }
  });

  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    errors.push('"name" must be a non-empty string.');
  }

  if (body.country !== undefined && !isNonEmptyString(body.country)) {
    errors.push('"country" must be a non-empty string.');
  }

  if (body.role !== undefined) {
    if (!isNonEmptyString(body.role) || !ALLOWED_ROLES.includes(body.role.trim())) {
      errors.push(`"role" must be one of: ${ALLOWED_ROLES.join(", ")}.`);
    }
  }

  if (body.battingStyle !== undefined && body.battingStyle !== null) {
    if (typeof body.battingStyle !== "string") {
      errors.push('"battingStyle" must be a string.');
    }
  }

  if (body.matches !== undefined && !isNonNegativeInteger(body.matches)) {
    errors.push('"matches" must be a non-negative integer.');
  }

  if (body.runs !== undefined && !isNonNegativeInteger(body.runs)) {
    errors.push('"runs" must be a non-negative integer.');
  }

  return errors;
}

function parseId(value) {
  if (typeof value !== "string" || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  const objectId = new mongoose.Types.ObjectId(value);
  if (String(objectId) !== value) {
    return null;
  }

  return objectId;
}

module.exports = { validateCricketer, parseId, ALLOWED_ROLES };
