const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./db");
const { createController } = require("./controllers/cricketersController");
const { createCricketersRouter } = require("./routes/cricketers");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

async function start() {
  const database = await initDatabase();
  const controller = createController(database);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).json({
      name: "Cricketers CRUD REST API",
      version: "1.0.0",
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

  app.use("/api/cricketers", createCricketersRouter(controller));
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Cricketers API running at http://localhost:${PORT}`);
    console.log(`Base URL: http://localhost:${PORT}/api/cricketers`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
