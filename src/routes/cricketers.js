const express = require("express");
const controller = require("../controllers/cricketersController");

const router = express.Router();

router.get("/", controller.listCricketers);
router.get("/:id", controller.getCricketer);
router.post("/", controller.createCricketer);
router.put("/:id", controller.updateCricketer);
router.delete("/:id", controller.deleteCricketer);

module.exports = router;
