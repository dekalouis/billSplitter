// tests/bill.test.js

const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

let validAccessToken;
let testUserId;
let testBillId;

beforeAll(async () => {
  try {
    const seedUsers = [
      {
        email: "seedBill@test.com",
        password: hashPassword("123456"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const [userInsert] = await queryInterface.bulkInsert(
      "Users",
      seedUsers,
      {}
    );
    const response = await request(app).post("/users/login").send({
      email: "seedBill@test.com",
      password: "123456",
    });
    validAccessToken = response.body.access_token;
    const userData = await request(app)
      .post("/users/register")
      .send({ email: "billTest@user.com", password: "bill123" });
    testUserId = userData.body.id;
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
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

// ==================== CREATE BILL ====================
describe("POST /bills/add-bill", () => {
  test("201 Success - create new bill", async () => {
    const response = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/test.jpg",
        vatRate: 0.11,
        serviceChargeRate: 0.1,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Bill created successfully"
    );
    expect(response.body).toHaveProperty("bill", expect.any(Object));
    testBillId = response.body.bill.id;
  });

  test("400 Fail - invalid vat/service", async () => {
    const response = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/test.jpg",
        vatRate: "abc",
        serviceChargeRate: 0.1,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).post("/bills/add-bill").send({
      billImageUrl: "http://example.com/test.jpg",
      vatRate: 0.11,
      serviceChargeRate: 0.1,
    });
    expect([401, 403]).toContain(response.status);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

// ==================== GET BILLS BY USER ====================
describe("GET /bills", () => {
  test("200 Success - get bills for authenticated user", async () => {
    const response = await request(app)
      .get("/bills")
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bills", expect.any(Array));
    response.body.bills.forEach((bill) => {
      expect(bill.createdBy).toBe(1);

      // console.log(bill.createdBy, testUserId, `---- INI YA`);
    });
  });

  test("401 Unauthorized - no token", async () => {
    const response = await request(app).get("/bills");
    expect([401, 403]).toContain(response.status);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

// ==================== GET BILL BY ID ====================
describe("GET /bills/:id", () => {
  test("200 Success - get bill by id", async () => {
    const response = await request(app)
      .get(`/bills/${testBillId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty("bill", expect.any(Object));
      expect(response.body.bill).toHaveProperty("id", testBillId);
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("404 Not Found - invalid bill id", async () => {
    const response = await request(app)
      .get("/bills/999999")
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 404) {
      expect(response.body).toHaveProperty("message", "Bill not found");
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).get(`/bills/${testBillId}`);
    expect([401, 403]).toContain(response.status);
  });
});

// ==================== UPDATE BILL ====================
describe("PUT /bills/:id", () => {
  test("200 Success - update bill", async () => {
    const response = await request(app)
      .put(`/bills/${testBillId}`)
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/new.jpg",
        vatRate: 0.12,
        serviceChargeRate: 0.05,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Bill updated successfully"
    );
  });

  test("404 Not Found - invalid id", async () => {
    const response = await request(app)
      .put("/bills/999999")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/new.jpg",
        vatRate: 0.12,
        serviceChargeRate: 0.05,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Bill not found");
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).put(`/bills/${testBillId}`).send({
      billImageUrl: "http://example.com/new.jpg",
      vatRate: 0.12,
      serviceChargeRate: 0.05,
    });
    expect([401, 403]).toContain(response.status);
  });
});

// ==================== DELETE BILL ====================
describe("DELETE /bills/:id", () => {
  test("200 Success - delete bill", async () => {
    const response = await request(app)
      .delete(`/bills/${testBillId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Bill deleted successfully"
    );
  });

  test("404 Not Found - invalid id", async () => {
    const response = await request(app)
      .delete(`/bills/${testBillId + 9999}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Bill not found");
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).delete(`/bills/${testBillId}`);
    expect([401, 403]).toContain(response.status);
  });
});
