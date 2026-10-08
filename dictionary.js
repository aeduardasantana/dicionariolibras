const entries = [
  { slug: 'surdo', term: 'surdo', image: 'surdo.png', type: 'noun/adjective', category: 'Identidade e pessoas', aliases: ['surda'] },
  { slug: 'libras', term: 'Libras', image: 'libras.png', type: 'noun', category: 'Língua e comunicação', aliases: ['lingua brasileira de sinais'] },
  { slug: 'trigo', term: 'trigo', image: 'trigo.png', type: 'noun', category: 'Alimentos', aliases: [] },
  { slug: 'eu', term: 'eu', image: 'eu.png', type: 'pronoun', category: 'Pronomes', aliases: [] },
  { slug: 'querer', term: 'querer', image: 'querer.png', type: 'verb', category: 'Verbos', aliases: ['desejar'], negativeVariant: 'nao_querer.png' },
  { slug: 'comer', term: 'comer', image: 'comer.png', type: 'verb', category: 'Verbos', aliases: ['alimentar'] },
  { slug: 'maca', term: 'maçã', image: 'maca.png', type: 'noun', category: 'Alimentos', aliases: ['maca'] },
  { slug: 'nao', term: 'não', image: 'nao.png', type: 'adverb', category: 'Expressões', aliases: ['nao'] }
];

const typeTranslations = {
  noun: 'substantivo',
  verb: 'verbo',
  adjective: 'adjetivo',
  adverb: 'advérbio',
  pronoun: 'pronome',
  'noun/adjective': 'substantivo / adjetivo'
};

export function normalizeText(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ');
}

export function getPortugueseType(typeIdentifier) {
  return typeTranslations[typeIdentifier] || 'não especificado';
}

export function getAllEntries() {
  return [...entries].sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
}

export function searchDictionary(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const exact = entries.filter((entry) => {
    const candidates = [entry.term, entry.slug, ...(entry.aliases || [])].map(normalizeText);
    return candidates.includes(normalizedQuery);
  });
  if (exact.length) return exact;

  return entries.filter((entry) => {
    const candidates = [entry.term, entry.slug, entry.category, ...(entry.aliases || [])].map(normalizeText);
    return candidates.some((candidate) => candidate.includes(normalizedQuery) || normalizedQuery.includes(candidate));
  });
}
