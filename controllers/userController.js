const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        next({
          name: "BadRequest",
          message: "Email and password must be filled",
        });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        next({
          name: "InvalidPassEmail",
          message: "Invalid email or password",
        });
        return;
      }
      const isValidPass = comparePassword(password, user.password);
      if (!isValidPass) {
        next({
          name: "InvalidPassEmail",
          message: "Invalid email or password",
        });
        return;
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController;
