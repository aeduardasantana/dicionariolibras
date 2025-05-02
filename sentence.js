import { lookupWord, getNegativeSign } from 'dictionary';

/**
 * Creates HTML content for a sign image and its label.
 * @param {object} signData - The sign data {img, type, ...}. Type is used for expression icons.
 * @param {string} label - The original word/label for the sign.
 * @returns {string} - HTML string for the sign item.
 */
function createSignHTML(signData, label) {
    if (!signData || !signData.img) return '';
    // Add alt text for expression icons too
    const altText = signData.type === 'expression' ? `Expressão: ${label}` : `Sinal LIBRAS para ${label}`;
    return `
        <div class="result-item">
            <img src="./assets/${signData.img}" alt="${altText}">
            <span>${label.toUpperCase()}</span>
        </div>
    `;
}

/**
 * Creates HTML content for dactylology (spelled-out name) within the sentence.
 * Uses the LIBRAS Dactylology font.
 * @param {string} name - The name to spell out.
 * @returns {string} - HTML string for the dactylology item.
 */
function createDactylologyHTML(name) {
    if (!name) return '';
    // Use standard uppercase letters for display with the custom font
    const lettersHTML = name.toUpperCase().split('').map(letter => `<span>${letter}</span>`).join('');
    return `
        <div class="dactylology-container">
            <div class="letters">${lettersHTML}</div>
            <span>${name.toUpperCase()} (Soletrado)</span>
        </div>
    `;
}

/**
 * Builds the LIBRAS sentence representation.
 * @param {string} subject - The subject word.
 * @param {string} verb - The verb word.
 * @param {string} object - The object word.
 * @param {string} sentenceType - Type ('affirmative', 'exclamative', 'negative', 'interrogative').
 * @param {boolean} isSubjectProperNoun - Whether the subject is a proper noun to be spelled out.
 * @returns {string} - HTML string representing the sentence signs.
 */
export function buildSentence(subject, verb, object, sentenceType, isSubjectProperNoun) {
    const verbData = lookupWord(verb);
    const objectData = lookupWord(object);

    let sentenceHTML = '';
    let missingWords = [];

    // --- Sentence Type Indicators ---
    let typeIndicatorData = null;
    let typeIndicatorLabel = '';
    switch (sentenceType) {
        case 'exclamative':
            typeIndicatorData = { img: 'icon_exclamative.png', type: 'expression' };
            typeIndicatorLabel = 'Exclamação';
            break;
        case 'interrogative':
            typeIndicatorData = { img: 'icon_interrogative.png', type: 'expression' };
            typeIndicatorLabel = 'Interrogação';
            break;
        case 'affirmative':
             typeIndicatorData = { img: 'icon_affirmative.png', type: 'expression' };
             typeIndicatorLabel = 'Afirmação';
             break;
        // Negative is handled with signs below
    }


    // --- Assemble Sentence (SVO Order for now) ---
    const sentenceOrder = [];

    // Handle Subject
    if (subject) {
        if (isSubjectProperNoun) {
            // Add dactylology representation instead of looking up a sign
            sentenceOrder.push({ html: createDactylologyHTML(subject) });
        } else {
            const subjectData = lookupWord(subject);
            if (subjectData) {
                sentenceOrder.push({ data: subjectData, label: subject });
            } else {
                missingWords.push(subject);
            }
        }
    }

    // Handle Negation
    let negativeSignData = null;
    let useSpecificNegativeVerb = false;
    if (sentenceType === 'negative' && verb) {
        negativeSignData = getNegativeSign(verb); // Gets specific negative verb or general "NÃO"
        if (negativeSignData && verbData && negativeSignData.img === verbData.negative_variant) {
            useSpecificNegativeVerb = true; // Flag that we should use the specific negative sign instead of the base verb + NÃO
        }
        if (!negativeSignData && !useSpecificNegativeVerb) {
             // Only report missing if we didn't find a specific negative AND couldn't find generic NÃO
            missingWords.push(`NÃO (ou variante negativa para ${verb})`);
        }
    }

    // Handle Verb
     if (verb) {
        if (useSpecificNegativeVerb) {
            // Use the specific negative variant of the verb (data already in negativeSignData)
            sentenceOrder.push({ data: negativeSignData, label: `${negativeSignData.original_verb || verb} (NÃO)` });
        } else if (verbData) {
             // Use the normal verb
             sentenceOrder.push({ data: verbData, label: verb });
             // Add the generic "NÃO" sign after the verb if applicable and not using specific variant
             if (sentenceType === 'negative' && negativeSignData && negativeSignData.img === 'nao.png') {
                 sentenceOrder.push({ data: negativeSignData, label: 'NÃO'});
             }
        } else {
             missingWords.push(verb);
             // If verb is missing, but we need negation, try adding generic NÃO if found
             if (sentenceType === 'negative' && negativeSignData && negativeSignData.img === 'nao.png') {
                 sentenceOrder.push({ data: negativeSignData, label: 'NÃO'});
             }
        }
    } else if (sentenceType === 'negative' && !verb) {
        // Handle case where only negation is needed without a verb (e.g., "EU NÃO")
        const naoData = lookupWord("não");
        if (naoData) {
             sentenceOrder.push({ data: naoData, label: 'NÃO'});
        } else {
            missingWords.push('NÃO');
        }
    }

    // Handle Object
    if (object) {
        if (objectData) {
            sentenceOrder.push({ data: objectData, label: object });
        } else {
            missingWords.push(object);
        }
    }

    // --- Generate HTML ---
    sentenceOrder.forEach(item => {
        if (item.html) { // If it's pre-rendered HTML (like dactylology)
            sentenceHTML += item.html;
        } else if (item.data) { // If it's sign data
            sentenceHTML += createSignHTML(item.data, item.label);
        }
    });


    // Add sentence type indicator (usually non-manual, represented here)
    if (typeIndicatorData) {
        sentenceHTML += createSignHTML(typeIndicatorData, typeIndicatorLabel);
    }


    // --- Handle Missing Words ---
    if (missingWords.length > 0) {
        sentenceHTML += `<p style="color: red; width: 100%; margin-top: 10px;">Palavra(s) não encontrada(s): ${missingWords.join(', ')}</p>`;
    }

    if (sentenceHTML.trim() === '' && missingWords.length === 0) {
         return '<p>Por favor, insira palavras ou marque como nome próprio para formar a frase.</p>';
    }


    return sentenceHTML;
}