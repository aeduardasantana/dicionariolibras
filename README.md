# Dicionário Libras — Libras Interativa

Produto de aprendizagem e consulta do ecossistema GEB, desenvolvido pela Compass Rose Systems.

## Prioridade atual

1. Formação de frases: laboratório de estudo com sujeito, verbo, objeto, tempo, ordem SVO/OSV e quatro tipos de frases.
2. Orientações gramaticais: topicalização, expressões não manuais, negação, interrogação, marcadores de tempo e diferenças entre Libras e português.
3. Dicionário: acervo lexical pequeno, ainda em validação, mantido como recurso complementar.
4. Datilologia: apoio para soletração, sem função de tradução.

## Histórico de restauração

O projeto nasceu com o nome LIBRAS Interativa e possuía um formador de frases. Esse recurso saiu da interface na repaginação identificada pelo commit 6bda359. A interface e a lógica foram restauradas em outubro de 2026, mantendo o design recente.

O arquivo sentence.js antigo estava órfão e continha importações incompatíveis com dictionary.js. Ele foi substituído por um laboratório independente, sem apresentar resultados como tradução de português em Libras.

## Limitações pedagógicas

As sequências resultantes são hipóteses didáticas em glosa; não são traduções validadas, não representam a produção visual-espacial e não verificam a gramática dos elementos digitados. O curso de Libras mantém a Unidade II sobre estrutura de frases com material mais aprofundado.

## Arquivos

- index.html: apresentação, formador, gramática, dicionário e datilologia
- sentence.js: módulo didático de formação de frases
- style.css: layout responsivo
- script.js: consulta lexical e datilologia
- dictionary.js: entradas do acervo e busca
- Arquivos PNG: acervo legado ainda não validado para apresentação pública
- Libras2020-Regular.ttf: fonte de apoio à datilologia
- .github/workflows/deploy.yml: publicação automática

## Publicação

Destino FTP: public_html/dicionariolibras/
Domínio: https://dicionariolibras.compassrosesystems.com.br/

## Regra de não regressão

Toda alteração de layout deve preservar e verificar: formador de frases, conteúdo gramatical, consulta ao dicionário e datilologia. Nenhuma funcionalidade existente pode ser eliminada silenciosamente em repaginações.
