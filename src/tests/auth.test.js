// src/tests/auth.test.js
// Integration tests for authentication routes using Jest + Supertest

import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";

// ─── Test Database Setup ──────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const registerUser = () =>
  request(app).post("/api/auth/register").send(testUser);

// ─── REGISTER ────────────────────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("should register a new user and return token", async () => {
    const res = await registerUser();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("_id");
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  it("should return 409 if email is already registered", async () => {
    await registerUser();
    const res = await registerUser();

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("should return 422 if name is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 422 if email is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "not-an-email", password: "password123" });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("should return 422 if password is too short", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "123" });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("should login with valid credentials and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("should return 401 with unregistered email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 422 if email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "password123" });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

// ─── GET ME ───────────────────────────────────────────────────────────────────

describe("GET /api/auth/me", () => {
  let token;

  beforeEach(async () => {
    const res = await registerUser();
    token = res.body.data.token;
  });

  it("should return the current user when authenticated", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 when token is invalid", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalidtoken123");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────

describe("PUT /api/auth/change-password", () => {
  let token;

  beforeEach(async () => {
    const res = await registerUser();
    token = res.body.data.token;
  });

  it("should change the password successfully", async () => {
    const res = await request(app)
      .put("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: testUser.password, newPassword: "newpassword456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if current password is wrong", async () => {
    const res = await request(app)
      .put("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "wrongpassword", newPassword: "newpassword456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 if unauthenticated", async () => {
    const res = await request(app)
      .put("/api/auth/change-password")
      .send({ currentPassword: testUser.password, newPassword: "newpassword456" });

    expect(res.statusCode).toBe(401);
  });
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

describe("POST /api/auth/forgot-password", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("should send a reset email for a registered user", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testUser.email });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/sent/i);
  });

  it("should return 404 for an unregistered email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
