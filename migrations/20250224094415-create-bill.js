"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bills", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      billImageUrl: {
        type: Sequelize.STRING,
      },
      vatRate: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      serviceChargeRate: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      vatAmount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      serviceChargeAmt: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bills");
  },
};
