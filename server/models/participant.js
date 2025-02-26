"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participant.belongsTo(models.Bill, { foreignKey: "BillId" });
      Participant.belongsToMany(models.Item, {
        through: models.ItemAllocation,
        foreignKey: "ParticipantId",
      });
    }
  }
  Participant.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Participant name cannot be empty",
          },
          notNull: {
            msg: "Participant name cannot be empty",
          },
        },
      },

      BillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Bills",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
