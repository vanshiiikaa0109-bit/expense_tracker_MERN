// src/tests/analytics.test.js
// Integration tests for analytics routes using Jest + Supertest

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

let token;
let userId;

beforeEach(async () => {
  await User.deleteMany({});
  await Expense.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    name: "Analytics Tester",
    email: "analytics@example.com",
    password: "password123",
  });

  token  = res.body.data.token;
  userId = res.body.data.user._id;
});

const seedExpenses = async () => {
  const now = new Date();

  // Seed multiple expenses across categories
  await Expense.insertMany([
    { user: userId, title: "Groceries",  amount: 100, category: "Food & Dining",  type: "expense", date: now },
    { user: userId, title: "Coffee",     amount: 20,  category: "Food & Dining",  type: "expense", date: now },
    { user: userId, title: "Bus pass",   amount: 50,  category: "Transportation", type: "expense", date: now },
    { user: userId, title: "Gym",        amount: 30,  category: "Health & Medical", type: "expense", date: now },
    { user: userId, title: "Freelance",  amount: 500, category: "Freelance",      type: "income",  date: now },
  ]);
};

const authGet = (path) =>
  request(app).get(path).set("Authorization", `Bearer ${token}`);

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

describe("GET /api/analytics/summary", () => {
  beforeEach(seedExpenses);

  it("should return total expense, income, net savings and averages", async () => {
    const res = await authGet("/api/analytics/summary");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data).toHaveProperty("totalExpense", 200);
    expect(data).toHaveProperty("totalIncome",  500);
    expect(data).toHaveProperty("netSavings",   300);
    expect(data).toHaveProperty("savingsRate");
    expect(data).toHaveProperty("avgExpense");
    expect(data).toHaveProperty("avgIncome");
  });

  it("should return zeroes when user has no expenses", async () => {
    await Expense.deleteMany({});
    const res = await authGet("/api/analytics/summary");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalExpense).toBe(0);
    expect(res.body.data.totalIncome).toBe(0);
    expect(res.body.data.netSavings).toBe(0);
  });

  it("should return 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/analytics/summary");
    expect(res.statusCode).toBe(401);
  });
});

// ─── MONTHLY TREND ───────────────────────────────────────────────────────────

describe("GET /api/analytics/monthly-trend", () => {
  beforeEach(seedExpenses);

  it("should return 12 months of data for the given year", async () => {
    const year = new Date().getFullYear();
    const res  = await authGet(`/api/analytics/monthly-trend?year=${year}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("year", year);
    expect(res.body.data.months).toHaveLength(12);

    // Each month entry must have month, monthName, total, count
    res.body.data.months.forEach((m) => {
      expect(m).toHaveProperty("month");
      expect(m).toHaveProperty("monthName");
      expect(m).toHaveProperty("total");
      expect(m).toHaveProperty("count");
    });
  });

  it("should return current year by default when no year param is given", async () => {
    const res = await authGet("/api/analytics/monthly-trend");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.year).toBe(new Date().getFullYear());
  });

  it("should have the current month total greater than 0", async () => {
    const year  = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const res   = await authGet(`/api/analytics/monthly-trend?year=${year}`);

    const currentMonth = res.body.data.months.find((m) => m.month === month);
    expect(currentMonth.total).toBeGreaterThan(0);
  });
});

// ─── CATEGORY BREAKDOWN ───────────────────────────────────────────────────────

describe("GET /api/analytics/by-category", () => {
  beforeEach(seedExpenses);

  it("should return spending breakdown by category with percentage", async () => {
    const res = await authGet("/api/analytics/by-category");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const food = res.body.data.find((d) => d.category === "Food & Dining");
    expect(food).toBeDefined();
    expect(food.total).toBe(120);
    expect(food).toHaveProperty("percentage");
    expect(food).toHaveProperty("count");
  });

  it("should return sorted by total descending", async () => {
    const res = await authGet("/api/analytics/by-category");

    const totals = res.body.data.map((d) => d.total);
    for (let i = 0; i < totals.length - 1; i++) {
      expect(totals[i]).toBeGreaterThanOrEqual(totals[i + 1]);
    }
  });

  it("should return empty array when no expenses exist", async () => {
    await Expense.deleteMany({});
    const res = await authGet("/api/analytics/by-category");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

// ─── TOP CATEGORIES ───────────────────────────────────────────────────────────

describe("GET /api/analytics/top-categories", () => {
  beforeEach(seedExpenses);

  it("should return top 5 categories by default", async () => {
    const res = await authGet("/api/analytics/top-categories");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it("should respect the limit query parameter", async () => {
    const res = await authGet("/api/analytics/top-categories?limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });
});

// ─── DAILY SPENDING ───────────────────────────────────────────────────────────

describe("GET /api/analytics/daily", () => {
  beforeEach(seedExpenses);

  it("should return daily spending for the current month", async () => {
    const month = new Date().getMonth() + 1;
    const year  = new Date().getFullYear();
    const res   = await authGet(`/api/analytics/daily?month=${month}&year=${year}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("month", month);
    expect(res.body.data).toHaveProperty("year",  year);
    expect(Array.isArray(res.body.data.days)).toBe(true);

    // Should return all days of the month
    const daysInMonth = new Date(year, month, 0).getDate();
    expect(res.body.data.days).toHaveLength(daysInMonth);
  });

  it("should show today's total greater than 0", async () => {
    const month = new Date().getMonth() + 1;
    const year  = new Date().getFullYear();
    const today = new Date().getDate();
    const res   = await authGet(`/api/analytics/daily?month=${month}&year=${year}`);

    const todayData = res.body.data.days.find((d) => d.day === today);
    expect(todayData).toBeDefined();
    expect(todayData.total).toBeGreaterThan(0);
  });
});

// ─── SPENDING INSIGHTS ────────────────────────────────────────────────────────

describe("GET /api/analytics/insights", () => {
  beforeEach(seedExpenses);

  it("should return insights with currentMonthExpense and insights array", async () => {
    const res = await authGet("/api/analytics/insights");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data).toHaveProperty("currentMonthExpense");
    expect(data).toHaveProperty("lastMonthExpense");
    expect(data).toHaveProperty("insights");
    expect(Array.isArray(data.insights)).toBe(true);
    expect(data.insights.length).toBeGreaterThan(0);
  });

  it("each insight should have a type and message field", async () => {
    const res = await authGet("/api/analytics/insights");

    res.body.data.insights.forEach((insight) => {
      expect(insight).toHaveProperty("type");
      expect(insight).toHaveProperty("message");
      expect(["warning", "success", "info"]).toContain(insight.type);
    });
  });

  it("should return 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/analytics/insights");
    expect(res.statusCode).toBe(401);
  });
});
