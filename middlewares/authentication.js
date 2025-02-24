const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/");

const authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      next({
        name: "Forbidden",
        message: "Please login first",
      });
      return;
    }

    const token = bearerToken.split(" ")[1];

    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      next({
        name: "Forbidden",
        message: "Please login first",
      });
      return;
    }

    // console.log(user.id, decoded.id);
    // if (user.id !== decoded.id) {
    //   next({
    //     name: "Forbidden",
    //     message: "You cannot access other user's data",
    //   });
    //   return;
    // }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
