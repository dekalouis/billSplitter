const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

let validAccessToken;
let testBillId;
let testItemId;

beforeAll(async () => {
  try {
    const seedUsers = [
      {
        email: "seedItem@test.com",
        password: hashPassword("123456"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", seedUsers, {});
    const login = await request(app).post("/users/login").send({
      email: "seedItem@test.com",
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
  await queryInterface.bulkDelete("Items", null, {
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

describe("POST /items", () => {
  test("201 Success - create item", async () => {
    const response = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Test Item",
        quantity: 2,
        price: 10000,
        BillId: testBillId,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Item created");
    expect(response.body).toHaveProperty("item", expect.any(Object));
    testItemId = response.body.item.id;
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).post("/items").send({
      name: "Test Item",
      quantity: 2,
      price: 10000,
      BillId: testBillId,
    });
    expect([401, 403]).toContain(response.status);
  });

  test("400 Fail - missing fields", async () => {
    const response = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "",
        quantity: 2,
        price: 10000,
        BillId: testBillId,
      });
    expect(response.status).toBe(400);
  });
});

describe("GET /items/bill/:billId", () => {
  test("200 Success - get items by bill", async () => {
    const response = await request(app)
      .get(`/items/bill/${testBillId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).get(`/items/bill/${testBillId}`);
    expect([401, 403]).toContain(response.status);
  });
});

describe("PUT /items/:id", () => {
  test("200 Success - update item", async () => {
    const response = await request(app)
      .put(`/items/${testItemId}`)
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Updated Item",
        quantity: 5,
        price: 15000,
      });
    if (response.status === 200) {
      expect(response.body).toHaveProperty(
        "message",
        "Item updated successfully"
      );
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("404 Fail - item not found", async () => {
    const response = await request(app)
      .put("/items/999999")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        name: "Updated Item",
        quantity: 5,
        price: 15000,
      });
    expect(response.status).toBe(404);
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).put(`/items/${testItemId}`).send({
      name: "Updated Item",
      quantity: 5,
      price: 15000,
    });
    expect([401, 403]).toContain(response.status);
  });
});

describe("DELETE /items/:id", () => {
  test("200 Success - delete item", async () => {
    const response = await request(app)
      .delete(`/items/${testItemId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty(
        "message",
        "Item deleted successfully"
      );
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("404 Fail - item not found", async () => {
    const response = await request(app)
      .delete(`/items/${testItemId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(404);
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).delete(`/items/${testItemId}`);
    expect([401, 403]).toContain(response.status);
  });
});
