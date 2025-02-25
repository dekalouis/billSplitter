// router/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

// buat register
router.post("/register", UserController.register);

// loginr
router.post("/login", UserController.login);

// getuser?
router.get("/:id", authentication, UserController.getUserById);

module.exports = router;
