require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDatabase, MONGODB_URI, safeMongoUri } = require("./db");
const cricketersRouter = require("./routes/cricketers");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    const host = req.get("host");
    const protocol = host && !host.includes("localhost") ? "https" : req.protocol;
    const origin = `${protocol}://${host}`;
    res.status(200).json({
      name: "Cricketers CRUD REST API",
      version: "1.0.0",
      database: "MongoDB",
      baseUrl: `${origin}/api/cricketers`,
      endpoints: {
        list: "GET /api/cricketers",
        getById: "GET /api/cricketers/:id",
        create: "POST /api/cricketers",
        update: "PUT /api/cricketers/:id",
        remove: "DELETE /api/cricketers/:id"
      }
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/cricketers", cricketersRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cricketers API running on port ${PORT}`);
    console.log(`MongoDB: ${safeMongoUri(MONGODB_URI)}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
