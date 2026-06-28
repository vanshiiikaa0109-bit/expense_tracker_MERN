// src/docs/swagger.js
// Swagger/OpenAPI 3.0 documentation setup using swagger-jsdoc and swagger-ui-express

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "../config/env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Expense Tracker API",
      version: "1.0.0",
      description:
        "Production-level REST API for the Smart Expense Tracker application. Manage expenses, budgets, goals, wallets, receipts, analytics, reports, and notifications.",
      contact: {
        name: "Smart Expense Tracker Team",
        email: "support@smartexpensetracker.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: "Development Server",
      },
      {
        url: "https://your-production-domain.com/api",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        // ─── SUCCESS RESPONSE ────────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        // ─── ERROR RESPONSE ──────────────────────────────────────────────
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
        // ─── USER ────────────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456ghi789" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            avatar: { type: "string", example: "https://res.cloudinary.com/sample/image.jpg" },
            currency: { type: "string", example: "USD" },
            timezone: { type: "string", example: "Asia/Kolkata" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── AUTH ────────────────────────────────────────────────────────
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", minLength: 6, example: "password123" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        // ─── EXPENSE ─────────────────────────────────────────────────────
        Expense: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            title: { type: "string", example: "Grocery Shopping" },
            amount: { type: "number", example: 150.5 },
            category: { type: "string", example: "Food & Dining" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            date: { type: "string", format: "date", example: "2024-06-15" },
            note: { type: "string", example: "Weekly groceries" },
            wallet: { type: "string", example: "64abc123" },
            isRecurring: { type: "boolean", example: false },
            recurringFrequency: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ExpenseInput: {
          type: "object",
          required: ["title", "amount", "category", "type", "date"],
          properties: {
            title: { type: "string", example: "Grocery Shopping" },
            amount: { type: "number", example: 150.5 },
            category: { type: "string", example: "Food & Dining" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            date: { type: "string", format: "date", example: "2024-06-15" },
            note: { type: "string", example: "Weekly groceries" },
            wallet: { type: "string", example: "64abc123" },
            isRecurring: { type: "boolean", example: false },
            recurringFrequency: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] },
          },
        },
        // ─── BUDGET ──────────────────────────────────────────────────────
        Budget: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            category: { type: "string", example: "Food & Dining" },
            limit: { type: "number", example: 500 },
            spent: { type: "number", example: 200 },
            period: { type: "string", enum: ["weekly", "monthly", "yearly"], example: "monthly" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            alertThreshold: { type: "number", example: 80, description: "Percentage to trigger alert" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        BudgetInput: {
          type: "object",
          required: ["category", "limit", "period"],
          properties: {
            category: { type: "string", example: "Food & Dining" },
            limit: { type: "number", example: 500 },
            period: { type: "string", enum: ["weekly", "monthly", "yearly"], example: "monthly" },
            alertThreshold: { type: "number", example: 80 },
          },
        },
        // ─── GOAL ────────────────────────────────────────────────────────
        Goal: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            title: { type: "string", example: "Vacation Fund" },
            targetAmount: { type: "number", example: 5000 },
            savedAmount: { type: "number", example: 1200 },
            category: { type: "string", example: "Vacation" },
            deadline: { type: "string", format: "date", example: "2024-12-31" },
            isCompleted: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        GoalInput: {
          type: "object",
          required: ["title", "targetAmount", "deadline"],
          properties: {
            title: { type: "string", example: "Vacation Fund" },
            targetAmount: { type: "number", example: 5000 },
            category: { type: "string", example: "Vacation" },
            deadline: { type: "string", format: "date", example: "2024-12-31" },
          },
        },
        // ─── WALLET ──────────────────────────────────────────────────────
        Wallet: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            name: { type: "string", example: "Main Bank Account" },
            type: { type: "string", example: "Bank Account" },
            balance: { type: "number", example: 3500 },
            currency: { type: "string", example: "USD" },
            color: { type: "string", example: "#4CAF50" },
            isDefault: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        WalletInput: {
          type: "object",
          required: ["name", "type", "balance"],
          properties: {
            name: { type: "string", example: "Main Bank Account" },
            type: { type: "string", example: "Bank Account" },
            balance: { type: "number", example: 3500 },
            currency: { type: "string", example: "USD" },
            color: { type: "string", example: "#4CAF50" },
            isDefault: { type: "boolean", example: false },
          },
        },
        // ─── RECEIPT ─────────────────────────────────────────────────────
        Receipt: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            imageUrl: { type: "string", example: "https://res.cloudinary.com/sample/receipt.jpg" },
            publicId: { type: "string", example: "receipts/abc123" },
            expense: { type: "string", example: "64abc123" },
            note: { type: "string", example: "Grocery receipt" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── NOTIFICATION ────────────────────────────────────────────────
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            title: { type: "string", example: "Budget Alert" },
            message: { type: "string", example: "You have used 80% of your Food & Dining budget" },
            type: { type: "string", enum: ["budget", "goal", "system", "reminder"], example: "budget" },
            isRead: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── REPORT ──────────────────────────────────────────────────────
        Report: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            month: { type: "number", example: 6 },
            year: { type: "number", example: 2024 },
            totalExpense: { type: "number", example: 3200 },
            totalIncome: { type: "number", example: 5000 },
            netSavings: { type: "number", example: 1800 },
            categoryBreakdown: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  total: { type: "number" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Register, login, password management" },
      { name: "Users", description: "User profile management" },
      { name: "Expenses", description: "Expense CRUD and filtering" },
      { name: "Budgets", description: "Budget management and alerts" },
      { name: "Analytics", description: "Spending statistics and insights" },
      { name: "Reports", description: "Monthly reports and exports" },
      { name: "Goals", description: "Savings goal tracking" },
      { name: "Wallets", description: "Multiple wallet management" },
      { name: "Receipts", description: "Receipt image uploads" },
      { name: "Notifications", description: "In-app notifications" },
    ],
    paths: {
      // ─── AUTH ────────────────────────────────────────────────────────
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        properties: {
                          data: { $ref: "#/components/schemas/AuthResponse" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            409: { description: "Email already exists" },
            422: { description: "Validation error" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        properties: {
                          data: { $ref: "#/components/schemas/AuthResponse" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get currently logged in user",
          responses: {
            200: { description: "User fetched successfully" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/auth/change-password": {
        put: {
          tags: ["Auth"],
          summary: "Change password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string", example: "oldpassword123" },
                    newPassword: { type: "string", example: "newpassword123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password changed successfully" },
            400: { description: "Incorrect current password" },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Send password reset email",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Reset email sent" },
            404: { description: "User not found" },
          },
        },
      },
      "/auth/reset-password/{token}": {
        put: {
          tags: ["Auth"],
          summary: "Reset password using token",
          security: [],
          parameters: [
            { in: "path", name: "token", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["newPassword"],
                  properties: {
                    newPassword: { type: "string", example: "newpassword123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password reset successful" },
            400: { description: "Invalid or expired token" },
          },
        },
      },
      // ─── USERS ───────────────────────────────────────────────────────
      "/users/profile": {
        get: {
          tags: ["Users"],
          summary: "Get user profile",
          responses: {
            200: { description: "Profile fetched" },
            401: { description: "Unauthorized" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user profile",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Jane Doe" },
                    currency: { type: "string", example: "INR" },
                    timezone: { type: "string", example: "Asia/Kolkata" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Profile updated" },
          },
        },
      },
      "/users/avatar": {
        put: {
          tags: ["Users"],
          summary: "Upload profile avatar",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    avatar: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Avatar updated" },
          },
        },
      },
      "/users/account": {
        delete: {
          tags: ["Users"],
          summary: "Delete user account",
          responses: {
            200: { description: "Account deleted" },
          },
        },
      },
      // ─── EXPENSES ────────────────────────────────────────────────────
      "/expenses": {
        get: {
          tags: ["Expenses"],
          summary: "Get all expenses (with filters & pagination)",
          parameters: [
            { in: "query", name: "category", schema: { type: "string" } },
            { in: "query", name: "type", schema: { type: "string", enum: ["expense", "income"] } },
            { in: "query", name: "startDate", schema: { type: "string", format: "date" } },
            { in: "query", name: "endDate", schema: { type: "string", format: "date" } },
            { in: "query", name: "page", schema: { type: "integer", example: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", example: 10 } },
          ],
          responses: {
            200: { description: "Expenses fetched" },
          },
        },
        post: {
          tags: ["Expenses"],
          summary: "Create a new expense",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExpenseInput" },
              },
            },
          },
          responses: {
            201: { description: "Expense created" },
            422: { description: "Validation error" },
          },
        },
      },
      "/expenses/{id}": {
        get: {
          tags: ["Expenses"],
          summary: "Get single expense by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Expense fetched" },
            404: { description: "Not found" },
          },
        },
        put: {
          tags: ["Expenses"],
          summary: "Update an expense",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExpenseInput" },
              },
            },
          },
          responses: {
            200: { description: "Expense updated" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Expenses"],
          summary: "Delete an expense",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Expense deleted" },
            404: { description: "Not found" },
          },
        },
      },
      "/expenses/by-category": {
        get: {
          tags: ["Expenses"],
          summary: "Get expenses grouped by category",
          responses: {
            200: { description: "Expenses by category fetched" },
          },
        },
      },
      // ─── BUDGETS ─────────────────────────────────────────────────────
      "/budgets": {
        get: {
          tags: ["Budgets"],
          summary: "Get all budgets",
          responses: { 200: { description: "Budgets fetched" } },
        },
        post: {
          tags: ["Budgets"],
          summary: "Create a budget",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BudgetInput" },
              },
            },
          },
          responses: { 201: { description: "Budget created" } },
        },
      },
      "/budgets/{id}": {
        get: {
          tags: ["Budgets"],
          summary: "Get budget by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Budget fetched" }, 404: { description: "Not found" } },
        },
        put: {
          tags: ["Budgets"],
          summary: "Update a budget",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/BudgetInput" } } },
          },
          responses: { 200: { description: "Budget updated" } },
        },
        delete: {
          tags: ["Budgets"],
          summary: "Delete a budget",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Budget deleted" } },
        },
      },
      "/budgets/{id}/status": {
        get: {
          tags: ["Budgets"],
          summary: "Get budget usage status",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Budget status fetched" } },
        },
      },
      // ─── ANALYTICS ───────────────────────────────────────────────────
      "/analytics/summary": {
        get: {
          tags: ["Analytics"],
          summary: "Get expense summary (total, avg, count)",
          parameters: [
            { in: "query", name: "startDate", schema: { type: "string", format: "date" } },
            { in: "query", name: "endDate", schema: { type: "string", format: "date" } },
          ],
          responses: { 200: { description: "Summary fetched" } },
        },
      },
      "/analytics/monthly-trend": {
        get: {
          tags: ["Analytics"],
          summary: "Get monthly spending trend",
          parameters: [
            { in: "query", name: "year", schema: { type: "integer", example: 2024 } },
          ],
          responses: { 200: { description: "Monthly trend fetched" } },
        },
      },
      "/analytics/by-category": {
        get: {
          tags: ["Analytics"],
          summary: "Get spending breakdown by category",
          responses: { 200: { description: "Category breakdown fetched" } },
        },
      },
      "/analytics/top-categories": {
        get: {
          tags: ["Analytics"],
          summary: "Get top spending categories",
          responses: { 200: { description: "Top categories fetched" } },
        },
      },
      "/analytics/insights": {
        get: {
          tags: ["Analytics"],
          summary: "Get spending insights and tips",
          responses: { 200: { description: "Insights fetched" } },
        },
      },
      "/analytics/daily": {
        get: {
          tags: ["Analytics"],
          summary: "Get daily spending for a month",
          parameters: [
            { in: "query", name: "month", schema: { type: "integer", example: 6 } },
            { in: "query", name: "year", schema: { type: "integer", example: 2024 } },
          ],
          responses: { 200: { description: "Daily spending fetched" } },
        },
      },
      // ─── REPORTS ─────────────────────────────────────────────────────
      "/reports": {
        get: {
          tags: ["Reports"],
          summary: "Get all reports",
          responses: { 200: { description: "Reports fetched" } },
        },
      },
      "/reports/generate": {
        post: {
          tags: ["Reports"],
          summary: "Generate a monthly report",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["month", "year"],
                  properties: {
                    month: { type: "integer", example: 6 },
                    year: { type: "integer", example: 2024 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Report generated" } },
        },
      },
      "/reports/{id}": {
        get: {
          tags: ["Reports"],
          summary: "Get report by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Report fetched" }, 404: { description: "Not found" } },
        },
        delete: {
          tags: ["Reports"],
          summary: "Delete a report",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Report deleted" } },
        },
      },
      "/reports/{id}/export/pdf": {
        get: {
          tags: ["Reports"],
          summary: "Export report as PDF",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "PDF file",
              content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
            },
          },
        },
      },
      "/reports/{id}/export/excel": {
        get: {
          tags: ["Reports"],
          summary: "Export report as Excel",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Excel file",
              content: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                  schema: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
      },
      // ─── GOALS ───────────────────────────────────────────────────────
      "/goals": {
        get: {
          tags: ["Goals"],
          summary: "Get all goals",
          responses: { 200: { description: "Goals fetched" } },
        },
        post: {
          tags: ["Goals"],
          summary: "Create a savings goal",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/GoalInput" } } },
          },
          responses: { 201: { description: "Goal created" } },
        },
      },
      "/goals/{id}": {
        get: {
          tags: ["Goals"],
          summary: "Get goal by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Goal fetched" }, 404: { description: "Not found" } },
        },
        put: {
          tags: ["Goals"],
          summary: "Update a goal",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/GoalInput" } } },
          },
          responses: { 200: { description: "Goal updated" } },
        },
        delete: {
          tags: ["Goals"],
          summary: "Delete a goal",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Goal deleted" } },
        },
      },
      "/goals/{id}/contribute": {
        post: {
          tags: ["Goals"],
          summary: "Add contribution to a goal",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["amount"],
                  properties: {
                    amount: { type: "number", example: 200 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Contribution added" } },
        },
      },
      // ─── WALLETS ─────────────────────────────────────────────────────
      "/wallets": {
        get: {
          tags: ["Wallets"],
          summary: "Get all wallets",
          responses: { 200: { description: "Wallets fetched" } },
        },
        post: {
          tags: ["Wallets"],
          summary: "Create a wallet",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/WalletInput" } } },
          },
          responses: { 201: { description: "Wallet created" } },
        },
      },
      "/wallets/{id}": {
        get: {
          tags: ["Wallets"],
          summary: "Get wallet by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Wallet fetched" } },
        },
        put: {
          tags: ["Wallets"],
          summary: "Update a wallet",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/WalletInput" } } },
          },
          responses: { 200: { description: "Wallet updated" } },
        },
        delete: {
          tags: ["Wallets"],
          summary: "Delete a wallet",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Wallet deleted" } },
        },
      },
      "/wallets/transfer": {
        post: {
          tags: ["Wallets"],
          summary: "Transfer funds between wallets",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["fromWalletId", "toWalletId", "amount"],
                  properties: {
                    fromWalletId: { type: "string" },
                    toWalletId: { type: "string" },
                    amount: { type: "number", example: 500 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Transfer successful" } },
        },
      },
      // ─── RECEIPTS ────────────────────────────────────────────────────
      "/receipts": {
        get: {
          tags: ["Receipts"],
          summary: "Get all receipts",
          responses: { 200: { description: "Receipts fetched" } },
        },
      },
      "/receipts/upload": {
        post: {
          tags: ["Receipts"],
          summary: "Upload a receipt image",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    receipt: { type: "string", format: "binary" },
                    note: { type: "string", example: "Grocery bill" },
                    expenseId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Receipt uploaded" } },
        },
      },
      "/receipts/{id}": {
        get: {
          tags: ["Receipts"],
          summary: "Get receipt by ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Receipt fetched" } },
        },
        delete: {
          tags: ["Receipts"],
          summary: "Delete a receipt",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Receipt deleted" } },
        },
      },
      "/receipts/{id}/link/{expenseId}": {
        put: {
          tags: ["Receipts"],
          summary: "Link receipt to an expense",
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" } },
            { in: "path", name: "expenseId", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Receipt linked" } },
        },
      },
      // ─── NOTIFICATIONS ───────────────────────────────────────────────
      "/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "Get all notifications",
          parameters: [
            { in: "query", name: "isRead", schema: { type: "boolean" } },
          ],
          responses: { 200: { description: "Notifications fetched" } },
        },
        delete: {
          tags: ["Notifications"],
          summary: "Delete all notifications",
          responses: { 200: { description: "All notifications deleted" } },
        },
      },
      "/notifications/unread-count": {
        get: {
          tags: ["Notifications"],
          summary: "Get unread notification count",
          responses: { 200: { description: "Unread count fetched" } },
        },
      },
      "/notifications/read-all": {
        put: {
          tags: ["Notifications"],
          summary: "Mark all notifications as read",
          responses: { 200: { description: "All marked as read" } },
        },
      },
      "/notifications/{id}/read": {
        put: {
          tags: ["Notifications"],
          summary: "Mark a notification as read",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Notification marked as read" } },
        },
      },
      "/notifications/{id}": {
        delete: {
          tags: ["Notifications"],
          summary: "Delete a notification",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Notification deleted" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Register Swagger UI middleware on the Express app
 * @param {import("express").Application} app
 */
export const setupSwagger = (app) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Smart Expense Tracker API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  // Expose raw JSON spec at /api/docs.json
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${env.PORT}/api/docs`);
};
