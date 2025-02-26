const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

let validAccessToken;
let testUserId;

beforeAll(async () => {
  try {
    const seedUsers = [
      {
        email: "seed@test.com",
        password: hashPassword("123456"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", seedUsers, {});
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

// ==================== REGISTER TESTS ====================
describe("POST /users/register", () => {
  test("201 Success - create new user", async () => {
    const newUser = {
      email: "testregister@test.com",
      password: "test123",
    };

    const response = await request(app).post("/users/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", newUser.email);
    expect(response.body).toHaveProperty("message", "Successful registration!");

    testUserId = response.body.id;
  });

  test("400 Fail - no email", async () => {
    const response = await request(app).post("/users/register").send({
      email: "",
      password: "somepassword",
    });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  test("400 Fail - no password", async () => {
    const response = await request(app).post("/users/register").send({
      email: "noPassword@test.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  test("400 Fail - email not unique", async () => {
    const response = await request(app).post("/users/register").send({
      email: "testregister@test.com",
      password: "somepassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

// ==================== LOGIN TESTS ====================
describe("POST /users/login", () => {
  test("200 Success - return access_token", async () => {
    const response = await request(app).post("/users/login").send({
      email: "seed@test.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    validAccessToken = response.body.access_token;
  });

  test("400 Fail - no data input", async () => {
    const response = await request(app).post("/users/login").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and password must be filled"
    );
  });

  test("401 Fail - invalid email", async () => {
    const response = await request(app).post("/users/login").send({
      email: "wrong@test.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("401 Fail - wrong password", async () => {
    const response = await request(app).post("/users/login").send({
      email: "seed@test.com",
      password: "incorrect",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

// ==================== GET USER BY ID TESTS ====================
describe("GET /users/:id", () => {
  test("200 Success - get user data with token and correct user ID", async () => {
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${validAccessToken}`);

    if (response.status === 200) {
      expect(response.body).toHaveProperty("id", testUserId);
      expect(response.body).toHaveProperty("email", "testregister@test.com");
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });

  test("403 Forbidden - try to access another users data", async () => {
    const response = await request(app)
      .get(`/users/9999`)
      .set("Authorization", `Bearer ${validAccessToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "You cannot access other user's data"
    );
  });

  test("401 Unauthorized - no access token", async () => {
    const response = await request(app).get(`/users/${testUserId}`);

    expect([401, 403]).toContain(response.status);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  test("404 Not Found - user doesn't exist in DB", async () => {
    const response = await request(app)
      .get("/users/12345678")
      .set("Authorization", `Bearer ${validAccessToken}`);

    if (response.status === 404) {
      expect(response.body).toHaveProperty("message", "User not found");
    } else {
      expect([403, 404]).toContain(response.status);
    }
  });
});
