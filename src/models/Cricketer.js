const mongoose = require("mongoose");

const ALLOWED_ROLES = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

const cricketerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ALLOWED_ROLES
    },
    battingStyle: { type: String, default: null, trim: true },
    matches: { type: Number, default: 0, min: 0 },
    runs: { type: Number, default: 0, min: 0 }
  },
  { versionKey: false }
);

cricketerSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  }
});

const Cricketer = mongoose.model("Cricketer", cricketerSchema);

module.exports = { Cricketer, ALLOWED_ROLES };
