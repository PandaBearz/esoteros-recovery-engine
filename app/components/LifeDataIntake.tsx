'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";

type ProfileSettings = {
  name: string;
  currency: string;
  timeZone: string;
};

type AccountType = "checking" | "savings" | "credit" | "investment" | "other";

type Account = {
  id: string;
  label: string;
  type: AccountType;
  startingBalance: number;
};

type CsvPreviewRow = {
  [key: string]: string;
};

const defaultProfile: ProfileSettings = {
  name: "",
  currency: "USD",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

const LifeDataIntake: React.FC = () => {
  // ----- Profile -----
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfile);
  const [profileSaved, setProfileSaved] = useState(false);

  // ----- Accounts -----
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountLabel, setNewAccountLabel] = useState("");
  const [newAccountType, setNewAccountType] = useState<AccountType>("checking");
  const [newAccountBalance, setNewAccountBalance] = useState<string>("");

  // ----- CSV Upload -----
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreviewRow[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // ----- Handlers: Profile -----
  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setProfileSaved(false);
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setProfileSaved(true);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // ----- Handlers: Accounts -----
  const handleAddAccount = async (e: FormEvent) => {
    e.preventDefault();

    if (!newAccountLabel.trim()) return;
    const parsed = parseFloat(newAccountBalance || "0");
    if (Number.isNaN(parsed)) return;

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newAccountLabel.trim(),
          type: newAccountType,
          startingBalance: parsed,
        }),
      });

      if (res.ok) {
        const newAccount = await res.json();
        setAccounts((prev) => [...prev, newAccount]);
        setNewAccountLabel("");
        setNewAccountBalance("");
        setNewAccountType("checking");
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  // ----- Handlers: CSV Upload -----
  const parseCsv = async (file: File) => {
    setCsvError(null);
    setCsvPreview([]);
    setCsvFileName(file.name);

    try {
      const text = await file.text();
      const [headerLine, ...rows] = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (!headerLine) {
        setCsvError("CSV appears to be empty.");
        return;
      }

      const headers = headerLine.split(",").map((h) => h.trim());
      const previewRows: CsvPreviewRow[] = [];

      for (let i = 0; i < Math.min(rows.length, 5); i++) {
        const row = rows[i];
        const cols = row.split(",").map((c) => c.trim());
        const obj: CsvPreviewRow = {};
        headers.forEach((h, idx) => {
          obj[h] = cols[idx] ?? "";
        });
        previewRows.push(obj);
      }

      setCsvPreview(previewRows);
    } catch (err) {
      console.error(err);
      setCsvError("Failed to read CSV file.");
    }
  };

  const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsv(file);
  };

  const handleImportCsv = async () => {
    if (!csvFileName) return;
    setIsImporting(true);
    setCsvError(null);

    try {
      const res = await fetch("/api/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: csvPreview }),
      });

      if (res.ok) {
        console.log("Import successful");
        // You might show a toast / success message here.
      } else {
        setCsvError("Import failed on server.");
      }
    } catch (err) {
      console.error(err);
      setCsvError("Failed to import CSV. Check console for details.");
    } finally {
      setIsImporting(false);
    }
  };

  // ----- Render helpers -----
  const renderCsvPreviewTable = () => {
    if (!csvPreview.length) return null;

    const headers = Object.keys(csvPreview[0]);
    return (
      <div className="mt-4 border border-slate-700 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-medium text-slate-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvPreview.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-800">
                {headers.map((h) => (
                  <td key={h} className="px-3 py-2 text-slate-400">
                    {row[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-3 py-2 text-xs text-slate-500">
          Showing first {csvPreview.length} rows as a preview.
        </p>
      </div>
    );
  };

  // ----- Component Layout -----
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center py-10">
      <div className="w-full max-w-6xl px-4 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Esoteros Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Life OS – Data Intake MVP
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <p>State: Front-end only • Demo mode</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/50 backdrop-blur-sm"
          >
            <h2 className="text-lg font-medium mb-3 text-sky-100">Profile & Settings</h2>
            <form className="space-y-3" onSubmit={handleProfileSubmit}>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">
                  Name / Alias
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="Sam, Neo, Captain..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">
                  Preferred Currency
                </label>
                <select
                  name="currency"
                  value={profile.currency}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                >
                  <option value="USD">USD – US Dollar</option>
                  <option value="EUR">EUR – Euro</option>
                  <option value="GBP">GBP – British Pound</option>
                  <option value="CAD">CAD – Canadian Dollar</option>
                  <option value="AUD">AUD – Australian Dollar</option>
                  <option value="JPY">JPY – Japanese Yen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">
                  Time Zone
                </label>
                <input
                  type="text"
                  name="timeZone"
                  value={profile.timeZone}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="America/New_York"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-sm font-medium transition-colors shadow-lg shadow-sky-900/20"
              >
                Save Profile
              </button>

              {profileSaved && (
                <p className="text-xs text-emerald-400 mt-1">
                  Profile saved (local state).
                </p>
              )}
            </form>
          </motion.section>

          {/* Accounts Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/50 backdrop-blur-sm flex flex-col"
          >
            <h2 className="text-lg font-medium mb-3 text-sky-100">Accounts</h2>

            <form className="space-y-3 mb-4" onSubmit={handleAddAccount}>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">
                  Account Label
                </label>
                <input
                  type="text"
                  value={newAccountLabel}
                  onChange={(e) => setNewAccountLabel(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="Chase Checking..."
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-slate-400">
                    Type
                  </label>
                  <select
                    value={newAccountType}
                    onChange={(e) =>
                      setNewAccountType(e.target.value as AccountType)
                    }
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                    <option value="investment">Investment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-slate-400">
                    Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-sm font-medium transition-colors shadow-lg shadow-sky-900/20"
              >
                Add Account
              </button>
            </form>

            <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {accounts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No accounts yet. Add one to start.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {accounts.map((acc) => (
                    <li
                      key={acc.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 hover:bg-slate-900/60 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-200">{acc.label}</p>
                        <p className="text-xs text-slate-400">
                          {acc.type} • {profile.currency}{" "}
                          {acc.startingBalance.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAccount(acc.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>

          {/* CSV Import Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/50 backdrop-blur-sm flex flex-col"
          >
            <h2 className="text-lg font-medium mb-3 text-sky-100">Import Transactions</h2>

            <div className="space-y-3">
              <div className="relative group">
                <label className="block text-xs font-medium mb-1 text-slate-400">
                  Upload CSV
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvChange}
                  className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-sky-500 file:transition-colors cursor-pointer"
                />
              </div>

              {csvFileName && (
                <p className="text-xs text-slate-400">
                  Selected: <span className="font-medium text-sky-300">{csvFileName}</span>
                </p>
              )}

              {csvError && (
                <p className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">{csvError}</p>
              )}

              {renderCsvPreviewTable()}

              <button
                type="button"
                disabled={!csvPreview.length || isImporting}
                onClick={handleImportCsv}
                className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all shadow-lg ${!csvPreview.length || isImporting
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
                  }`}
              >
                {isImporting ? "Importing..." : "Import Preview to Backend"}
              </button>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <p>Esoteros Analytics LLC</p>
          <p>MVP v0.1</p>
        </footer>
      </div>
    </div>
  );
};

export default LifeDataIntake;
