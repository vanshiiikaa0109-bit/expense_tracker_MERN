import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { currencies, getCurrencySymbol } from "../utils/currencies";

const CATEGORIES = ["Food", "Entertainment", "Utilities", "Shopping", "Travel", "Other"];

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [budgets, setBudgets] = useState({
    Food: user?.categoryBudgets?.Food || 0,
    Entertainment: user?.categoryBudgets?.Entertainment || 0,
    Utilities: user?.categoryBudgets?.Utilities || 0,
    Shopping: user?.categoryBudgets?.Shopping || 0,
    Travel: user?.categoryBudgets?.Travel || 0,
    Other: user?.categoryBudgets?.Other || 0
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: user?.notifications?.emailAlerts ?? true,
    weeklyReports: user?.notifications?.weeklyReports ?? false,
    thresholdWarnings: user?.notifications?.thresholdWarnings ?? true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currencySymbol = getCurrencySymbol(currency);

  const handleBudgetChange = (category, value) => {
    const amount = Number(value);
    setBudgets((current) => ({
      ...current,
      [category]: Number.isNaN(amount) ? 0 : amount
    }));
    setMessage("");
  };

  const handleNotificationChange = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key]
    }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({
        categoryBudgets: budgets,
        currency,
        notifications
      });
      setMessage("Settings updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Set default currency, budget limits, notifications, and theme.</p>
        </div>
      </div>

      {message && <div className="budget-alert alert-success">{message}</div>}
      {error && <div className="error-state">{error}</div>}

      <form className="settings-stack" onSubmit={handleSubmit}>
        <section className="card">
          <div className="status-row">
            <div>
              <h2>Default Currency</h2>
              <p className="muted">Choose the currency used across budgets, wallets, and reports.</p>
            </div>
            <strong className="currency-preview">{currencySymbol}</strong>
          </div>

          <label className="input-group" htmlFor="currency">
            <span>Select Currency</span>
            <select id="currency" className="select-field" value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.symbol} {item.name} ({item.code})
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="card">
          <h2>Monthly Category Budgets</h2>
          <p className="muted">These values keep backend field names unchanged through categoryBudgets.</p>
          <div className="grid grid-3 settings-grid">
            {CATEGORIES.map((category) => (
              <Input
                key={category}
                label={`${category} Budget Limit (${currencySymbol})`}
                id={`budget-${category}`}
                type="number"
                min="0"
                value={budgets[category]}
                onChange={(event) => handleBudgetChange(category, event.target.value)}
                placeholder="0"
              />
            ))}
          </div>
        </section>

        <section className="card">
          <h2>System Preferences</h2>
          <div className="settings-options">
            <label className="toggle-row">
              <input type="checkbox" checked={notifications.emailAlerts} onChange={() => handleNotificationChange("emailAlerts")} />
              <span>
                <strong>Email Alerts</strong>
                <small>Receive notification digests on high spending weeks.</small>
              </span>
            </label>

            <label className="toggle-row">
              <input type="checkbox" checked={notifications.weeklyReports} onChange={() => handleNotificationChange("weeklyReports")} />
              <span>
                <strong>Weekly Summary Digests</strong>
                <small>Get automated summaries at the end of each week.</small>
              </span>
            </label>

            <label className="toggle-row">
              <input type="checkbox" checked={notifications.thresholdWarnings} onChange={() => handleNotificationChange("thresholdWarnings")} />
              <span>
                <strong>Threshold Warnings</strong>
                <small>Show alerts when category spending crosses 80% of its limit.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="card">
          <div className="status-row">
            <div>
              <h2>Theme</h2>
              <p className="muted">Current theme: {theme}</p>
            </div>
            <Button onClick={toggleTheme}>Toggle Theme</Button>
          </div>
        </section>

        <div className="form-actions align-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Settings;