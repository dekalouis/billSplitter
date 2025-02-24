"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bill.belongsTo(models.User, { foreignKey: "createdBy" });
      Bill.hasMany(models.Item, { foreignKey: "BillId" });
      Bill.hasMany(models.Participant, { foreignKey: "BillId" });
    }
  }
  Bill.init(
    {
      billImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Must be a valid URL",
          },
          // notEmpty: {
          //   msg: "URL cannot be empty",
          // },
          // notNull: {
          //   msg: "URL cannot be empty",
          // },
        },
      },
      vatRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: {
            args: 0,
            msg: "VAT rate cannot be negative",
          },
          max: {
            args: 100,
            msg: "VAT rate cannot exceed 100%",
          },
          isDecimal: {
            msg: "VAT rate must be a decimal",
          },
        },
      },

      serviceChargeRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: {
            args: 0,
            msg: "Service charge rate cannot be negative",
          },
          max: {
            args: 100,
            msg: "Service charge rate cannot exceed 100%",
          },
          isDecimal: {
            msg: "Service charge rate must be a decimal",
          },
        },
      },
      vatAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: {
            args: 0,
            msg: "VAT amount cannot be negative",
          },
          isInt: {
            msg: "VAT amount must be an integer",
          },
        },
      },

      serviceChargeAmt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: {
            args: 0,
            msg: "Service charge amount cannot be negative",
          },
          isInt: {
            msg: "Service charge amount must be an integer",
          },
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bill",
    }
  );
  return Bill;
};
