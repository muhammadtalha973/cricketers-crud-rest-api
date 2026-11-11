const mongoose = require("mongoose");
const { Cricketer } = require("./models/Cricketer");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cricketers_api";

const SEED_PLAYERS = [
  {
    name: "Babar Azam",
    country: "Pakistan",
    role: "Batsman",
    battingStyle: "Right-hand",
    matches: 120,
    runs: 5729
  },
  {
    name: "Virat Kohli",
    country: "India",
    role: "Batsman",
    battingStyle: "Right-hand",
    matches: 292,
    runs: 13848
  },
  {
    name: "Jos Buttler",
    country: "England",
    role: "Wicket-keeper",
    battingStyle: "Right-hand",
    matches: 181,
    runs: 4845
  }
];

function safeMongoUri(uri) {
  return uri.replace(/\/\/([^:@/]+):([^@/]+)@/, "//$1:***@");
}

async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);

  const count = await Cricketer.countDocuments();
  if (count === 0) {
    await Cricketer.insertMany(SEED_PLAYERS);
    console.log("Seeded sample cricketer records.");
  }
}

module.exports = { connectDatabase, MONGODB_URI, safeMongoUri };
