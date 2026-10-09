// Laboratório didático de estrutura frasal. Não realiza tradução automática.
const form = document.getElementById('sentence-form');
const output = document.getElementById('sentence-result');
const byId = id => document.getElementById(id);
const normalize = s => String(s || '').trim().replace(/\s+/g,' ').toLocaleUpperCase('pt-BR');
const make = (tag, content, className) => {
  const node = document.createElement(tag);
  node.textContent = content;
  if (className) node.className = className;
  return node;
};
const descriptions = {
  affirmative: ['Afirmativa', 'Observe a ordem proposta e as expressões não manuais conforme o contexto.'],
  negative: ['Negativa', 'A negação pode ser realizada por sinal específico, modificação verbal e/ou expressão não manual. O marcador exibido é apenas didático.'],
  interrogative: ['Interrogativa', 'Perguntas exigem atenção às expressões não manuais; a marcação varia conforme o tipo de pergunta.'],
  exclamative: ['Exclamativa', 'A intenção exclamativa pode envolver expressão facial e corporal, não apenas pontuação.']
};
function buildSentence() {
  const time = normalize(byId('time-input').value);
  const subject = normalize(byId('subject-input').value);
  const verb = normalize(byId('verb-input').value);
  const object = normalize(byId('object-input').value);
  const sentenceType = byId('sentence-type').value;
  const order = byId('sentence-order').value;
  const properNoun = byId('subject-is-proper-noun').checked;
  output.replaceChildren();
  if (!subject && !verb && !object) {
    output.appendChild(make('p','Preencha sujeito, verbo ou objeto para começar a prática.','sentence-note'));
    return;
  }
  const chosen = descriptions[sentenceType] || descriptions.affirmative;
  output.appendChild(make('p',chosen[0] + ' · ' + order.toUpperCase() + ' · simulação','sentence-type-label'));
  const parts = [];
  const subjectValue = properNoun ? subject.replace(/ /g,'').split('').join('-') : subject;
  if (time) parts.push(time + ',');
  if (order === 'osv') {
    if (object) parts.push(object + ',');
    if (subject) parts.push(subjectValue);
    if (verb) parts.push(verb);
  } else {
    if (subject) parts.push(subjectValue);
    if (verb) parts.push(verb);
    if (object) parts.push(object);
  }
  if (sentenceType === 'negative') parts.push('[NEGAÇÃO]');
  if (sentenceType === 'interrogative') parts.push('?');
  if (sentenceType === 'exclamative') parts.push('!');
  const phrase = document.createElement('div');
  phrase.className = 'phrase-sequence';
  parts.forEach(word => phrase.appendChild(make('span',word,'phrase-chip')));
  output.appendChild(phrase);
  output.appendChild(make('p',chosen[1],'sentence-note'));
  if (order === 'osv') output.appendChild(make('p','OSV é apresentado para observar a topicalização; a estrutura não é adequada indistintamente a todos os contextos.','sentence-detail'));
  if (properNoun && subject) output.appendChild(make('p','Nome próprio indicado por datilologia; a escolha depende do referente e do uso na comunidade.','sentence-detail'));
  output.appendChild(make('p','Glosa didática não validada. O resultado não representa uma tradução nem demonstra os movimentos e as expressões necessárias à produção em Libras.','sentence-disclaimer'));
}
if (form && output) {
  form.addEventListener('submit',e => {e.preventDefault();buildSentence();});
  form.addEventListener('reset',() => {
    output.replaceChildren(make('p','Preencha os campos ou escolha um exemplo para formar uma hipótese de frase.','empty-state'));
  });
  const examples = {
    svo: {subject:'EU',verb:'COMER',object:'MAÇÃ',kind:'affirmative',order:'svo'},
    negative: {subject:'EU',verb:'QUERER',object:'MAÇÃ',kind:'negative',order:'svo'},
    osv: {subject:'EU',verb:'QUERER',object:'MAÇÃ',kind:'affirmative',order:'osv'}
  };
  document.querySelectorAll('[data-sentence-example]').forEach(btn => {
    btn.addEventListener('click',() => {
      const entry = examples[btn.getAttribute('data-sentence-example')];
      if (!entry) return;
      byId('time-input').value = '';
      byId('subject-input').value = entry.subject;
      byId('verb-input').value = entry.verb;
      byId('object-input').value = entry.object;
      byId('sentence-type').value = entry.kind;
      byId('sentence-order').value = entry.order;
      byId('subject-is-proper-noun').checked = false;
      buildSentence();
      output.scrollIntoView({behavior:'auto',block:'nearest'});
    });
  });
}
