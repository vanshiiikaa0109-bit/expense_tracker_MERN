// src/services/prediction.service.js
// Spending prediction and forecasting logic based on historical expense data

import { aggregateMonthlyTrend, aggregateByCategory } from "../repositories/expense.repository.js";

// ─── Simple linear regression helper ─────────────────────────────────────────
const linearRegression = (values) => {
  const n = values.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  values.forEach((y, x) => {
    numerator   += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });

  const slope     = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
};

// ─── Predict next month's spending ───────────────────────────────────────────

export const predictNextMonthSpending = async (userId) => {
  const now  = new Date();
  const year = now.getFullYear();

  // Get current year monthly trend
  const monthlyData = await aggregateMonthlyTrend(userId, year);

  // Fill all 12 months (missing months = 0)
  const totals = Array.from({ length: 12 }, (_, i) => {
    const found = monthlyData.find((d) => d.month === i + 1);
    return found ? found.total : 0;
  });

  // Use only months up to the current month for regression
  const currentMonth = now.getMonth(); // 0-indexed
  const dataPoints   = totals.slice(0, currentMonth + 1);

  if (dataPoints.length < 2) {
    return {
      predictedAmount: dataPoints[0] || 0,
      confidence: "low",
      note: "Not enough data for accurate prediction. Keep tracking your expenses.",
    };
  }

  const { slope, intercept } = linearRegression(dataPoints);
  const nextIndex     = dataPoints.length;
  const predicted     = Math.max(intercept + slope * nextIndex, 0);
  const roundedAmount = parseFloat(predicted.toFixed(2));

  // Confidence based on data points available
  const confidence = dataPoints.length >= 6 ? "high" : dataPoints.length >= 3 ? "medium" : "low";

  return {
    predictedAmount: roundedAmount,
    confidence,
    basedOnMonths: dataPoints.length,
    trend: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
    note: `Prediction based on ${dataPoints.length} month(s) of data using linear regression.`,
  };
};

// ─── Predict per-category spending for next month ────────────────────────────

export const predictCategorySpending = async (userId) => {
  const now = new Date();

  // Use last 3 months of category data
  const ranges = [0, 1, 2].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return {
      startDate: new Date(d.getFullYear(), d.getMonth(), 1),
      endDate:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    };
  });

  const [m0, m1, m2] = await Promise.all(
    ranges.map((r) => aggregateByCategory(userId, r.startDate, r.endDate))
  );

  // Collect all unique categories across the 3 months
  const allCategories = [...new Set([...m0, ...m1, ...m2].map((d) => d.category))];

  const predictions = allCategories.map((category) => {
    const getTotal = (data) => data.find((d) => d.category === category)?.total || 0;
    const values   = [getTotal(m2), getTotal(m1), getTotal(m0)]; // oldest → newest

    const { slope, intercept } = linearRegression(values);
    const predicted = Math.max(intercept + slope * 3, 0);

    return {
      category,
      predictedAmount: parseFloat(predicted.toFixed(2)),
      lastMonthAmount: parseFloat(getTotal(m0).toFixed(2)),
      trend: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
    };
  });

  // Sort by predicted amount descending
  predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);

  return {
    predictions,
    note: "Predictions based on last 3 months of spending per category.",
  };
};
