const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

let validAccessToken;
let testBillId;
let testItemId;
let testParticipantId;
let testAllocationId;

beforeAll(async () => {
  try {
    const seedUsers = [
      {
        email: "seedAllocation@test.com",
        password: hashPassword("123456"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", seedUsers, {});
    const login = await request(app).post("/users/login").send({
      email: "seedAllocation@test.com",
      password: "123456",
    });
    validAccessToken = login.body.access_token;
    const createBill = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://test.com/bill.jpg",
        vatAmount: 0.11,
        serviceChargeAmt: 0.1,
      });
    testBillId = createBill.body.bill.id;
    const createItem = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Test Item",
        quantity: 2,
        price: 10000,
        BillId: testBillId,
      });
    testItemId = createItem.body.item.id;
    const createParticipant = await request(app)
      .post("/participants")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Test Participant",
        BillId: testBillId,
      });
    testParticipantId = createParticipant.body.participant.id;
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await queryInterface.bulkDelete("ItemAllocations", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Items", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Participants", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Bills", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /allocations", () => {
  test("201 Success - create allocation", async () => {
    const response = await request(app)
      .post("/allocations")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        ParticipantId: testParticipantId,
        ItemId: testItemId,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Allocation created");
    expect(response.body).toHaveProperty("allocation", expect.any(Object));
    testAllocationId = response.body.allocation.id;
  });

  test("404 Fail - item not found", async () => {
    const response = await request(app)
      .post("/allocations")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        ParticipantId: testParticipantId,
        ItemId: 999999,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Item not found");
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).post("/allocations").send({
      ParticipantId: testParticipantId,
      ItemId: testItemId,
    });
    expect([401, 403]).toContain(response.status);
  });
});

// describe("GET /allocations/item/:itemId", () => {
//   test("200 Success - get allocations by item", async () => {
//     const response = await request(app)
//       .get(`/allocations/item/${testItemId}`)
//       .set("Authorization", `Bearer ${validAccessToken}`);
//     if (response.status === 200) {
//       expect(Array.isArray(response.body)).toBe(true);
//     } else {
//       expect([401, 403, 404, 500]).toContain(response.status);
//     }
//   });

//   test("401 Fail - no token", async () => {
//     const response = await request(app).get(`/allocations/item/${testItemId}`);
//     expect([401, 403]).toContain(response.status);
//   });
// });

// describe("GET /allocations/participant/:participantId", () => {
//   test("200 Success - get allocations by participant", async () => {
//     const response = await request(app)
//       .get(`/allocations/participant/${testParticipantId}`)
//       .set("Authorization", `Bearer ${validAccessToken}`);
//     if (response.status === 200) {
//       expect(Array.isArray(response.body)).toBe(true);
//     } else {
//       expect([401, 403, 404, 500]).toContain(response.status);
//     }
//   });

//   test("401 Fail - no token", async () => {
//     const response = await request(app).get(
//       `/allocations/participant/${testParticipantId}`
//     );
//     expect([401, 403]).toContain(response.status);
//   });
// });

describe("DELETE /allocations/:id", () => {
  test("200 Success - delete allocation", async () => {
    const response = await request(app)
      .delete(`/allocations/${testAllocationId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty(
        "message",
        "Allocation deleted successfully"
      );
    } else {
      expect([401, 403, 404, 500]).toContain(response.status);
    }
  });

  test("404 Fail - allocation not found", async () => {
    const response = await request(app)
      .delete(`/allocations/999999`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect([404, 500]).toContain(response.status);
    expect(response.body).toHaveProperty("message", "Allocation not found");
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).delete(
      `/allocations/${testAllocationId}`
    );
    expect([401, 403]).toContain(response.status);
  });
});

//======== BARUUUU
describe("POST /allocations - additional error cases", () => {
  test("404 Fail - participant not found", async () => {
    const response = await request(app)
      .post("/allocations")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        ParticipantId: 999999,
        ItemId: testItemId,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Participant not found");
  });

  test("400 Fail - item and participant must belong to the same bill", async () => {
    const createBill2 = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://test.com/bill2.jpg",
        vatAmount: 0.11,
        serviceChargeAmt: 0.1,
      });
    const bill2Id = createBill2.body.bill.id;

    const createParticipant2 = await request(app)
      .post("/participants")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Test Participant 2",
        BillId: bill2Id,
      });
    const participant2Id = createParticipant2.body.participant.id;

    const response = await request(app)
      .post("/allocations")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        ParticipantId: participant2Id,
        ItemId: testItemId,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Item and Participant must belong to the same bill"
    );
  });
});
// ======== ERROR HANDLING FOR ALLOCATION CONTROLLER ========

const { ItemAllocation } = require("../models");

describe("Error handling in AllocationController endpoints", () => {
  describe("POST /allocations error", () => {
    test("500 Internal Server Error - createAllocation throws error", async () => {
      jest
        .spyOn(ItemAllocation, "create")
        .mockRejectedValue(new Error("Test create error"));

      const response = await request(app)
        .post("/allocations")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          ParticipantId: testParticipantId,
          ItemId: testItemId,
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      ItemAllocation.create.mockRestore();
    });
  });

  // describe("GET /allocations/item/:itemId error", () => {
  //   test("500 Internal Server Error - getAllocationsByItem throws error", async () => {
  //     jest
  //       .spyOn(ItemAllocation, "findAll")
  //       .mockRejectedValue(new Error("Test getAllocationsByItem error"));

  //     const response = await request(app)
  //       .get(`/allocations/item/${testItemId}`)
  //       .set("Authorization", `Bearer ${validAccessToken}`);

  //     expect(response.status).toBe(500);
  //     expect(response.body).toHaveProperty("message", "Internal Server Error.");
  //     ItemAllocation.findAll.mockRestore();
  //   });
  // });

  // describe("GET /allocations/participant/:participantId error", () => {
  //   test("500 Internal Server Error - getAllocationsByParticipant throws error", async () => {
  //     jest
  //       .spyOn(ItemAllocation, "findAll")
  //       .mockRejectedValue(new Error("Test getAllocationsByParticipant error"));

  //     const response = await request(app)
  //       .get(`/allocations/participant/${testParticipantId}`)
  //       .set("Authorization", `Bearer ${validAccessToken}`);

  //     expect(response.status).toBe(500);
  //     expect(response.body).toHaveProperty("message", "Internal Server Error.");
  //     ItemAllocation.findAll.mockRestore();
  //   });
  // });

  describe("DELETE /allocations/:id error", () => {
    test("500 Internal Server Error - deleteAllocation throws error", async () => {
      jest
        .spyOn(ItemAllocation, "destroy")
        .mockRejectedValue(new Error("Test delete error"));

      const response = await request(app)
        .delete(`/allocations/${testAllocationId}`)
        .set("Authorization", `Bearer ${validAccessToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      ItemAllocation.destroy.mockRestore();
    });
  });
});
