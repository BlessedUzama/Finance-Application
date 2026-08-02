# 💎 ApexFinance PRO - Financial Management & Portfolio Dashboard

A modern, high-performance financial management application and net worth portfolio tracker built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## ✨ Features Overview

### 📊 1. Real-Time Financial Overview
- **Income, Expense & Savings Metrics**: Automatically computes total monthly income, expenses, net savings, and savings rate targets.
- **Dynamic Multi-Currency Engine**: Real-time currency conversions between **USD ($)**, **EUR (€)**, **GBP (£)**, **NGN (₦)**, and **CAD (CA$)**.

### 🎯 2. Category Budget Tracker
- **Budget Allocation & Progress Bars**: Live visual feedback on spending relative to monthly cap limits.
- **Custom Category Manager**: Add new custom budget categories with custom icons, color badges, and allocation caps.
- **Warning & Over-Budget Alerts**: Automatic status badges (On Track, Warning at 80%, Over Budget at 100%).

### 💼 3. Net Worth & Portfolio Balance Sheet
- **Asset Management**: Track checking, savings, index funds, real estate equity, and vehicle assets.
- **Liability Tracking**: Monitor mortgages, credit card balances, and student loans.
- **Real-Time Net Worth**: Instant computation of total assets owned minus liabilities owed.

### 🏆 4. Savings & Investment Goals
- **Milestone Tracking**: Visual target date tracking, target amount goals, and current saved balances.
- **Capital Deposit Modal**: Deposit funds directly toward specific goals with instant progress bar updates.

### 📅 5. Interactive Bill & Subscription Calendar
- **Payment Schedule**: Monthly calendar layout displaying due dates for recurring bills and subscriptions.
- **Date Inspection & Multi-Bill Action Popovers**: Click anywhere on a date cell to view, inspect, mark as paid, or remove single/multiple due items.

### 🔄 6. Subscriptions Overhead Monitor
- **Overhead Calculation**: Automatically computes total monthly and annual recurring overheads for streaming services, memberships, and software.
- **Quick Action**: One-click subscription creation and payment tracking.

### 📥 7. Multi-Format Data Import & Export
- **Import Data**: Import financial records from **CSV**, **JSON**, **TSV**, or **TXT** files with automatic field parsing.
- **Export Statements**: Export transaction histories to professional **PDF Statements**, **CSV Spreadsheets**, **JSON Data**, or **Text Reports**.

### ☀️ 8. Instant Light & Dark Mode
- **System Default Auto-Syncing**: Syncs automatically with OS system preferences.
- **One-Click Theme Toggle**: Instant 0ms dark mode toggle button supporting high-contrast light & dark themes.

### 📱 9. Fully Responsive Mobile & Desktop Layout
- **Mobile-First Responsiveness**: Designed to render cleanly on screens ranging from iPhone SE (375px) to ultra-wide desktop monitors.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript
- **Build Tooling**: Vite
- **Styling**: Tailwind CSS v4 with custom dark mode variants
- **Export Utilities**: jsPDF (PDF statements) & HTML5 Canvas / Portals
- **Icons**: Inline SVG icons & Emoji design tokens

---

## 📂 Directory Structure

```text
Finance-Application/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AddTransactionModal.tsx
│   │   │   ├── BillCalendar.tsx
│   │   │   ├── BudgetTracker.tsx
│   │   │   ├── CategoryManagerModal.tsx
│   │   │   ├── DataImportModal.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   ├── NetWorthTracker.tsx
│   │   │   ├── SavingsGoals.tsx
│   │   │   ├── SubscriptionsMonitor.tsx
│   │   │   └── TransactionTable.tsx
│   │   └── layout/
│   │       └── DashboardLayout.tsx
│   ├── context/
│   │   └── FinanceContext.tsx
│   ├── types/
│   │   └── finance.ts
│   ├── utils/
│   │   └── dataExport.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+ recommended) and **npm** installed on your system.

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/BlessedUzama/Finance-Application.git
cd Finance-Application
npm install
```

### 2. Run Development Server
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
To create an optimized production bundle:
```bash
npm run build
```

---

## 📜 License

This project is open-source and available under the **MIT License**.
