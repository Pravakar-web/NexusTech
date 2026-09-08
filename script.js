/**
 * TechMart Pro - Product Information JavaScript
 * Pure Vanilla JavaScript with Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM Element References
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const tableBody = document.getElementById('table-body');
  const tableRows = Array.from(tableBody.querySelectorAll('tr'));
  const selectionBanner = document.getElementById('selection-banner');
  const bannerMessage = document.getElementById('banner-message');
  const clearSelectionBtn = document.getElementById('clear-selection-btn');
  const searchInput = document.getElementById('table-search');
  const stockFilter = document.getElementById('stock-filter');
  const categoryPills = document.querySelectorAll('#category-filters .pill-btn');
  const productCount = document.getElementById('product-count');
  const noResultsState = document.getElementById('no-results');
  const resetFiltersBtn = document.getElementById('btn-reset-filters');
  const tableHeaders = document.querySelectorAll('th.sortable');
  const exportBtn = document.getElementById('btn-export-csv');
  const toast = document.getElementById('toast');

  // Modal Elements
  const modalBackdrop = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalSelectAction = document.getElementById('modal-select-action');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalSku = document.getElementById('modal-sku');
  const modalBrand = document.getElementById('modal-brand');
  const modalPrice = document.getElementById('modal-price');
  const modalStatus = document.getElementById('modal-status');
  const modalRating = document.getElementById('modal-rating');
  const modalColor = document.getElementById('modal-color');
  const modalDesc = document.getElementById('modal-desc');

  // State Variables
  let selectedRow = null;
  let activeCategory = 'all';
  let activeStock = 'all';
  let activeSearchQuery = '';
  let activeModalRow = null;
  let currentSort = { column: null, direction: 'asc' };

  // --------------------------------------------------------------------------
  // 1. Dark / Light Theme Toggle & Persistence
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem('techmart-theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('techmart-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  // --------------------------------------------------------------------------
  // 2. Table Row Click & Highlight Interaction
  // --------------------------------------------------------------------------
  tableRows.forEach(row => {
    // Click on row to highlight & update banner
    row.addEventListener('click', (e) => {
      // Avoid conflict if clicking the View action button directly
      if (e.target.closest('.btn-row-action')) {
        openModalForRow(row);
        return;
      }

      if (row === selectedRow) {
        clearSelection();
        return;
      }

      selectRow(row);
    });

    // View button inside row
    const viewBtn = row.querySelector('.btn-row-action');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModalForRow(row);
      });
    }
  });

  function selectRow(row) {
    if (selectedRow) {
      selectedRow.classList.remove('selected');
    }

    row.classList.add('selected');
    selectedRow = row;

    const name = row.querySelector('.product-details-text strong')?.textContent.trim() || 'Product';
    const brand = row.querySelector('.td-brand')?.textContent.trim() || '';
    const price = row.querySelector('.price-val')?.textContent.trim() || '';
    const statusText = row.querySelector('.status-badge')?.textContent.trim() || '';
    const ratingNum = row.querySelector('.rating-num')?.textContent.trim() || '';

    bannerMessage.innerHTML = `
      <span class="banner-tag">Selected</span> 
      <span class="banner-highlight">${name}</span> by <strong>${brand}</strong> 
      &bull; <strong>${price}</strong> 
      &bull; <span style="font-weight:600;">${statusText}</span> 
      &bull; ⭐ ${ratingNum}/5
    `;

    selectionBanner.classList.add('has-selection');
    clearSelectionBtn.classList.remove('hidden');
    showToast(`Selected: ${name}`);
  }

  function clearSelection() {
    if (selectedRow) {
      selectedRow.classList.remove('selected');
      selectedRow = null;
    }

    bannerMessage.innerHTML = `
      <span class="banner-tag">Pro Tip</span> Click on any table row or press the details button to view comprehensive specs and live actions.
    `;
    selectionBanner.classList.remove('has-selection');
    clearSelectionBtn.classList.add('hidden');
  }

  clearSelectionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearSelection();
  });

  // --------------------------------------------------------------------------
  // 3. Multi-Criteria Filtering (Search + Category + Stock)
  // --------------------------------------------------------------------------
  function applyFilters() {
    let visibleCount = 0;

    tableRows.forEach(row => {
      const rowCategory = row.getAttribute('data-category') || '';
      const rowStock = row.getAttribute('data-stock') || '';
      const rowText = row.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || rowCategory.toLowerCase() === activeCategory.toLowerCase());
      const matchesStock = (activeStock === 'all' || rowStock === activeStock);
      const matchesSearch = (activeSearchQuery === '' || rowText.includes(activeSearchQuery));

      if (matchesCategory && matchesStock && matchesSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Update count labels
    productCount.textContent = `Showing ${visibleCount} of ${tableRows.length} products`;

    // Toggle Empty State
    if (visibleCount === 0) {
      noResultsState.classList.remove('hidden');
    } else {
      noResultsState.classList.add('hidden');
    }
  }

  // Category Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  // Stock Filter Dropdown
  stockFilter.addEventListener('change', (e) => {
    activeStock = e.target.value;
    applyFilters();
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    activeSearchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  // Keyboard shortcut '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Reset Filters Button
  resetFiltersBtn.addEventListener('click', () => {
    activeCategory = 'all';
    activeStock = 'all';
    activeSearchQuery = '';

    searchInput.value = '';
    stockFilter.value = 'all';
    categoryPills.forEach(p => {
      if (p.getAttribute('data-category') === 'all') p.classList.add('active');
      else p.classList.remove('active');
    });

    applyFilters();
    showToast('Filters reset to default');
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Column Sorting
  // --------------------------------------------------------------------------
  tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const sortKey = th.getAttribute('data-sort');
      if (!sortKey) return;

      const isAsc = currentSort.column === sortKey && currentSort.direction === 'asc';
      const direction = isAsc ? 'desc' : 'asc';
      currentSort = { column: sortKey, direction };

      // Update header UI indicator classes
      tableHeaders.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        const arrow = header.querySelector('.sort-arrow');
        if (arrow) arrow.textContent = '⇅';
      });

      th.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
      const activeArrow = th.querySelector('.sort-arrow');
      if (activeArrow) activeArrow.textContent = direction === 'asc' ? '▲' : '▼';

      // Perform Sort
      tableRows.sort((a, b) => {
        let valA, valB;

        switch (sortKey) {
          case 'name':
            valA = a.querySelector('.product-details-text strong')?.textContent.trim() || '';
            valB = b.querySelector('.product-details-text strong')?.textContent.trim() || '';
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case 'brand':
            valA = a.querySelector('.td-brand')?.textContent.trim() || '';
            valB = b.querySelector('.td-brand')?.textContent.trim() || '';
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case 'category':
            valA = a.getAttribute('data-category') || '';
            valB = b.getAttribute('data-category') || '';
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case 'price':
            valA = parseFloat(a.getAttribute('data-price')) || 0;
            valB = parseFloat(b.getAttribute('data-price')) || 0;
            return direction === 'asc' ? valA - valB : valB - valA;

          case 'status':
            valA = a.getAttribute('data-stock') || '';
            valB = b.getAttribute('data-stock') || '';
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case 'rating':
            valA = parseFloat(a.getAttribute('data-rating')) || 0;
            valB = parseFloat(b.getAttribute('data-rating')) || 0;
            return direction === 'asc' ? valA - valB : valB - valA;

          default:
            return 0;
        }
      });

      // Re-append sorted rows to table body
      tableRows.forEach(row => tableBody.appendChild(row));
      showToast(`Sorted by ${sortKey.toUpperCase()} (${direction})`);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Product Quick-View Modal / Slide-Over
  // --------------------------------------------------------------------------
  function openModalForRow(row) {
    activeModalRow = row;

    const name = row.querySelector('.product-details-text strong')?.textContent.trim() || '';
    const sku = row.querySelector('.product-sku')?.textContent.trim() || '';
    const brand = row.querySelector('.td-brand')?.textContent.trim() || '';
    const categoryBadge = row.querySelector('.td-category .badge-cat')?.outerHTML || '';
    const price = row.querySelector('.price-val')?.textContent.trim() || '';
    const statusBadge = row.querySelector('.td-status .status-badge')?.outerHTML || '';
    const ratingHtml = row.querySelector('.td-rating .rating-box')?.innerHTML || '';
    const colorBadge = row.querySelector('.td-color .color-badge')?.innerHTML || '';
    const desc = row.querySelector('.td-desc')?.textContent.trim() || '';

    modalTitle.textContent = name;
    modalSku.textContent = sku;
    modalCategory.outerHTML = categoryBadge;
    modalBrand.textContent = brand;
    modalPrice.textContent = price;
    modalStatus.innerHTML = statusBadge;
    modalRating.innerHTML = ratingHtml;
    modalColor.innerHTML = colorBadge;
    modalDesc.textContent = desc;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    activeModalRow = null;
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseAction.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  modalSelectAction.addEventListener('click', () => {
    if (activeModalRow) {
      selectRow(activeModalRow);
      activeModalRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 6. CSV Data Export
  // --------------------------------------------------------------------------
  if (exportBtn) {
    exportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const csvRows = [
        ['ID', 'Product Name', 'Brand', 'Category', 'Price', 'Availability', 'Rating', 'Color', 'Description']
      ];

      tableRows.forEach(row => {
        const id = row.querySelector('.td-id')?.textContent.trim();
        const name = row.querySelector('.product-details-text strong')?.textContent.trim();
        const brand = row.querySelector('.td-brand')?.textContent.trim();
        const category = row.getAttribute('data-category');
        const price = row.getAttribute('data-price');
        const status = row.getAttribute('data-stock');
        const rating = row.getAttribute('data-rating');
        const color = row.querySelector('.td-color')?.textContent.trim();
        const desc = `"${row.querySelector('.td-desc')?.textContent.trim().replace(/"/g, '""')}"`;

        csvRows.push([id, name, brand, category, `$${price}`, status, rating, color, desc]);
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'techmart_product_catalog_2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Catalog exported to CSV successfully!');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
