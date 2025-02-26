function errorHandler(err, req, res, next) {
  console.log(err);

  switch (err.name) {
    case "NotFound":
      res.status(404).json({ message: err.message });
      break;

    case "InvalidPassEmail":
      // email pass salah
      res.status(401).json({ message: err.message });
      break;

    case "SequelizeValidationError":
      // field ga lengkap (sequelize)
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeForeignKeyConstraintError":
      // sequelize untuk object yang harus ada di table
      res.status(400).json({ message: err.message });
    case "SequelizeUniqueConstraintError":
      // sequelize untuk object yang harus unique
      res.status(400).json({ message: err.errors[0].message });
      break;

    case "BadRequest":
      // password/email ga diisi
      res.status(400).json({ message: err.message });
      break;

    case "Forbidden":
      // kalau tokennya salah
      res.status(403).json({ message: err.message });
      break;

    case "Unauthorized":
      // Not sure
      res.status(401).json({ message: err.message });
      break;

    case "JsonWebTokenError":
      // kalau tokennya salah saat nyoba activity CRUD
      res.status(401).json({ message: "Invalid token" });
      break;

    default:
      res.status(500).json({ message: "Internal Server Error." });
      break;
  }
}

module.exports = errorHandler;
