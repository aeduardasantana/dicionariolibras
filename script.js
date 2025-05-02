import { lookupWord, getPortugueseType } from 'dictionary';
import { buildSentence } from 'sentence';

document.addEventListener('DOMContentLoaded', () => {
    // --- Dictionary Elements ---
    const wordInput = document.getElementById('word-input');
    const searchWordBtn = document.getElementById('search-word-btn');
    const dictionaryResult = document.getElementById('dictionary-result');

    // --- Dactylology Elements ---
    const dactylologyInput = document.getElementById('dactylology-input');
    const dactylologyBtn = document.getElementById('dactylology-btn');
    const dactylologyResult = document.getElementById('dactylology-result');

    // --- Sentence Builder Elements ---
    const subjectInput = document.getElementById('subject-input');
    const subjectIsProperNounCheckbox = document.getElementById('subject-is-proper-noun');
    const verbInput = document.getElementById('verb-input');
    const objectInput = document.getElementById('object-input');
    const sentenceTypeSelect = document.getElementById('sentence-type');
    const buildSentenceBtn = document.getElementById('build-sentence-btn');
    const sentenceResult = document.getElementById('sentence-result');

    // --- Dictionary Search ---
    searchWordBtn.addEventListener('click', searchWord);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWord();
        }
    });

    function searchWord() {
        const word = wordInput.value.trim();
        dictionaryResult.innerHTML = ''; // Clear previous results

        if (!word) {
            dictionaryResult.innerHTML = '<p>Por favor, digite uma palavra.</p>';
            return;
        }

        const resultData = lookupWord(word);

        if (resultData) {
            const portugueseType = getPortugueseType(resultData.type);
            const resultItemHTML = `
                <div class="result-item">
                    <img src="./assets/${resultData.img}" alt="Sinal LIBRAS para ${word}">
                    <span>${word.toUpperCase()}</span>
                    <small>Tipo: ${portugueseType}</small>
                </div>
            `;
            dictionaryResult.innerHTML = resultItemHTML;
        } else {
            dictionaryResult.innerHTML = `<p>O termo "${word}" não foi localizado em nosso vocabulário.</p>`;
        }
        wordInput.value = ''; // Clear input after search
    }

    // --- Dactylology Generator ---
    dactylologyBtn.addEventListener('click', generateDactylology);
    dactylologyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateDactylology();
        }
    });

    function generateDactylology() {
        const word = dactylologyInput.value.trim();
        dactylologyResult.innerHTML = ''; // Clear previous result

        if (!word) {
            dactylologyResult.innerHTML = '<p>Por favor, digite uma palavra ou nome para soletrar.</p>';
            return;
        }

        // Basic validation: Allow letters, numbers, and maybe spaces. Filter others?
        // For now, keep it simple and let the font handle rendering.
        const letters = word.toUpperCase().split('');

        const lettersHTML = letters.map(letter => {
            // Handle space explicitly if needed, otherwise just wrap the letter
            if (letter === ' ') {
                return '<span class="letter-item" style="border: none; background: none; width: 20px;"></span>'; // Represent space
            }
             // Filter only A-Z and 0-9 for the LIBRAS font (assuming it supports these)
            if (/^[A-Z0-9]$/.test(letter)) {
                 return `<span class="letter-item">${letter}</span>`;
            }
            // Optionally represent unsupported characters differently
            return `<span class="letter-item" style="font-family: sans-serif; font-size: 0.8em;">?</span>`;

        }).join('');

        dactylologyResult.innerHTML = lettersHTML;
    }

    // --- Sentence Builder ---
    buildSentenceBtn.addEventListener('click', createSentence);
    // Add listeners for Enter key on other sentence inputs for convenience
     subjectInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createSentence(); });
     verbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createSentence(); });
     objectInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createSentence(); });
     // Also trigger on checkbox change or select change? Maybe not needed.


    function createSentence() {
        const subject = subjectInput.value.trim();
        const verb = verbInput.value.trim();
        const object = objectInput.value.trim();
        const sentenceType = sentenceTypeSelect.value;
        const isSubjectProperNoun = subjectIsProperNounCheckbox.checked;

        sentenceResult.innerHTML = ''; // Clear previous result

        if (!subject && !verb && !object) {
            sentenceResult.innerHTML = '<p>Por favor, insira Sujeito, Verbo ou Objeto.</p>';
            return;
        }

        const sentenceHTML = buildSentence(subject, verb, object, sentenceType, isSubjectProperNoun);
        sentenceResult.innerHTML = sentenceHTML;
    }
});