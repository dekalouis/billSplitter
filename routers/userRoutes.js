// router/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// buat register
router.post("/register", userController.register);

// loginr
router.post("/login", userController.login);

// // getuser?
// router.get("/:id", userController.getUserById);

module.exports = router;
