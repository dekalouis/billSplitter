"use strict";
const fs = require("fs");
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
    const bills = JSON.parse(fs.readFileSync("./db/bills.json", "utf-8")).map(
      (bill) => {
        delete bill.id;
        return {
          ...bill,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    );
    await queryInterface.bulkInsert("Bills", bills, {});

    const items = JSON.parse(fs.readFileSync("./db/items.json", "utf-8")).map(
      (item) => {
        delete item.id;
        return {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    );
    await queryInterface.bulkInsert("Items", items, {});

    const participants = JSON.parse(
      fs.readFileSync("./db/participants.json", "utf-8")
    ).map((participant) => {
      delete participant.id;
      return {
        ...participant,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Participants", participants, {});

    const itemAllocations = JSON.parse(
      fs.readFileSync("./db/itemalloc.json", "utf-8")
    ).map((itemAllocation) => {
      delete itemAllocation.id;
      return {
        ...itemAllocation,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("ItemAllocations", itemAllocations, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("ItemAllocations", null, {});
    await queryInterface.bulkDelete("Participants", null, {});
    await queryInterface.bulkDelete("Items", null, {});
    await queryInterface.bulkDelete("Bills", null, {});
  },
};
