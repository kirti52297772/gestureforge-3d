// ============================================================================
// SIDE-BY-SIDE ANATOMICAL HIERARCHY & PARTS BROWSER
// Searchable, categorized anatomical structures for medical students & doctors
// ============================================================================

export function createAnatomyPanel({
  containerId = '#anatomyList',
  categoryContainerId = '#categoryTabs',
  searchInputId = '#anatomySearch',
  onSelectPart,
  onOpenWiki
}) {
  const container = document.querySelector(containerId);
  const catContainer = document.querySelector(categoryContainerId);
  const searchInput = document.querySelector(searchInputId);

  let currentParts = [];
  let currentCategory = 'All';
  let searchQuery = '';
  let selectedPartId = null;

  function setParts(parts) {
    currentParts = parts || [];
    renderCategories();
    renderList();
  }

  function setSelectedPart(partId) {
    selectedPartId = partId;
    updateSelectionHighlight();
  }

  function renderCategories() {
    if (!catContainer) return;

    // Collect unique categories
    const categories = ['All'];
    currentParts.forEach(p => {
      if (p.category && !categories.includes(p.category)) {
        categories.push(p.category);
      }
    });

    catContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-pill ${cat === currentCategory ? 'active' : ''}`;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        currentCategory = cat;
        catContainer.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderList();
      });
      catContainer.appendChild(btn);
    });
  }

  function renderList() {
    if (!container) return;

    const filtered = currentParts.filter(part => {
      const matchesCat = (currentCategory === 'All') || (part.category === currentCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query ||
        part.name.toLowerCase().includes(query) ||
        (part.latinName && part.latinName.toLowerCase().includes(query)) ||
        (part.shortDescription && part.shortDescription.toLowerCase().includes(query));

      return matchesCat && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="anatomy-empty">
          <p>No anatomical structures match your search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    filtered.forEach(part => {
      const card = document.createElement('div');
      card.className = `anatomy-card ${part.id === selectedPartId ? 'selected' : ''}`;
      card.setAttribute('data-id', part.id);

      card.innerHTML = `
        <div class="anatomy-card-top">
          <div class="part-info">
            <h4 class="part-name">${escapeHtml(part.name)}</h4>
            <div class="part-latin">${escapeHtml(part.latinName || '')}</div>
          </div>
          ${part.badge ? `<span class="badge ${getBadgeClass(part.badge)}">${escapeHtml(part.badge)}</span>` : ''}
        </div>

        <p class="part-desc">${escapeHtml(part.shortDescription || '')}</p>

        ${part.pressure ? `
          <div class="part-metric">
            <span class="metric-icon">⚡</span>
            <span class="metric-text">${escapeHtml(part.pressure)}</span>
          </div>
        ` : ''}

        <div class="anatomy-card-actions">
          <button class="btn-card-action inspect-btn" title="Inspect structure in 3D">
            <span>🔍</span> 3D Inspect
          </button>
          <button class="btn-card-action wiki-btn" title="Open Wikipedia reference">
            <span>📖</span> Wikipedia
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        // If clicking wiki button specifically
        if (e.target.closest('.wiki-btn')) {
          e.stopPropagation();
          onOpenWiki?.(part);
          return;
        }
        selectedPartId = part.id;
        updateSelectionHighlight();
        onSelectPart?.(part);
      });

      container.appendChild(card);
    });
  }

  function updateSelectionHighlight() {
    if (!container) return;
    const cards = container.querySelectorAll('.anatomy-card');
    cards.forEach(c => {
      if (c.getAttribute('data-id') === selectedPartId) {
        c.classList.add('selected');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('selected');
      }
    });
  }

  function getBadgeClass(badge) {
    const b = badge.toLowerCase();
    if (b.includes('oxygen') || b.includes('arterial')) return 'badge-arterial';
    if (b.includes('deoxygen') || b.includes('venous')) return 'badge-venous';
    if (b.includes('valve')) return 'badge-valve';
    if (b.includes('high pressure') || b.includes('critical')) return 'badge-critical';
    return 'badge-standard';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderList();
    });
  }

  return {
    setParts,
    setSelectedPart,
    refresh: renderList
  };
}
