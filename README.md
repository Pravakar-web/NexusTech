# NexusTech Pro — Modern Product Information & Inventory Hub

A feature-complete, modern **Product Information Website & Inventory Management Hub** built with pure **semantic HTML5**, modern **CSS3 with Glassmorphism**, and **vanilla JavaScript (ES6+)** — zero external frameworks or dependencies.

![NexusTech Pro Badge](https://img.shields.io/badge/Tech%20Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-6366f1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Fully%20Functional%20%26%20Interactive-10b981?style=for-the-badge)

---

## 🌟 Modern UI & Features

### 1. 📊 Live Dynamic Stats Overview
- **Total Products** (calculated live with active category count).
- **Average Price** ($) & Total Catalog Valuation.
- **In-Stock Rate (%)** with green/red status breakdown.
- **Customer Satisfaction Rating** with top-rated item highlights.

### 2. ⚡ Full CRUD Functionality
- **➕ Add New Product**: Interactive modal dialog with form validation (Name, Brand, Category, Price, Stock Status, Rating, Color picker, and Description).
- **👁️ Read / Quick Specs**: Slide-over quick-view drawer displaying a full spec matrix, color swatch card, and interactive star rating buttons.
- **✏️ Edit Product**: Edit existing specifications directly in the modal form.
- **🗑️ Delete Product**: Safe deletion with confirmation modal and feedback toast.
- **💾 LocalStorage Persistence**: Added, edited, and deleted products remain saved across page refreshes. "Reset Data" restores default sample records.

### 3. 🌓 Modern Design System & Dual Themes
- **Dark Mode (Default)**: Deep canvas `#060911` with animated floating ambient mesh glow and frosted glass cards.
- **Light Mode**: Crisp, clean, modern dashboard aesthetic with smooth theme transition.
- **View Switcher**: Toggle seamlessly between **HTML5 Data Table View (☷)** and **Modern eCommerce Card Grid View (▦)**.

### 4. 🔍 Instant Search, Filters & Sorting
- **Real-Time Search**: Instant fuzzy matching across product names, brands, categories, colors, SKUs, and descriptions. Press `/` anywhere to focus search.
- **Category Filter Pills**: Dynamic category buttons with live item counters (All, Audio, Wearables, Peripherals, Displays, Accessories).
- **Availability Filter**: Filter by In Stock, Low Stock, or Out of Stock.
- **Column Sorting**: Click any table header (Name, Brand, Category, Price, Stock, Rating) to sort ascending or descending with visual indicators.

### 5. 📦 Bulk Operations & Data Export
- **Multi-Select Checkboxes**: Select individual products or use "Select All" in the header.
- **Bulk Action Bar**: Set stock status in bulk, delete selected items, or export selected rows.
- **Export to CSV**: Instant `.csv` file generation and download.
- **Print Report**: Pre-styled printable catalog view.

---

## 📂 Project Structure

```
├── index.html   # Semantic HTML5 table, stats, modals, and drawer
├── style.css    # Modern CSS3 design tokens, glassmorphism, responsive styles
├── script.js    # Vanilla JS application engine & state management
└── README.md    # Complete documentation
```

---

## 🚀 Running Locally

Open `index.html` directly in any web browser, or serve with:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.
