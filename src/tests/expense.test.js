// src/tests/expense.test.js
// Integration tests for expense routes using Jest + Supertest

import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";

// ─── Test Database Setup ──────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Expense.deleteMany({});
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

let token;
let userId;

beforeEach(async () => {
  await User.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    name: "Expense Tester",
    email: "expense@example.com",
    password: "password123",
  });

  token  = res.body.data.token;
  userId = res.body.data.user._id;
});

const validExpense = {
  title: "Coffee",
  amount: 5.5,
  category: "Food & Dining",
  type: "expense",
  date: new Date().toISOString(),
};

const createExpense = (data = validExpense) =>
  request(app)
    .post("/api/expenses")
    .set("Authorization", `Bearer ${token}`)
    .send(data);

// ─── CREATE EXPENSE ───────────────────────────────────────────────────────────

describe("POST /api/expenses", () => {
  it("should create a new expense and return it", async () => {
    const res = await createExpense();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.title).toBe(validExpense.title);
    expect(res.body.data.amount).toBe(validExpense.amount);
    expect(res.body.data.category).toBe(validExpense.category);
  });

  it("should create an income transaction", async () => {
    const res = await createExpense({
      title: "Freelance Payment",
      amount: 500,
      category: "Freelance",
      type: "income",
      date: new Date().toISOString(),
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.type).toBe("income");
  });

  it("should return 422 if title is missing", async () => {
    const res = await createExpense({ ...validExpense, title: undefined });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 422 if amount is 0 or negative", async () => {
    const res = await createExpense({ ...validExpense, amount: -10 });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("should return 422 if category is invalid", async () => {
    const res = await createExpense({ ...validExpense, category: "InvalidCategory" });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 if unauthenticated", async () => {
    const res = await request(app).post("/api/expenses").send(validExpense);

    expect(res.statusCode).toBe(401);
  });
});

// ─── GET ALL EXPENSES ─────────────────────────────────────────────────────────

describe("GET /api/expenses", () => {
  beforeEach(async () => {
    await createExpense();
    await createExpense({ ...validExpense, title: "Lunch", amount: 12 });
  });

  it("should return all expenses for the authenticated user", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.expenses).toHaveLength(2);
    expect(res.body.data).toHaveProperty("total", 2);
    expect(res.body.data).toHaveProperty("totalPages");
  });

  it("should filter expenses by category", async () => {
    await createExpense({ ...validExpense, title: "Bus", category: "Transportation", amount: 2 });

    const res = await request(app)
      .get("/api/expenses?category=Transportation")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.expenses.every((e) => e.category === "Transportation")).toBe(true);
  });

  it("should filter expenses by type", async () => {
    const res = await request(app)
      .get("/api/expenses?type=expense")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.expenses.every((e) => e.type === "expense")).toBe(true);
  });

  it("should paginate results correctly", async () => {
    const res = await request(app)
      .get("/api/expenses?page=1&limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.expenses).toHaveLength(1);
    expect(res.body.data.page).toBe(1);
  });

  it("should return 401 if unauthenticated", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(401);
  });
});

// ─── GET EXPENSE BY ID ────────────────────────────────────────────────────────

describe("GET /api/expenses/:id", () => {
  it("should return a single expense by ID", async () => {
    const created = await createExpense();
    const id = created.body.data._id;

    const res = await request(app)
      .get(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(id);
  });

  it("should return 404 for a non-existent expense ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/expenses/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── UPDATE EXPENSE ───────────────────────────────────────────────────────────

describe("PUT /api/expenses/:id", () => {
  it("should update an expense and return the updated document", async () => {
    const created = await createExpense();
    const id = created.body.data._id;

    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Coffee", amount: 7.5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Coffee");
    expect(res.body.data.amount).toBe(7.5);
  });

  it("should return 404 if expense does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/expenses/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Ghost" });

    expect(res.statusCode).toBe(404);
  });
});

// ─── DELETE EXPENSE ───────────────────────────────────────────────────────────

describe("DELETE /api/expenses/:id", () => {
  it("should delete an expense and return success", async () => {
    const created = await createExpense();
    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const check = await request(app)
      .get(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(check.statusCode).toBe(404);
  });

  it("should return 404 if expense does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/expenses/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

// ─── GET BY CATEGORY ──────────────────────────────────────────────────────────

describe("GET /api/expenses/by-category", () => {
  beforeEach(async () => {
    await createExpense({ ...validExpense, title: "Coffee",    category: "Food & Dining",   amount: 5  });
    await createExpense({ ...validExpense, title: "Lunch",     category: "Food & Dining",   amount: 15 });
    await createExpense({ ...validExpense, title: "Bus fare",  category: "Transportation",  amount: 3  });
  });

  it("should return expenses grouped by category with totals", async () => {
    const res = await request(app)
      .get("/api/expenses/by-category")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const food = res.body.data.find((d) => d.category === "Food & Dining");
    expect(food).toBeDefined();
    expect(food.total).toBe(20);
    expect(food.count).toBe(2);
  });
});
