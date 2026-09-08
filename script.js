/**
 * Product Information Table Interactions
 * Tech: Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const tableBody = document.getElementById('table-body');
  const tableRows = tableBody.querySelectorAll('tr');
  const selectionBanner = document.getElementById('selection-banner');
  const bannerMessage = document.getElementById('banner-message');
  const clearBtn = document.getElementById('clear-selection-btn');
  const searchInput = document.getElementById('table-search');
  const productCount = document.getElementById('product-count');

  let selectedRow = null;

  // --------------------------------------------------------------------------
  // 1. Table Row Click & Highlight Interaction
  // --------------------------------------------------------------------------
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      // If clicking already selected row, deselect it
      if (row === selectedRow) {
        clearSelection();
        return;
      }

      // Remove selected class from previous row
      if (selectedRow) {
        selectedRow.classList.remove('selected');
      }

      // Highlight current row
      row.classList.add('selected');
      selectedRow = row;

      // Extract details from current row
      const name = row.querySelector('.td-name strong')?.textContent.trim() || 'Product';
      const brand = row.querySelector('.td-brand')?.textContent.trim() || '';
      const price = row.querySelector('.td-price')?.textContent.trim() || '';
      const statusBadge = row.querySelector('.status-badge')?.textContent.trim() || '';
      const rating = row.querySelector('.td-rating')?.textContent.replace('/ 5', '').trim() || '';

      // Update banner with dynamic feedback message
      bannerMessage.innerHTML = `
        <strong>Selected:</strong> <span class="banner-highlight">${name}</span> by <strong>${brand}</strong> 
        &bull; <strong>${price}</strong> 
        &bull; <span style="text-decoration: underline;">${statusBadge}</span> 
        &bull; ⭐ ${rating}
      `;

      selectionBanner.classList.add('has-selection');
      clearBtn.classList.remove('hidden');
    });
  });

  // --------------------------------------------------------------------------
  // 2. Clear / Reset Selection
  // --------------------------------------------------------------------------
  function clearSelection() {
    if (selectedRow) {
      selectedRow.classList.remove('selected');
      selectedRow = null;
    }

    bannerMessage.innerHTML = `
      <strong>Interactive Tip:</strong> Click on any product in the table below to select and view its quick summary.
    `;
    selectionBanner.classList.remove('has-selection');
    clearBtn.classList.add('hidden');
  }

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearSelection();
  });

  // --------------------------------------------------------------------------
  // 3. Quick Table Search / Filter
  // --------------------------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      tableRows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(query)) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      // Update product count label
      productCount.textContent = `Showing ${visibleCount} Product${visibleCount === 1 ? '' : 's'}`;
    });
  }
});
