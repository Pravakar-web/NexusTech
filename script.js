/**
 * NexusTech Pro - Product Information & Inventory Engine
 * Pure Vanilla JavaScript (ES6+) with Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Initial State & Sample Data
  // --------------------------------------------------------------------------
  const DEFAULT_PRODUCTS = [
    {
      id: 1,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      category: 'Audio',
      price: 399.99,
      stock: 'in-stock',
      rating: 4.8,
      color: 'Midnight Black',
      colorHex: '#111827',
      avatar: '🎧',
      sku: 'SNY-1005X',
      desc: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging.'
    },
    {
      id: 2,
      name: 'Apple Watch Series 9 GPS + Cellular',
      brand: 'Apple',
      category: 'Wearables',
      price: 429.00,
      stock: 'in-stock',
      rating: 4.9,
      color: 'Midnight Navy',
      colorHex: '#1e293b',
      avatar: '⌚',
      sku: 'APL-W945',
      desc: 'Powered by the S9 SiP chip with an ultra-bright Always-On Retina display and magical double-tap gesture control.'
    },
    {
      id: 3,
      name: 'Logitech MX Master 3S Performance Mouse',
      brand: 'Logitech',
      category: 'Peripherals',
      price: 99.99,
      stock: 'low-stock',
      rating: 4.7,
      color: 'Pale Grey',
      colorHex: '#64748b',
      avatar: '🖱️',
      sku: 'LOG-MX3S',
      desc: 'Ergonomic precision mouse featuring 8,000 DPI track-on-glass optical sensor and Quiet Clicks technology.'
    },
    {
      id: 4,
      name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
      brand: 'Dell',
      category: 'Displays',
      price: 549.99,
      stock: 'in-stock',
      rating: 4.6,
      color: 'Platinum Silver',
      colorHex: '#94a3b8',
      avatar: '🖥️',
      sku: 'DEL-U2723',
      desc: 'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 wide color gamut, and 90W single-cable USB-C power delivery.'
    },
    {
      id: 5,
      name: 'Keychron K2 Pro QMK Wireless Keyboard',
      brand: 'Keychron',
      category: 'Peripherals',
      price: 119.00,
      stock: 'out-stock',
      rating: 4.5,
      color: 'Carbon Grey',
      colorHex: '#334155',
      avatar: '⌨️',
      sku: 'KEY-K2PRO',
      desc: '75% layout custom mechanical keyboard with hot-swappable switches, screw-in stabilizers, and QMK/VIA key mapping.'
    },
    {
      id: 6,
      name: 'Bose SoundLink Revolve+ II Bluetooth Speaker',
      brand: 'Bose',
      category: 'Audio',
      price: 229.00,
      stock: 'in-stock',
      rating: 4.8,
      color: 'Triple Black',
      colorHex: '#0f172a',
      avatar: '🔊',
      sku: 'BSE-RVL2',
      desc: 'True 360-degree sound with deep bass, durable IP55 water-resistant construction, and flexible carry handle.'
    },
    {
      id: 7,
      name: 'Garmin Fenix 7X Pro Solar Smartwatch',
      brand: 'Garmin',
      category: 'Wearables',
      price: 899.99,
      stock: 'in-stock',
      rating: 4.9,
      color: 'Titanium Slate',
      colorHex: '#475569',
      avatar: '🧭',
      sku: 'GAR-FNX7',
      desc: 'Multisport GPS smartwatch with Power Sapphire solar charging lens, built-in LED flashlight, and advanced topo mapping.'
    },
    {
      id: 8,
      name: 'Anker Prime 20,000mAh Power Bank 200W',
      brand: 'Anker',
      category: 'Accessories',
      price: 129.99,
      stock: 'in-stock',
      rating: 4.7,
      color: 'Space Black',
      colorHex: '#18181b',
      avatar: '🔋',
      sku: 'ANK-P200',
      desc: '200W total output with smart digital display, ultra-compact design, and active battery health monitoring.'
    }
  ];

  // Load from LocalStorage or initialize
  let products = JSON.parse(localStorage.getItem('nexustech_products_v3')) || DEFAULT_PRODUCTS;

  // App Filter & View State
  let currentCategory = 'all';
  let currentStock = 'all';
  let currentSearchQuery = '';
  let currentSort = 'default';
  let currentViewMode = 'table'; // 'table' or 'grid'
  let selectedProduct = null;
  let bulkSelectedIds = new Set();
  let pendingDeleteId = null;
  let lastDeletedProduct = null;

  // --------------------------------------------------------------------------
  // 2. DOM Elements
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const liveTimeDisplay = document.getElementById('live-time-display');
  const globalSearchInput = document.getElementById('global-search-input');
  const btnSearchClear = document.getElementById('btn-search-clear');
  const stockSelectFilter = document.getElementById('stock-select-filter');
  const priceSortFilter = document.getElementById('price-sort-filter');
  const categoryPillGroup = document.getElementById('category-pill-group');
  const renderedCountText = document.getElementById('rendered-count-text');
  
  // Views
  const tableViewContainer = document.getElementById('table-view-container');
  const gridViewContainer = document.getElementById('grid-view-container');
  const btnViewTable = document.getElementById('btn-view-table');
  const btnViewGrid = document.getElementById('btn-view-grid');
  const tableBody = document.getElementById('nexus-table-body');
  const tableFoot = document.getElementById('nexus-table-foot');
  const productCardsGrid = document.getElementById('product-cards-grid');
  const emptyState = document.getElementById('empty-state');
  const selectAllCheckbox = document.getElementById('select-all-checkbox');

  // Stats Elements
  const statTotalVal = document.getElementById('stat-total-val');
  const statCategoriesCount = document.getElementById('stat-categories-count');
  const statAvgPriceVal = document.getElementById('stat-avg-price-val');
  const statTotalValSum = document.getElementById('stat-total-val-sum');
  const statInStockRate = document.getElementById('stat-in-stock-rate');
  const statStockBreakdown = document.getElementById('stat-stock-breakdown');
  const statOutStockBreakdown = document.getElementById('stat-out-stock-breakdown');
  const statAvgRatingVal = document.getElementById('stat-avg-rating-val');
  const statTopRatedName = document.getElementById('stat-top-rated-name');

  // Interactive Selection Banner
  const selectionBanner = document.getElementById('selection-banner');
  const bannerText = document.getElementById('banner-text');
  const btnBannerView = document.getElementById('btn-banner-view');
  const btnBannerEdit = document.getElementById('btn-banner-edit');
  const btnClearSelection = document.getElementById('btn-clear-selection');

  // Bulk Actions Bar
  const bulkActionBar = document.getElementById('bulk-action-bar');
  const bulkSelectedCount = document.getElementById('bulk-selected-count');
  const btnBulkInStock = document.getElementById('btn-bulk-in-stock');
  const btnBulkExport = document.getElementById('btn-bulk-export');
  const btnBulkDelete = document.getElementById('btn-bulk-delete');
  const btnBulkCancel = document.getElementById('btn-bulk-cancel');

  // Modal 1: Form (Add/Edit)
  const formModal = document.getElementById('product-form-modal');
  const formModalTitle = document.getElementById('form-modal-title');
  const formSubmitText = document.getElementById('form-submit-text');
  const productForm = document.getElementById('product-form');
  const btnOpenAddModal = document.getElementById('btn-open-add-modal');
  const btnCloseFormModal = document.getElementById('btn-close-form-modal');
  const btnCancelForm = document.getElementById('btn-cancel-form');
  const formProductId = document.getElementById('form-product-id');
  const formName = document.getElementById('form-name');
  const formBrand = document.getElementById('form-brand');
  const formCategory = document.getElementById('form-category');
  const formPrice = document.getElementById('form-price');
  const formStock = document.getElementById('form-stock');
  const formRating = document.getElementById('form-rating');
  const formColorHex = document.getElementById('form-color-hex');
  const formColorName = document.getElementById('form-color-name');
  const formDesc = document.getElementById('form-desc');

  // Modal 2: Quick-View Drawer
  const quickViewDrawer = document.getElementById('quick-view-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerProductTitle = document.getElementById('drawer-product-title');
  const drawerCategoryBadge = document.getElementById('drawer-category-badge');
  const drawerSku = document.getElementById('drawer-sku');
  const drawerBrand = document.getElementById('drawer-brand');
  const drawerPrice = document.getElementById('drawer-price');
  const drawerStockBadge = document.getElementById('drawer-stock-badge');
  const drawerRatingBadge = document.getElementById('drawer-rating-badge');
  const drawerColorSwatch = document.getElementById('drawer-color-swatch');
  const drawerColorLabel = document.getElementById('drawer-color-label');
  const drawerDesc = document.getElementById('drawer-desc');
  const drawerStarRatingGroup = document.getElementById('drawer-star-rating-group');
  const btnDrawerEdit = document.getElementById('btn-drawer-edit');
  const btnDrawerDelete = document.getElementById('btn-drawer-delete');
  const btnDrawerHighlight = document.getElementById('btn-drawer-highlight');

  // Modal 3: Delete Confirm
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const deleteConfirmText = document.getElementById('delete-confirm-text');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');

  // Quick Action Buttons
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnPrintCatalog = document.getElementById('btn-print-catalog');
  const btnResetDemoData = document.getElementById('btn-reset-demo-data');
  const btnClearAllFilters = document.getElementById('btn-clear-all-filters');
  const btnEmptyAddProduct = document.getElementById('btn-empty-add-product');
  const navSearchBtn = document.getElementById('nav-search-btn');

  // --------------------------------------------------------------------------
  // 3. Theme Engine & Live Clock
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem('nexustech_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const nextTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('nexustech_theme', nextTheme);
    showToast(`Switched to ${nextTheme.toUpperCase()} mode`, '🌓');
  });

  function updateClock() {
    const now = new Date();
    liveTimeDisplay.textContent = now.toUTCString().slice(17, 25) + ' UTC';
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --------------------------------------------------------------------------
  // 4. State Management (Save / Reset)
  // --------------------------------------------------------------------------
  function saveProducts() {
    localStorage.setItem('nexustech_products_v3', JSON.stringify(products));
    updateStatsOverview();
    renderCategoryPills();
    renderCatalog();
  }

  btnResetDemoData.addEventListener('click', () => {
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    bulkSelectedIds.clear();
    selectedProduct = null;
    saveProducts();
    resetSelectionBanner();
    showToast('Catalog restored to default sample data', '🔄');
  });

  // --------------------------------------------------------------------------
  // 5. Dynamic Stats Calculation
  // --------------------------------------------------------------------------
  function updateStatsOverview() {
    const total = products.length;
    statTotalVal.textContent = total;

    const categories = new Set(products.map(p => p.category));
    statCategoriesCount.textContent = `${categories.size} Categories`;

    if (total === 0) {
      statAvgPriceVal.textContent = '$0.00';
      statTotalValSum.textContent = 'Total Val: $0';
      statInStockRate.textContent = '0%';
      statStockBreakdown.textContent = '0 In Stock';
      statOutStockBreakdown.textContent = '0 Out of Stock';
      statAvgRatingVal.textContent = '0.0 ★';
      statTopRatedName.textContent = 'Top: -';
      return;
    }

    const sumPrice = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
    const avgPrice = (sumPrice / total).toFixed(2);
    statAvgPriceVal.textContent = `$${avgPrice}`;
    statTotalValSum.textContent = `Total Val: $${sumPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const inStockCount = products.filter(p => p.stock === 'in-stock').length;
    const lowStockCount = products.filter(p => p.stock === 'low-stock').length;
    const outStockCount = products.filter(p => p.stock === 'out-stock').length;
    const rate = Math.round(((inStockCount + lowStockCount) / total) * 100);

    statInStockRate.textContent = `${rate}%`;
    statStockBreakdown.textContent = `${inStockCount + lowStockCount} In/Low Stock`;
    statOutStockBreakdown.textContent = `${outStockCount} Out of Stock`;

    const avgRating = (products.reduce((acc, p) => acc + (parseFloat(p.rating) || 0), 0) / total).toFixed(1);
    statAvgRatingVal.textContent = `${avgRating} ★`;

    const topRated = [...products].sort((a, b) => b.rating - a.rating)[0];
    statTopRatedName.textContent = `Top: ${topRated ? topRated.name.split(' ')[0] : '-'}`;
  }

  // --------------------------------------------------------------------------
  // 6. Category Pills Renderer
  // --------------------------------------------------------------------------
  function renderCategoryPills() {
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    let html = `
      <button class="cat-filter-btn ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">
        <span>All Items</span>
        <span class="cat-badge-counter">${products.length}</span>
      </button>
    `;

    Object.keys(categoryCounts).sort().forEach(cat => {
      html += `
        <button class="cat-filter-btn ${currentCategory === cat ? 'active' : ''}" data-cat="${cat}">
          <span>${cat}</span>
          <span class="cat-badge-counter">${categoryCounts[cat]}</span>
        </button>
      `;
    });

    categoryPillGroup.innerHTML = html;

    // Attach click events
    categoryPillGroup.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        renderCategoryPills();
        renderCatalog();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Catalog Filtering, Sorting & Rendering Engine
  // --------------------------------------------------------------------------
  function getFilteredAndSortedProducts() {
    let list = [...products];

    // Category filter
    if (currentCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // Stock filter
    if (currentStock !== 'all') {
      list = list.filter(p => p.stock === currentStock);
    }

    // Search Query
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (currentSort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating-desc': return b.rating - a.rating;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'brand-asc': return a.brand.localeCompare(b.brand);
        case 'brand-desc': return b.brand.localeCompare(a.brand);
        case 'category-asc': return a.category.localeCompare(b.category);
        case 'category-desc': return b.category.localeCompare(a.category);
        case 'stock-asc': return a.stock.localeCompare(b.stock);
        case 'stock-desc': return b.stock.localeCompare(a.stock);
        default: return a.id - b.id;
      }
    });

    return list;
  }

  function renderCatalog() {
    const filteredList = getFilteredAndSortedProducts();
    renderedCountText.textContent = `Showing ${filteredList.length} of ${products.length} products`;

    if (filteredList.length === 0) {
      emptyState.classList.remove('hidden');
      tableViewContainer.classList.add('hidden');
      gridViewContainer.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    if (currentViewMode === 'table') {
      tableViewContainer.classList.remove('hidden');
      gridViewContainer.classList.add('hidden');
      renderTableView(filteredList);
    } else {
      tableViewContainer.classList.add('hidden');
      gridViewContainer.classList.remove('hidden');
      renderGridView(filteredList);
    }

    updateBulkActionBar();
  }

  // --------------------------------------------------------------------------
  // 8. Render Table View
  // --------------------------------------------------------------------------
  function renderTableView(list) {
    tableBody.innerHTML = '';

    list.forEach(p => {
      const isChecked = bulkSelectedIds.has(p.id);
      const isSelected = selectedProduct && selectedProduct.id === p.id;
      const formattedPrice = `$${parseFloat(p.price).toFixed(2)}`;

      const tr = document.createElement('tr');
      tr.className = `${isSelected ? 'row-selected' : ''}`;
      tr.setAttribute('data-id', p.id);

      tr.innerHTML = `
        <td class="td-cb" onclick="event.stopPropagation();">
          <input type="checkbox" class="custom-cb row-checkbox" data-id="${p.id}" ${isChecked ? 'checked' : ''}>
        </td>
        <td class="td-id">#${String(p.id).padStart(2, '0')}</td>
        <td class="td-product">
          <div class="product-cell-group">
            <div class="product-glow-avatar">${p.avatar || '📦'}</div>
            <div class="product-meta-text">
              <strong>${p.name}</strong>
              <span class="product-sku-code">${p.sku || 'SKU: PROD-' + p.id}</span>
            </div>
          </div>
        </td>
        <td class="td-brand"><span class="brand-chip">${p.brand}</span></td>
        <td class="td-category"><span class="cat-pill cat-${p.category}">${p.category}</span></td>
        <td class="td-price"><span class="price-display">${formattedPrice}</span></td>
        <td class="td-stock">
          <span class="status-pill status-${p.stock}">
            <span class="status-dot-pulse"></span>
            ${p.stock === 'in-stock' ? 'In Stock' : p.stock === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
          </span>
        </td>
        <td class="td-rating">
          <div class="rating-chip">
            <span class="star-symbol">★</span>
            <span class="rating-score">${p.rating}</span>
            <span class="rating-scale">/5</span>
          </div>
        </td>
        <td class="td-color">
          <div class="color-item-wrapper">
            <span class="color-dot-ring" style="background-color: ${p.colorHex || '#4f46e5'};"></span>
            <span>${p.color}</span>
          </div>
        </td>
        <td class="td-desc">${p.desc}</td>
        <td class="td-actions" onclick="event.stopPropagation();">
          <div class="table-action-btns">
            <button class="btn-inline-action btn-action-view" data-id="${p.id}" title="Quick Specs Drawer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="btn-inline-action btn-action-edit" data-id="${p.id}" title="Edit product">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-inline-action btn-action-delete" data-id="${p.id}" title="Delete product">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;

      // Row Click to select & banner update
      tr.addEventListener('click', () => {
        selectProduct(p);
      });

      // Double-click to open drawer
      tr.addEventListener('dblclick', () => {
        openQuickViewDrawer(p);
      });

      tableBody.appendChild(tr);
    });

    // Render Table Foot Summary
    const sumPrice = list.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
    const avgPrice = list.length > 0 ? (sumPrice / list.length).toFixed(2) : '0.00';
    const inStock = list.filter(p => p.stock === 'in-stock').length;
    const lowStock = list.filter(p => p.stock === 'low-stock').length;
    const outStock = list.filter(p => p.stock === 'out-stock').length;

    tableFoot.innerHTML = `
      <tr>
        <td colspan="5" class="tfoot-left">
          <div class="tfoot-summary-box">
            <strong>Table Summary:</strong>
            <span>${list.length} Products displayed</span>
          </div>
        </td>
        <td class="tfoot-avg-price">Avg: $${avgPrice}</td>
        <td colspan="5" class="tfoot-right">
          <div class="tfoot-pills-row">
            <span class="summary-pill pill-green">${inStock + lowStock} Available</span>
            <span class="summary-pill pill-red">${outStock} Out of Stock</span>
          </div>
        </td>
      </tr>
    `;

    // Attach Row Checkbox Events
    tableBody.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (e.target.checked) bulkSelectedIds.add(id);
        else bulkSelectedIds.delete(id);
        updateBulkActionBar();
      });
    });

    // Attach Action Buttons inside rows
    tableBody.querySelectorAll('.btn-action-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = products.find(x => x.id === parseInt(btn.getAttribute('data-id')));
        if (p) openQuickViewDrawer(p);
      });
    });

    tableBody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = products.find(x => x.id === parseInt(btn.getAttribute('data-id')));
        if (p) openEditProductModal(p);
      });
    });

    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = products.find(x => x.id === parseInt(btn.getAttribute('data-id')));
        if (p) openDeleteConfirmModal(p);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Render Card Grid View
  // --------------------------------------------------------------------------
  function renderGridView(list) {
    productCardsGrid.innerHTML = '';

    list.forEach(p => {
      const isSelected = selectedProduct && selectedProduct.id === p.id;
      const formattedPrice = `$${parseFloat(p.price).toFixed(2)}`;

      const card = document.createElement('div');
      card.className = `ecommerce-card ${isSelected ? 'card-selected' : ''}`;
      card.innerHTML = `
        <div class="card-top-row">
          <div class="card-avatar-box">${p.avatar || '📦'}</div>
          <span class="status-pill status-${p.stock}">
            <span class="status-dot-pulse"></span>
            ${p.stock === 'in-stock' ? 'In Stock' : p.stock === 'low-stock' ? 'Low Stock' : 'Out'}
          </span>
        </div>
        <span class="cat-pill cat-${p.category}" style="align-self: flex-start; margin-bottom: 0.5rem;">${p.category}</span>
        <h3 class="card-title">${p.name}</h3>
        <span class="card-brand-sub">by <strong>${p.brand}</strong> &bull; ${p.color}</span>
        <p class="card-desc">${p.desc}</p>
        <div class="card-specs-row">
          <span class="card-price">${formattedPrice}</span>
          <div class="rating-chip">
            <span class="star-symbol">★</span>
            <span class="rating-score">${p.rating}</span>
          </div>
        </div>
        <div class="card-footer-actions">
          <button class="btn-card-view btn-grid-view-specs" data-id="${p.id}">View Specifications</button>
          <button class="btn-inline-action btn-action-edit" data-id="${p.id}" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        selectProduct(p);
      });

      card.querySelector('.btn-grid-view-specs').addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickViewDrawer(p);
      });

      card.querySelector('.btn-action-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditProductModal(p);
      });

      productCardsGrid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 10. Selection & Dynamic Banner Interactions
  // --------------------------------------------------------------------------
  function selectProduct(p) {
    if (selectedProduct && selectedProduct.id === p.id) {
      resetSelectionBanner();
      return;
    }

    selectedProduct = p;
    selectionBanner.classList.add('active-state');
    bannerText.innerHTML = `
      <strong>Selected:</strong> <span class="banner-highlight-name">${p.name}</span> by <strong>${p.brand}</strong> 
      &bull; <strong>$${parseFloat(p.price).toFixed(2)}</strong> 
      &bull; <span style="text-decoration: underline;">${p.stock}</span> 
      &bull; ⭐ ${p.rating}/5
    `;

    btnBannerView.classList.remove('hidden');
    btnBannerEdit.classList.remove('hidden');
    btnClearSelection.classList.remove('hidden');

    renderCatalog();
    showToast(`Selected: ${p.name}`, '📌');
  }

  function resetSelectionBanner() {
    selectedProduct = null;
    selectionBanner.classList.remove('active-state');
    bannerText.innerHTML = `
      <strong>Interactive Catalog:</strong> Click any product row to highlight details, edit specifications, or trigger quick actions.
    `;
    btnBannerView.classList.add('hidden');
    btnBannerEdit.classList.add('hidden');
    btnClearSelection.classList.add('hidden');
    renderCatalog();
  }

  btnClearSelection.addEventListener('click', resetSelectionBanner);

  btnBannerView.addEventListener('click', () => {
    if (selectedProduct) openQuickViewDrawer(selectedProduct);
  });

  btnBannerEdit.addEventListener('click', () => {
    if (selectedProduct) openEditProductModal(selectedProduct);
  });

  // --------------------------------------------------------------------------
  // 11. Bulk Selection Actions
  // --------------------------------------------------------------------------
  function updateBulkActionBar() {
    const visibleProducts = getFilteredAndSortedProducts();
    const count = bulkSelectedIds.size;

    if (count > 0) {
      bulkActionBar.classList.remove('hidden');
      bulkSelectedCount.textContent = `${count} Selected`;
      selectAllCheckbox.checked = visibleProducts.every(p => bulkSelectedIds.has(p.id));
    } else {
      bulkActionBar.classList.add('hidden');
      selectAllCheckbox.checked = false;
    }
  }

  selectAllCheckbox.addEventListener('change', (e) => {
    const visibleProducts = getFilteredAndSortedProducts();
    if (e.target.checked) {
      visibleProducts.forEach(p => bulkSelectedIds.add(p.id));
    } else {
      bulkSelectedIds.clear();
    }
    renderCatalog();
  });

  btnBulkCancel.addEventListener('click', () => {
    bulkSelectedIds.clear();
    renderCatalog();
  });

  btnBulkInStock.addEventListener('click', () => {
    products.forEach(p => {
      if (bulkSelectedIds.has(p.id)) p.stock = 'in-stock';
    });
    saveProducts();
    showToast(`Updated ${bulkSelectedIds.size} products to In-Stock`, '✅');
  });

  btnBulkDelete.addEventListener('click', () => {
    const count = bulkSelectedIds.size;
    products = products.filter(p => !bulkSelectedIds.has(p.id));
    bulkSelectedIds.clear();
    saveProducts();
    resetSelectionBanner();
    showToast(`Deleted ${count} selected products`, '🗑️');
  });

  btnBulkExport.addEventListener('click', () => {
    const selectedList = products.filter(p => bulkSelectedIds.has(p.id));
    exportToCsv(selectedList, 'selected_products_export.csv');
  });

  // --------------------------------------------------------------------------
  // 12. Modal Forms (Add & Edit Product)
  // --------------------------------------------------------------------------
  function openAddProductModal() {
    productForm.reset();
    formProductId.value = '';
    formColorHex.value = '#6366f1';
    formModalTitle.textContent = 'Add New Product';
    formSubmitText.textContent = 'Save Product to Catalog';
    clearFormErrors();
    formModal.classList.add('open');
    formModal.setAttribute('aria-hidden', 'false');
    formName.focus();
  }

  function openEditProductModal(p) {
    clearFormErrors();
    formProductId.value = p.id;
    formName.value = p.name;
    formBrand.value = p.brand;
    formCategory.value = p.category;
    formPrice.value = p.price;
    formStock.value = p.stock;
    formRating.value = p.rating;
    formColorName.value = p.color;
    formColorHex.value = p.colorHex || '#6366f1';
    formDesc.value = p.desc;

    formModalTitle.textContent = `Edit Product #${p.id}`;
    formSubmitText.textContent = 'Update Product Specifications';
    formModal.classList.add('open');
    formModal.setAttribute('aria-hidden', 'false');
    formName.focus();
  }

  function closeFormModal() {
    formModal.classList.remove('open');
    formModal.setAttribute('aria-hidden', 'true');
  }

  btnOpenAddModal.addEventListener('click', openAddProductModal);
  btnEmptyAddProduct.addEventListener('click', openAddProductModal);
  btnCloseFormModal.addEventListener('click', closeFormModal);
  btnCancelForm.addEventListener('click', closeFormModal);

  formModal.addEventListener('click', (e) => {
    if (e.target === formModal) closeFormModal();
  });

  // Form Submission
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    const editId = formProductId.value ? parseInt(formProductId.value) : null;
    const name = formName.value.trim();
    const brand = formBrand.value.trim();
    const category = formCategory.value.trim();
    const price = parseFloat(formPrice.value);
    const stock = formStock.value;
    const rating = parseFloat(formRating.value);
    const color = formColorName.value.trim();
    const colorHex = formColorHex.value;
    const desc = formDesc.value.trim();

    // Determine avatar icon by category
    const catIcons = {
      'Audio': '🎧',
      'Wearables': '⌚',
      'Peripherals': '⌨️',
      'Displays': '🖥️',
      'Accessories': '🔋'
    };
    const avatar = catIcons[category] || '📦';

    if (editId) {
      // Update
      const index = products.findIndex(p => p.id === editId);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          name, brand, category, price, stock, rating, color, colorHex, desc, avatar
        };
        showToast(`Updated "${name}" successfully`, '✏️');
      }
    } else {
      // Create new
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const sku = `${brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newProduct = {
        id: newId,
        name, brand, category, price, stock, rating, color, colorHex, desc, avatar, sku
      };
      products.unshift(newProduct);
      showToast(`Added "${name}" to catalog`, '✨');
    }

    saveProducts();
    closeFormModal();
  });

  function clearFormErrors() {
    ['err-name', 'err-brand', 'err-category', 'err-price', 'err-rating', 'err-color', 'err-desc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function validateProductForm() {
    clearFormErrors();
    let valid = true;

    if (!formName.value.trim()) {
      document.getElementById('err-name').textContent = 'Product name is required';
      valid = false;
    }
    if (!formBrand.value.trim()) {
      document.getElementById('err-brand').textContent = 'Brand name is required';
      valid = false;
    }
    if (!formCategory.value.trim()) {
      document.getElementById('err-category').textContent = 'Category is required';
      valid = false;
    }
    const priceVal = parseFloat(formPrice.value);
    if (isNaN(priceVal) || priceVal <= 0) {
      document.getElementById('err-price').textContent = 'Please enter a valid price (> 0)';
      valid = false;
    }
    const ratingVal = parseFloat(formRating.value);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      document.getElementById('err-rating').textContent = 'Rating must be between 1.0 and 5.0';
      valid = false;
    }
    if (!formColorName.value.trim()) {
      document.getElementById('err-color').textContent = 'Color label is required';
      valid = false;
    }
    if (!formDesc.value.trim()) {
      document.getElementById('err-desc').textContent = 'Product description is required';
      valid = false;
    }

    return valid;
  }

  // --------------------------------------------------------------------------
  // 13. Quick-View Slide-Over Drawer
  // --------------------------------------------------------------------------
  let activeDrawerProduct = null;

  function openQuickViewDrawer(p) {
    activeDrawerProduct = p;
    drawerProductTitle.textContent = p.name;
    drawerCategoryBadge.textContent = p.category;
    drawerCategoryBadge.className = `cat-pill cat-${p.category}`;
    drawerSku.textContent = `SKU: ${p.sku || 'N/A'}`;
    drawerBrand.textContent = p.brand;
    drawerPrice.textContent = `$${parseFloat(p.price).toFixed(2)}`;
    
    drawerStockBadge.innerHTML = `
      <span class="status-pill status-${p.stock}">
        <span class="status-dot-pulse"></span>
        ${p.stock === 'in-stock' ? 'In Stock' : p.stock === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
      </span>
    `;

    drawerRatingBadge.innerHTML = `⭐ ${p.rating} / 5.0`;
    drawerColorSwatch.style.backgroundColor = p.colorHex || '#6366f1';
    drawerColorLabel.textContent = `${p.color} (${p.colorHex || '#6366f1'})`;
    drawerDesc.textContent = p.desc;

    // Interactive Star Rating setup
    updateDrawerStarRating(Math.round(p.rating));

    quickViewDrawer.classList.add('open');
    quickViewDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeQuickViewDrawer() {
    quickViewDrawer.classList.remove('open');
    quickViewDrawer.setAttribute('aria-hidden', 'true');
    activeDrawerProduct = null;
  }

  btnCloseDrawer.addEventListener('click', closeQuickViewDrawer);
  quickViewDrawer.addEventListener('click', (e) => {
    if (e.target === quickViewDrawer) closeQuickViewDrawer();
  });

  btnDrawerEdit.addEventListener('click', () => {
    if (activeDrawerProduct) {
      const p = activeDrawerProduct;
      closeQuickViewDrawer();
      openEditProductModal(p);
    }
  });

  btnDrawerDelete.addEventListener('click', () => {
    if (activeDrawerProduct) {
      const p = activeDrawerProduct;
      closeQuickViewDrawer();
      openDeleteConfirmModal(p);
    }
  });

  btnDrawerHighlight.addEventListener('click', () => {
    if (activeDrawerProduct) {
      selectProduct(activeDrawerProduct);
      closeQuickViewDrawer();
      const row = document.querySelector(`tr[data-id="${activeDrawerProduct.id}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Drawer Rating buttons
  function updateDrawerStarRating(score) {
    drawerStarRatingGroup.querySelectorAll('.star-btn').forEach(btn => {
      const star = parseInt(btn.getAttribute('data-star'));
      if (star <= score) btn.classList.add('star-active');
      else btn.classList.remove('star-active');
    });
  }

  drawerStarRatingGroup.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!activeDrawerProduct) return;
      const star = parseFloat(btn.getAttribute('data-star'));
      activeDrawerProduct.rating = star;
      drawerRatingBadge.innerHTML = `⭐ ${star.toFixed(1)} / 5.0`;
      updateDrawerStarRating(star);
      saveProducts();
      showToast(`Rating updated to ${star} stars!`, '⭐');
    });
  });

  // --------------------------------------------------------------------------
  // 14. Delete Confirmation Dialog
  // --------------------------------------------------------------------------
  function openDeleteConfirmModal(p) {
    pendingDeleteId = p.id;
    deleteConfirmText.innerHTML = `Are you sure you want to permanently delete <strong>"${p.name}"</strong>?`;
    deleteConfirmModal.classList.add('open');
    deleteConfirmModal.setAttribute('aria-hidden', 'false');
  }

  function closeDeleteConfirmModal() {
    deleteConfirmModal.classList.remove('open');
    deleteConfirmModal.setAttribute('aria-hidden', 'true');
    pendingDeleteId = null;
  }

  btnCancelDelete.addEventListener('click', closeDeleteConfirmModal);
  deleteConfirmModal.addEventListener('click', (e) => {
    if (e.target === deleteConfirmModal) closeDeleteConfirmModal();
  });

  btnConfirmDelete.addEventListener('click', () => {
    if (pendingDeleteId) {
      const deletedIndex = products.findIndex(p => p.id === pendingDeleteId);
      if (deletedIndex !== -1) {
        lastDeletedProduct = products[deletedIndex];
        products.splice(deletedIndex, 1);
        bulkSelectedIds.delete(pendingDeleteId);
        if (selectedProduct && selectedProduct.id === pendingDeleteId) {
          resetSelectionBanner();
        } else {
          saveProducts();
        }
        showToast(`Deleted "${lastDeletedProduct.name}"`, '🗑️');
      }
      closeDeleteConfirmModal();
    }
  });

  // --------------------------------------------------------------------------
  // 15. View Switcher (Table vs Grid)
  // --------------------------------------------------------------------------
  btnViewTable.addEventListener('click', () => {
    currentViewMode = 'table';
    btnViewTable.classList.add('active');
    btnViewGrid.classList.remove('active');
    btnViewTable.setAttribute('aria-pressed', 'true');
    btnViewGrid.setAttribute('aria-pressed', 'false');
    renderCatalog();
  });

  btnViewGrid.addEventListener('click', () => {
    currentViewMode = 'grid';
    btnViewGrid.classList.add('active');
    btnViewTable.classList.remove('active');
    btnViewGrid.setAttribute('aria-pressed', 'true');
    btnViewTable.setAttribute('aria-pressed', 'false');
    renderCatalog();
  });

  // --------------------------------------------------------------------------
  // 16. Search, Filter & Sort Event Handlers
  // --------------------------------------------------------------------------
  globalSearchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    if (currentSearchQuery.length > 0) {
      btnSearchClear.classList.remove('hidden');
    } else {
      btnSearchClear.classList.add('hidden');
    }
    renderCatalog();
  });

  btnSearchClear.addEventListener('click', () => {
    globalSearchInput.value = '';
    currentSearchQuery = '';
    btnSearchClear.classList.add('hidden');
    renderCatalog();
  });

  stockSelectFilter.addEventListener('change', (e) => {
    currentStock = e.target.value;
    renderCatalog();
  });

  priceSortFilter.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  btnClearAllFilters.addEventListener('click', () => {
    currentCategory = 'all';
    currentStock = 'all';
    currentSearchQuery = '';
    currentSort = 'default';

    globalSearchInput.value = '';
    btnSearchClear.classList.add('hidden');
    stockSelectFilter.value = 'all';
    priceSortFilter.value = 'default';

    renderCategoryPills();
    renderCatalog();
    showToast('Filters cleared', '🧹');
  });

  // Table Sortable Headers
  document.querySelectorAll('th.sortable-header').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      const isAsc = currentSort === `${field}-asc`;
      currentSort = isAsc ? `${field}-desc` : `${field}-asc`;

      // Update indicators
      document.querySelectorAll('th.sortable-header').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
        const ind = h.querySelector('.sort-indicator');
        if (ind) ind.textContent = '⇅';
      });

      th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
      const ind = th.querySelector('.sort-indicator');
      if (ind) ind.textContent = isAsc ? '▼' : '▲';

      renderCatalog();
      showToast(`Sorted by ${field.toUpperCase()} (${isAsc ? 'DESC' : 'ASC'})`, '📊');
    });
  });

  // --------------------------------------------------------------------------
  // 17. Export CSV & Print Features
  // --------------------------------------------------------------------------
  function exportToCsv(dataList, filename = 'nexustech_product_catalog.csv') {
    const headers = ['ID', 'SKU', 'Product Name', 'Brand', 'Category', 'Price', 'Stock Status', 'Rating', 'Color', 'Description'];
    const rows = [headers];

    dataList.forEach(p => {
      rows.push([
        p.id,
        `"${p.sku || ''}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.brand}"`,
        `"${p.category}"`,
        `$${parseFloat(p.price).toFixed(2)}`,
        `"${p.stock}"`,
        p.rating,
        `"${p.color}"`,
        `"${p.desc.replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${dataList.length} products to CSV`, '📁');
  }

  btnExportCsv.addEventListener('click', () => {
    const list = getFilteredAndSortedProducts();
    exportToCsv(list);
  });

  btnPrintCatalog.addEventListener('click', () => {
    window.print();
  });

  // --------------------------------------------------------------------------
  // 18. Toast Notifications Stack
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = '💡') {
    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // 19. Keyboard Shortcuts & Jump Triggers
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Focus search with '/'
    if (e.key === '/' && document.activeElement !== globalSearchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      globalSearchInput.focus();
      globalSearchInput.select();
    }

    // Escape closes modals
    if (e.key === 'Escape') {
      closeFormModal();
      closeQuickViewDrawer();
      closeDeleteConfirmModal();
    }
  });

  navSearchBtn.addEventListener('click', () => {
    globalSearchInput.focus();
    globalSearchInput.select();
  });

  // --------------------------------------------------------------------------
  // 20. App Initialization
  // --------------------------------------------------------------------------
  updateStatsOverview();
  renderCategoryPills();
  renderCatalog();
});
