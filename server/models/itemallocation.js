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
      isAllocated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
