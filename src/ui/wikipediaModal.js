// ============================================================================
// WIKIPEDIA & MEDICAL WEB RESEARCH MODAL
// In-app Wikipedia REST API reader with direct links to PubMed, MedlinePlus & Radiopaedia
// ============================================================================

export function createWikipediaModal() {
  // Check if modal element already exists or create it
  let modal = document.querySelector('#wikiModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wikiModal';
    modal.className = 'medical-modal-backdrop';
    modal.innerHTML = `
      <div class="medical-modal-container" role="dialog" aria-modal="true" aria-labelledby="wikiModalTitle">
        <div class="medical-modal-header">
          <div class="modal-badge">
            <span class="wiki-icon">W</span>
            WIKIPEDIA MEDICAL ENCYCLOPEDIA
          </div>
          <button class="modal-close-btn" id="wikiModalClose" aria-label="Close modal">&times;</button>
        </div>

        <div class="medical-modal-body">
          <div id="wikiLoading" class="wiki-loading">
            <div class="medical-spinner"></div>
            <p>Fetching peer-reviewed anatomical literature from Wikipedia...</p>
          </div>

          <div id="wikiContent" class="wiki-content" style="display: none;">
            <div class="wiki-header-banner">
              <div class="wiki-title-group">
                <h2 id="wikiModalTitle">Anatomical Part</h2>
                <div class="wiki-latin" id="wikiModalLatin">Terminologia Anatomica</div>
              </div>
              <div id="wikiThumbnailContainer" class="wiki-thumb-wrap"></div>
            </div>

            <div class="wiki-description" id="wikiModalDescription"></div>

            <div class="wiki-extract-card">
              <div class="extract-label">ARTICLE EXTRACT & OVERVIEW</div>
              <p id="wikiModalExtract"></p>
            </div>

            <div class="wiki-reference-actions">
              <a id="wikiFullLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-ref wiki-btn">
                <span>📖</span> Read Full Wikipedia Article
              </a>
              <a id="pubmedLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-ref pubmed-btn">
                <span>🔬</span> PubMed Clinical Research
              </a>
              <a id="medlineLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-ref medline-btn">
                <span>🏥</span> MedlinePlus (NIH)
              </a>
              <a id="radiopaediaLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-ref radio-btn">
                <span>🩻</span> Radiopaedia Cases
              </a>
            </div>
          </div>

          <div id="wikiError" class="wiki-error" style="display: none;">
            <p>Unable to retrieve live Wikipedia summary directly. You can still access the complete article via the link below.</p>
            <a id="wikiFallbackLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-ref wiki-btn">
              Open Wikipedia Article
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = modal.querySelector('#wikiModalClose');
  const loading = modal.querySelector('#wikiLoading');
  const content = modal.querySelector('#wikiContent');
  const error = modal.querySelector('#wikiError');

  const titleEl = modal.querySelector('#wikiModalTitle');
  const latinEl = modal.querySelector('#wikiModalLatin');
  const descEl = modal.querySelector('#wikiModalDescription');
  const extractEl = modal.querySelector('#wikiModalExtract');
  const thumbWrap = modal.querySelector('#wikiThumbnailContainer');
  const fullLink = modal.querySelector('#wikiFullLink');
  const pubmedLink = modal.querySelector('#pubmedLink');
  const medlineLink = modal.querySelector('#medlineLink');
  const radiopaediaLink = modal.querySelector('#radiopaediaLink');
  const fallbackLink = modal.querySelector('#wikiFallbackLink');

  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  async function openForPart(part) {
    if (!part) return;

    modal.classList.add('active');
    loading.style.display = 'flex';
    content.style.display = 'none';
    error.style.display = 'none';

    titleEl.textContent = part.name;
    latinEl.textContent = part.latinName || '';
    descEl.textContent = part.shortDescription || '';

    // Set research links
    const wikiUrl = part.wikipediaUrl || `https://en.wikipedia.org/wiki/${part.wikipediaTitle || encodeURIComponent(part.name)}`;
    fullLink.href = wikiUrl;
    fallbackLink.href = wikiUrl;

    const query = part.pubmedQuery || encodeURIComponent(part.name);
    pubmedLink.href = `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`;
    medlineLink.href = part.medlineUrl || `https://medlineplus.gov/search?query=${encodeURIComponent(part.name)}`;
    radiopaediaLink.href = part.radiopaediaUrl || `https://radiopaedia.org/search?q=${encodeURIComponent(part.name)}`;

    // Try fetching summary from Wikipedia REST API
    const wikiTitle = part.wikipediaTitle || part.name.replace(/ /g, '_');
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;

    try {
      const response = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();

        titleEl.textContent = data.title || part.name;
        descEl.textContent = data.description || part.shortDescription || '';
        extractEl.textContent = data.extract || part.detailedAnatomy || 'No extract available.';

        thumbWrap.innerHTML = '';
        if (data.thumbnail && data.thumbnail.source) {
          const img = document.createElement('img');
          img.src = data.thumbnail.source;
          img.alt = data.title;
          img.className = 'wiki-thumb-img';
          thumbWrap.appendChild(img);
        }

        loading.style.display = 'none';
        content.style.display = 'block';
      } else {
        // Fallback to local detailed anatomy
        useLocalData(part);
      }
    } catch (err) {
      console.warn('Wikipedia API fetch notice:', err);
      useLocalData(part);
    }
  }

  function useLocalData(part) {
    loading.style.display = 'none';
    content.style.display = 'block';
    extractEl.textContent = part.detailedAnatomy || part.shortDescription || 'Medical anatomical record loaded.';
    thumbWrap.innerHTML = '';
  }

  return {
    openForPart,
    closeModal
  };
}
