// router/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

// buat register
router.post("/register", UserController.register);

// loginr
router.post("/login", UserController.login);

//google
router.post("/login/google", UserController.googleLogin);

// getuser?
// router.get("/:id", authentication, UserController.getUserById);

module.exports = router;
