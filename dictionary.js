// Simple dictionary mapping Portuguese words to image assets and type
const dictionaryData = {
    "surdo": { img: "surdo.png", type: "noun/adjective" },
    "libras": { img: "libras.png", type: "noun" },
    "trigo": { img: "trigo.png", type: "noun" },
    "eu": { img: "eu.png", type: "pronoun"},
    "querer": { img: "querer.png", type: "verb", negative_variant: "nao_querer.png"},
    "comer": { img: "comer.png", type: "verb"},
    "maçã": { img: "maca.png", type: "noun"},
    "não": {img: "nao.png", type: "adverb"},
    "nao_querer": {img: "nao_querer.png", type: "verb_negation"}, 
    // Add more words here...
    // Example structure for verbs with specific negative forms:
    // "poder": { img: "poder.png", type: "verb", negative_variant: "nao_poder.png" },
};

// Mapping for type translation
const typeTranslations = {
    "noun": "substantivo",
    "verb": "verbo",
    "adjective": "adjetivo",
    "adverb": "advérbio",
    "pronoun": "pronome",
    "noun/adjective": "substantivo/adjetivo",
    "verb_negation": "verbo (negativa)",
    "negation": "negação",
    "expression": "expressão" 
};

/**
 * Translates the type identifier to Portuguese.
 * @param {string} typeIdentifier - The English type identifier (e.g., "noun").
 * @returns {string} - The Portuguese translation or the original identifier if not found.
 */
export function getPortugueseType(typeIdentifier) {
    if (!typeIdentifier) return 'Não especificado';
    const parts = typeIdentifier.split('/');
    const translatedParts = parts.map(part => typeTranslations[part.trim()] || part.trim());
    return translatedParts.join('/');
}

/**
 * Looks up a word in the dictionary.
 * @param {string} word - The Portuguese word to look up (case-insensitive).
 * @returns {object | null} - The dictionary entry {img, type, ...} or null if not found.
 */
export function lookupWord(word) {
    if (!word) return null;
    const lowerCaseWord = word.toLowerCase().trim();
    return dictionaryData[lowerCaseWord] || null;
}

/**
 * Gets the negative sign for a verb if available, otherwise the generic 'NÃO' sign.
 * @param {string} verb - The verb to get the negative sign for.
 * @returns {object | null} - The dictionary entry for the negative sign or null.
 */
export function getNegativeSign(verb) {
    const verbData = lookupWord(verb);
    if (verbData?.negative_variant) {
        const negativeVariantKey = verbData.negative_variant.replace('.png', '');
        const negativeVariantData = dictionaryData[negativeVariantKey];
        if (negativeVariantData) {
            return { ...negativeVariantData, original_verb: verb }; 
        }
        return { img: verbData.negative_variant, type: 'verb_negation', original_verb: verb };
    }
    const naoData = lookupWord("não");
    return naoData ? { ...naoData, type: 'negation' } : null; 
}