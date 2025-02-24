const { User } = require("../models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

class UserController {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
        message: "Successful registration!",
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController;
