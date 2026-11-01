// ============================================================================
// CLINICAL CASE STUDY & STUDENT CHALLENGE PANEL
// Displays clinical case studies, patient findings, pathophysiology & interactive quizzes
// ============================================================================

export function createCaseStudyPanel({ containerId = '#caseStudyContent' } = {}) {
  const container = document.querySelector(containerId);

  function render(part) {
    if (!container) return;

    if (!part || !part.caseStudy) {
      container.innerHTML = `
        <div class="case-study-placeholder">
          <div class="placeholder-icon">📋</div>
          <div class="placeholder-title">Clinical Case Study</div>
          <p>Select any anatomical part from the 3D model or side hierarchy to review patient presentation, diagnosis, treatment, and self-assessment quiz.</p>
        </div>
      `;
      return;
    }

    const { caseStudy } = part;

    const diagnosticItems = (caseStudy.diagnosticFindings || [])
      .map(item => `<li><span class="bullet-tag">DIAG</span> ${escapeHtml(item)}</li>`)
      .join('');

    const managementItems = (caseStudy.management || [])
      .map(item => `<li><span class="bullet-tag rx">Rx</span> ${escapeHtml(item)}</li>`)
      .join('');

    let quizHtml = '';
    if (caseStudy.quiz) {
      const optionsHtml = caseStudy.quiz.options
        .map((opt, idx) => `
          <button class="quiz-option-btn" data-index="${idx}">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-text">${escapeHtml(opt)}</span>
          </button>
        `)
        .join('');

      quizHtml = `
        <div class="quiz-card" id="quizCard">
          <div class="quiz-badge">💡 MEDICAL STUDENT CLINICAL CHALLENGE</div>
          <div class="quiz-question">${escapeHtml(caseStudy.quiz.question)}</div>
          <div class="quiz-options">${optionsHtml}</div>
          <div class="quiz-feedback" id="quizFeedback" style="display: none;">
            <div class="feedback-status" id="quizStatus"></div>
            <div class="feedback-explanation" id="quizExplanation">
              <strong>Clinical Rationale:</strong> ${escapeHtml(caseStudy.quiz.explanation)}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="case-study-active">
        <div class="case-header">
          <div class="case-badge">CLINICAL VIGNETTE</div>
          <h3 class="case-title">${escapeHtml(caseStudy.title)}</h3>
          <div class="case-patient"><strong>Patient:</strong> ${escapeHtml(caseStudy.patient)}</div>
        </div>

        <div class="case-section">
          <div class="section-heading">EMERGENCY PRESENTATION & VITALS</div>
          <p class="case-text">${escapeHtml(caseStudy.presentation)}</p>
          ${caseStudy.vitals ? `<div class="vitals-pill"><strong>Vitals:</strong> ${escapeHtml(caseStudy.vitals)}</div>` : ''}
        </div>

        ${diagnosticItems ? `
          <div class="case-section">
            <div class="section-heading">DIAGNOSTIC WORKUP & LABS</div>
            <ul class="case-list">${diagnosticItems}</ul>
          </div>
        ` : ''}

        <div class="case-section">
          <div class="section-heading">PATHOPHYSIOLOGY</div>
          <p class="case-text highlighted">${escapeHtml(caseStudy.pathophysiology)}</p>
        </div>

        ${managementItems ? `
          <div class="case-section">
            <div class="section-heading">EVIDENCE-BASED CLINICAL MANAGEMENT</div>
            <ul class="case-list rx-list">${managementItems}</ul>
          </div>
        ` : ''}

        ${quizHtml}
      </div>
    `;

    // Attach quiz events
    if (caseStudy.quiz) {
      const quizButtons = container.querySelectorAll('.quiz-option-btn');
      const feedback = container.querySelector('#quizFeedback');
      const status = container.querySelector('#quizStatus');

      quizButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
          const isCorrect = selectedIdx === caseStudy.quiz.correctIndex;

          quizButtons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === caseStudy.quiz.correctIndex) {
              b.classList.add('correct');
            } else if (idx === selectedIdx && !isCorrect) {
              b.classList.add('incorrect');
            }
          });

          feedback.style.display = 'block';
          if (isCorrect) {
            status.innerHTML = '<span class="status-correct">✓ Correct Diagnosis! Excellent clinical deduction.</span>';
          } else {
            status.innerHTML = '<span class="status-incorrect">✗ Incorrect. Review the clinical explanation below.</span>';
          }
        });
      });
    }
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

  return {
    render
  };
}
