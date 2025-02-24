"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemAllocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemAllocation.belongsTo(models.Item, { foreignKey: "ItemId" });
      // ItemAllocation belongs to Participant
      ItemAllocation.belongsTo(models.Participant, {
        foreignKey: "ParticipantId",
      });
    }
  }
  ItemAllocation.init(
    {
      allocatedQuantity: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.0,
        validate: {
          min: {
            args: 0.01,
            msg: "allocatedQuantity must be at least 0.01",
          },
          isDecimal: {
            msg: "allocatedQuantity must be a decimal value",
          },
        },
      },

      ParticipantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ItemAllocation",
    }
  );
  return ItemAllocation;
};
