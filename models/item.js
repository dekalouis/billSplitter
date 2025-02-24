"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Bill, { foreignKey: "BillId" });
      Item.belongsToMany(models.Participant, {
        through: models.ItemAllocation,
        foreignKey: "ItemId",
      });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Item name cannot be empty",
          },
          notNull: { msg: "Item name cannot be empty" },
        },
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: 1,
            msg: "Quantity cannot be less than 1",
          },
          isInt: {
            msg: "Quantity must be an integer",
          },
        },
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 0,
            msg: "Price cannot be negative",
          },
          isInt: {
            msg: "Price must be an integer",
          },
        },
      },

      BillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
