const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
// const billRoutes = require("./billRoutes");
// const itemRoutes = require("./itemRoutes");
// const participantRoutes = require("./participantRoutes");
// const allocationRoutes = require("./allocationRoutes");
const errorHandler = require("../middlewares/errorHandler");

router.get("/", (req, res) => {
  res.send("Dunia gelap!");
});

router.use("/users", userRoutes);
// router.use("/bills", billRoutes);
// router.use("/items", itemRoutes);
// router.use("/participants", participantRoutes);
// router.use("/allocations", allocationRoutes);

router.use(errorHandler);

module.exports = router;
