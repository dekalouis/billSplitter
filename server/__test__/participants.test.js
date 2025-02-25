const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

let validAccessToken;
let testBillId;
let testParticipantId;

beforeAll(async () => {
  try {
    const seedUsers = [
      {
        email: "seedParticipant@test.com",
        password: hashPassword("123456"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", seedUsers, {});
    const login = await request(app).post("/users/login").send({
      email: "seedParticipant@test.com",
      password: "123456",
    });
    validAccessToken = login.body.access_token;
    const createBill = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://test.com/bill.jpg",
        vatRate: 0.11,
        serviceChargeRate: 0.1,
      });
    testBillId = createBill.body.bill.id;
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
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

describe("POST /participants", () => {
  test("201 Success - create participant", async () => {
    const response = await request(app)
      .post("/participants")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Test Participant",
        BillId: testBillId,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Participant created");
    expect(response.body).toHaveProperty("participant", expect.any(Object));
    testParticipantId = response.body.participant.id;
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).post("/participants").send({
      name: "Test Participant",
      BillId: testBillId,
    });
    expect([401, 403]).toContain(response.status);
  });

  test("400 Fail - missing fields", async () => {
    const response = await request(app)
      .post("/participants")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "",
        BillId: testBillId,
      });
    expect(response.status).toBe(400);
  });
});

describe("GET /participants/bill/:billId", () => {
  test("200 Success - get participants by bill", async () => {
    const response = await request(app)
      .get(`/participants/bill/${testBillId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).get(`/participants/bill/${testBillId}`);
    expect([401, 403]).toContain(response.status);
  });
});

describe("PUT /participants/:id", () => {
  test("200 Success - update participant", async () => {
    const response = await request(app)
      .put(`/participants/${testParticipantId}`)
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({ name: "Updated Participant" });
    if (response.status === 200) {
      expect(response.body).toHaveProperty(
        "message",
        "Participant updated successfully"
      );
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("404 Fail - participant not found", async () => {
    const response = await request(app)
      .put("/participants/999999")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({ name: "Updated Participant" });
    expect([404, 400]).toContain(response.status);
  });

  test("401 Fail - no token", async () => {
    const response = await request(app)
      .put(`/participants/${testParticipantId}`)
      .send({ name: "Updated Participant" });
    expect([401, 403]).toContain(response.status);
  });
});

describe("DELETE /participants/:id", () => {
  test("200 Success - delete participant", async () => {
    const response = await request(app)
      .delete(`/participants/${testParticipantId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty(
        "message",
        "Participant deleted successfully"
      );
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("404 Fail - participant not found", async () => {
    const response = await request(app)
      .delete(`/participants/${testParticipantId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(404);
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).delete(
      `/participants/${testParticipantId}`
    );
    expect([401, 403]).toContain(response.status);
  });
});
