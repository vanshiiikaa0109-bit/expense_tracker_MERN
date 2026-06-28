export const calculateCategoryTotals = (expenses) => {
  const totals = {};
  expenses.forEach((expense) => {
    const { category, amount } = expense;
    if (totals[category]) {
      totals[category] += amount;
    } else {
      totals[category] = amount;
    }
  });
  return totals;
};

export const getBudgetStatus = (amountSpent, budgetLimit) => {
  if (!budgetLimit) return { ratio: 0, status: 'safe', percent: 0 };
  
  const ratio = amountSpent / budgetLimit;
  const percent = Math.round(ratio * 100);
  
  let status = 'safe';
  if (percent >= 100) {
    status = 'exceeded';
  } else if (percent >= 80) {
    status = 'warning';
  }
  
  return { ratio, status, percent };
};

export const calculateSpendingForecast = (expenses, daysCount = 30) => {
  if (!expenses || expenses.length === 0) return { dailyAverage: 0, monthlyForecast: 0 };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Find date range of expenses to calculate actual daily average
  const dates = expenses.map(e => new Date(e.date).getTime());
  const maxDate = Math.max(...dates);
  const minDate = Math.min(...dates);
  
  const timeDiff = maxDate - minDate;
  const actualDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
  
  const dailyAverage = totalSpent / actualDays;
  const monthlyForecast = dailyAverage * daysCount;

  return {
    dailyAverage: parseFloat(dailyAverage.toFixed(2)),
    monthlyForecast: parseFloat(monthlyForecast.toFixed(2))
  };
};
