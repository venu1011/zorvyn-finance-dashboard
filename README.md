# Zorvyn Finance Dashboard — Frontend Assessment

Hey! This is my submission for the Frontend Developer Intern role at Zorvyn. I wanted to build something that wasn't just "functional" but actually felt like a premium product you'd want to use to track your money.

## 💡 What's inside?

I focused on making the dashboard clean, fast, and interactive. Here's a quick look at what I've implemented:

*   **Charts that actually help**: Used Recharts for a Balance Trend area chart and a Category Breakdown pie chart. They’re animated and responsive, so they look great on any screen.
*   **Transactions with all the bells & whistles**: You can search through your history, filter by category or type (income vs. expense), and sort them however you like.
*   **Admin vs. Viewer Modes**: I simulated a simple role-based UI. If you're an "Admin," you can add, edit, and delete transactions. If you're a "Viewer," you get a read-only experience. You can swap between them at the bottom of the sidebar.
*   **Dark Mode & Persistence**: I spent extra time making sure the theme switcher feels premium. Plus, I’ve hooked everything up to Local Storage, so your transactions and settings aren't gone the moment you hit refresh.
*   **CSV Export**: Added a quick way to download your data for those who like to keep their own spreadsheets.

## 🛠️ The Tech Used

I kept it modern and lightweight:
*   **React (Vite)**: For the core structure.
*   **Tailwind CSS**: For all the styling (I love how fast it is for building custom layouts).
*   **Framer Motion**: Used this for the smooth page transitions and micro-animations. It just makes the app feel "alive."
*   **Lucide React**: For those clean, consistent icons.

## 🚀 How to get it running

1.  Pop open your terminal and run `npm install` to grab the dependencies.
2.  Fire up the dev server with `npm run dev`.
3.  Open the link in your browser and you're good to go!

## 🧠 A bit about my approach

*   **UX First**: I moved the role switcher to the bottom with a "Profile" look because it felt more intuitive for a dashboard.
*   **Clean Code**: I used the React Context API to manage the global state (theme, roles, transactions) so the code stays organized and easy to read.
*   **Performance**: I made sure all the filtering and chart calculations happen efficiently so the app stays snappy even if you add a lot of data.

Thanks for checking out my work! I really enjoyed putting this together.

---
**Built with ❤️ by S Venu**
