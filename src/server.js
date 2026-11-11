require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDatabase, MONGODB_URI } = require("./db");
const cricketersRouter = require("./routes/cricketers");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).json({
      name: "Cricketers CRUD REST API",
      version: "1.0.0",
      database: "MongoDB",
      baseUrl: `http://localhost:${PORT}/api/cricketers`,
      endpoints: {
        list: "GET /api/cricketers",
        getById: "GET /api/cricketers/:id",
        create: "POST /api/cricketers",
        update: "PUT /api/cricketers/:id",
        remove: "DELETE /api/cricketers/:id"
      }
    });
  });

  app.use("/api/cricketers", cricketersRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Cricketers API running at http://localhost:${PORT}`);
    console.log(`MongoDB: ${MONGODB_URI}`);
    console.log(`Base URL: http://localhost:${PORT}/api/cricketers`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
