# Zorvyn Finance Dashboard — Frontend Assessment 💎

A premium, responsive financial management portal built for the **Frontend Developer Intern** role at Zorvyn. This project demonstrates modern UI/UX principles, state management with React Context, and high-performance data visualizations.

---

## 🚀 Getting Started (Setup Instructions)

To get the dashboard running on your local machine, follow these simple steps:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Installation
1.  *Clone the Repository*:
    ```bash
    git clone https://github.com/venu1011/zorvyn-finance-dashboard.git
    cd zorvyn-finance-dashboard
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the Dashboard**:
    ```bash
    npm run dev
    ```
4.  **View in Browser**: Open [http://localhost:5173](http://localhost:5173) to see the dashboard in action!

---

## 💡 Overview of Approach

My primary goal was to build a dashboard that feels **alive** and **premium**. I focused on three key pillars:

### 1. Robust State Management
I utilized the **React Context API** to create a centralized `DashboardContext`. This ensures that data (transactions, totals), user roles, and UI themes (Dark/Light) are globally accessible. This approach eliminates prop-drilling and ensures the interface stays in perfect sync across all sections (Dashboard, Transactions, and Insights).

### 2. High-Fidelity UX & Animations
To make the dashboard feel like a high-end product, I integrated **Framer Motion**. I used it for:
-   **Page Transitions**: Smooth fades and slides between tabs.
-   **Staggered Entrance**: Dashboard cards and list items entry animations.
-   **Touch Feedback**: Explicit visual indicators when tapping on charts in mobile view.

### 3. Component-Driven Architecture
The codebase is structured into clear, modular components (`Sidebar`, `Overview`, `TransactionsList`, `TransactionModal`). This makes the code highly maintainable and easy to extend with new features.

---

## 🔥 Features & Implementation

### 🛡️ Role-Based UI (RBAC)
I implemented a functional Role Switcher at the bottom of the sidebar. 
-   **Admin**: Can add, edit, and delete transactions.
-   **Viewer**: Read-only access with clear "Access Level" notifications.
-   **Real-time UX**: Switching roles triggers a toast notification to give immediate feedback to the user.

### 📊 Interactive Data Visualizations
Using **Recharts**, I built:
-   **Balance Trend**: A custom Area Chart visualizing cumulative wealth over time.
-   **Spending Breakdown**: A Donut Chart with a dedicated legend for category analysis.
-   *Note*: Both charts are optimized for mobile, featuring snappy tooltips and focus-rect removal for a cleaner touch experience.

### 💾 Data Persistence
The dashboard integrates **LocalStorage**. All your added transactions, chosen theme (Dark/Light), and current user role are automatically saved. Even after a hard refresh, the dashboard remains exactly as you left it.

### 📥 CSV Export
A dedicated export function allows users to download their filtered transaction history as a CSV file. This demonstrates handling practical data-export requirements in a frontend environment.

### 🌓 Premium Theme System
Implemented a full Light and Dark mode using **Tailwind CSS** and CSS variables (HSL). The theme is consistent across all charts, modals, and navigation elements.

---

## 🛠️ Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

---
**Built with ❤️ for the Zorvyn Assessment by S Venu**
