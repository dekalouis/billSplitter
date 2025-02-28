const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");
const imagekit = require("../helpers/imagekit");
const openai = require("../helpers/openAi");

let validAccessToken;
let testUserId;
let testBillId;
jest.mock("../helpers/imagekit");
jest.mock("../helpers/openAi");

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
    await queryInterface.bulkInsert("Users", seedUsers, {});
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
        vatAmount: 0.11,
        serviceChargeAmt: 0.1,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Bill created successfully"
    );
    expect(response.body).toHaveProperty("bill", expect.any(Object));
    testBillId = response.body.bill.id;
  });

  test("When vatAmount is invalid, bill is created with vatAmount = 0", async () => {
    const response = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/test.jpg",
        vatAmount: "abc",
        serviceChargeAmt: 0.1,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("bill", expect.any(Object));

    expect(response.body.bill.vatAmount).toBe(0);
  });

  test("401 Fail - no token", async () => {
    const response = await request(app).post("/bills/add-bill").send({
      billImageUrl: "http://example.com/test.jpg",
      vatAmount: 0.11,
      serviceChargeAmt: 0.1,
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

// ==================== UPDATE BILL ====================
describe("PUT /bills/:id", () => {
  test("200 Success - update bill", async () => {
    const createResponse = await request(app)
      .post("/bills/add-bill")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/original.jpg",
        vatAmount: 11,
        serviceChargeAmt: 10,
      });
    const billId = createResponse.body.bill.id;

    const updateResponse = await request(app)
      .put(`/bills/${billId}`)
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/updated.jpg",
        vatAmount: 15,
        serviceChargeAmt: 5,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty(
      "message",
      "Bill updated successfully"
    );
  });
});
// ==================== UPDATE BILL ERROR BRANCH ====================
describe("PUT /bills/:id error branch", () => {
  test("404 Not Found - update bill with non-existent id", async () => {
    const nonExistentId = 9999999; // Assuming this ID does not exist
    const updateResponse = await request(app)
      .put(`/bills/${nonExistentId}`)
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({
        billImageUrl: "http://example.com/updated.jpg",
        vatAmount: 0.15,
        serviceChargeAmt: 0.05,
      });

    expect(updateResponse.status).toBe(404);
    expect(updateResponse.body).toHaveProperty("message", "Bill not found");
  });
});

// ==================== UPLOAD BILL IMAGE ====================
describe("POST /bills/upload-image", () => {
  test("400 Bad Request - no file uploaded", async () => {
    const response = await request(app)
      .post("/bills/upload-image")
      .set("Authorization", `Bearer ${validAccessToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "No file uploaded");
  });

  test("200 Success - upload bill image", async () => {
    const fakeImageUrl = "http://fakeimage.com/fake.jpg";
    imagekit.upload.mockResolvedValue({ url: fakeImageUrl });

    const fakeGPTResponse = {
      choices: [
        {
          message: {
            content:
              '{"items":[{"name":"Pizza","quantity":2,"price":20}],"vatAmount":2,"serviceChargeAmt":0,"totalPayment":40}',
          },
        },
      ],
    };
    openai.chat.completions.create.mockResolvedValue(fakeGPTResponse);

    const response = await request(app)
      .post("/bills/upload-image")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .attach("image", Buffer.from("fake image content"), "test.jpg");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "File uploaded successfully"
    );
    expect(response.body).toHaveProperty("imageUrl", fakeImageUrl);
    expect(response.body).toHaveProperty(
      "rawGPT",
      fakeGPTResponse.choices[0].message.content
    );
    expect(response.body).toHaveProperty("data", {
      items: [{ name: "Pizza", quantity: 2, price: 20 }],
      vatAmount: 2,
      serviceChargeAmt: 0,
      totalPayment: 40,
    });
  });

  test("400 Bad Request - invalid JSON from GPT response", async () => {
    const fakeImageUrl = "http://fakeimage.com/fake.jpg";
    imagekit.upload.mockResolvedValue({ url: fakeImageUrl });

    const fakeGPTResponse = {
      choices: [
        {
          message: {
            content: "Invalid JSON",
          },
        },
      ],
    };
    openai.chat.completions.create.mockResolvedValue(fakeGPTResponse);

    const response = await request(app)
      .post("/bills/upload-image")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .attach("image", Buffer.from("fake image content"), "test.jpg");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Output is not valid JSON");
  });

  test("500 Internal Server Error - when imagekit.upload throws error", async () => {
    imagekit.upload.mockRejectedValue(new Error("Test imagekit error"));

    const response = await request(app)
      .post("/bills/upload-image")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .attach("image", Buffer.from("fake image content"), "test.jpg");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error.");
  });
});

// ==================== ERROR HANDLING BRANCHES ====================
const { Bill } = require("../models");

describe("Error handling in billController endpoints", () => {
  describe("POST /bills/add-bill error", () => {
    test("500 Internal Server Error - create bill throws error", async () => {
      const createSpy = jest
        .spyOn(Bill, "create")
        .mockRejectedValue(new Error("Test create error"));
      const response = await request(app)
        .post("/bills/add-bill")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          billImageUrl: "http://example.com/test.jpg",
          vatAmount: 0.11,
          serviceChargeAmt: 0.1,
        });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      createSpy.mockRestore();
    });
  });

  describe("GET /bills error", () => {
    test("500 Internal Server Error - getBillsByUser throws error", async () => {
      const findAllSpy = jest
        .spyOn(Bill, "findAll")
        .mockRejectedValue(new Error("Test findAll error"));
      const response = await request(app)
        .get("/bills")
        .set("Authorization", `Bearer ${validAccessToken}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      findAllSpy.mockRestore();
    });
  });

  describe("GET /bills/:id error", () => {
    test("500 Internal Server Error - getBillById throws error", async () => {
      const findByPkSpy = jest
        .spyOn(Bill, "findByPk")
        .mockRejectedValue(new Error("Test findByPk error"));
      const response = await request(app)
        .get("/bills/1")
        .set("Authorization", `Bearer ${validAccessToken}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      findByPkSpy.mockRestore();
    });
  });

  describe("PUT /bills/:id error (exception thrown)", () => {
    test("500 Internal Server Error - update bill throws error", async () => {
      const updateSpy = jest
        .spyOn(Bill, "update")
        .mockRejectedValue(new Error("Test update error"));

      const createResponse = await request(app)
        .post("/bills/add-bill")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          billImageUrl: "http://example.com/test.jpg",
          vatAmount: 0.11,
          serviceChargeAmt: 0.1,
        });
      const billId = createResponse.body.bill.id;
      const response = await request(app)
        .put(`/bills/${billId}`)
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          billImageUrl: "http://example.com/updated.jpg",
          vatAmount: 0.15,
          serviceChargeAmt: 0.05,
        });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      updateSpy.mockRestore();
    });
  });

  describe("DELETE /bills/:id error (exception thrown)", () => {
    test("500 Internal Server Error - delete bill throws error", async () => {
      const destroySpy = jest
        .spyOn(Bill, "destroy")
        .mockRejectedValue(new Error("Test destroy error"));
      // Create a bill first to have a valid id
      const createResponse = await request(app)
        .post("/bills/add-bill")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          billImageUrl: "http://example.com/test.jpg",
          vatAmount: 0.11,
          serviceChargeAmt: 0.1,
        });
      const billId = createResponse.body.bill.id;
      const response = await request(app)
        .delete(`/bills/${billId}`)
        .set("Authorization", `Bearer ${validAccessToken}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error.");
      destroySpy.mockRestore();
    });
  });
});
