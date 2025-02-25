"use strict";

const fs = require("fs");
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = JSON.parse(fs.readFileSync("./db/users.json", "utf-8")).map(
      (user) => {
        delete user.id;
        user.password = hashPassword(user.password);
        return {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    );
    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
