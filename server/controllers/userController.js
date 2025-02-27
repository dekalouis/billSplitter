const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

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

  static async googleLogin(req, res, next) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      //jika belum registrasi langsung
      let user = await User.findOne({ where: { email: payload.email } });
      if (!user) {
        user = await User.create(
          {
            email: payload.email,
            password: Math.random().toString(),
          },
          {
            hooks: false,
          }
        );
      }
      //jika sudah langsung token
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });

      // console.log(payload, `PAYLOADNYA`);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const userId = req.params.id;

      if (req.user.id !== parseInt(userId)) {
        next({
          name: "Forbidden",
          message: "You cannot access other user's data",
        });
        return;
      }

      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password"],
        },
      });
      if (!user) {
        next({
          name: "NotFound",
          message: "User not found",
        });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController;
