import { getAllEntries, getPortugueseType, normalizeText, searchDictionary } from './dictionary.js';

const grid = document.getElementById('dictionary-grid');
const resultArea = document.getElementById('dictionary-result');
const searchForm = document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const dactylologyForm = document.getElementById('dactylology-form');
const dactylologyInput = document.getElementById('dactylology-input');
const dactylologyResult = document.getElementById('dactylology-result');

function escapeHtml(value = '') {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function entryCard(entry, compact = false) {
  const safeTerm = escapeHtml(entry.term);
  const safeCategory = escapeHtml(entry.category);
  const safeType = escapeHtml(getPortugueseType(entry.type));
  return `
    <article class="entry-card${compact ? ' entry-card--result' : ''}">
      <div class="entry-media">
        <img src="${entry.image}" alt="Ilustração disponível no acervo para ${safeTerm}" loading="lazy">
      </div>
      <div class="entry-body">
        <div class="entry-meta"><span>${safeCategory}</span><span>${safeType}</span></div>
        <h3>${safeTerm}</h3>
        <p>Registro visual do acervo atual. A evolução do projeto prevê vídeo, acepção, região e fonte por entrada.</p>
      </div>
    </article>`;
}

function renderGrid() {
  const entries = getAllEntries();
  grid.innerHTML = entries.map((entry) => entryCard(entry)).join('');
}

function renderSearch(query) {
  const results = searchDictionary(query);
  if (!query.trim()) {
    resultArea.innerHTML = '<p class="feedback feedback--warning">Digite uma palavra para iniciar a busca.</p>';
    return;
  }

  if (!results.length) {
    resultArea.innerHTML = `
      <div class="feedback">
        <strong>Nenhuma entrada encontrada para “${escapeHtml(query)}”.</strong>
        <span>O acervo ainda é reduzido. Tente uma palavra mais curta ou explore os termos disponíveis abaixo.</span>
      </div>`;
    return;
  }

  resultArea.innerHTML = `<div class="result-list">${results.map((entry) => entryCard(entry, true)).join('')}</div>`;
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderSearch(wordInput.value);
});

wordInput.addEventListener('input', () => {
  const query = wordInput.value.trim();
  if (query.length >= 2) renderSearch(query);
  if (!query) resultArea.innerHTML = '';
});

function toDactylologyLetters(value) {
  const normalized = normalizeText(value).toUpperCase();
  return normalized.replace(/[^A-Z0-9 ]/g, '').split('');
}

function renderDactylology(value) {
  const original = value.trim();
  const letters = toDactylologyLetters(original);
  if (!original || !letters.length) {
    dactylologyResult.innerHTML = '<p class="empty-state">Digite uma palavra ou nome usando letras e números.</p>';
    return;
  }

  const letterHtml = letters.map((letter) => {
    if (letter === ' ') return '<span class="manual-space" aria-hidden="true"></span>';
    return `<span class="manual-letter" aria-label="${letter}">${letter}</span>`;
  }).join('');

  dactylologyResult.innerHTML = `
    <div class="manual-word" aria-label="Dactilologia de ${escapeHtml(original)}">${letterHtml}</div>
    <small>${escapeHtml(original.toUpperCase())}</small>`;
}

dactylologyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderDactylology(dactylologyInput.value);
});

renderGrid();
