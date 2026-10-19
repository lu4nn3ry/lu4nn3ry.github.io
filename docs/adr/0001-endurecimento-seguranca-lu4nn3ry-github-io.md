# ADR 0001 — Endurecimento de segurança do lu4nn3ry.github.io

## Status

Aceito

## Data

2026-02-27

## Contexto

A revisão de segurança identificou um achado de severidade **média** e um de severidade **baixa** neste site estático publicado no GitHub Pages:

1. **Médio — Vue via CDN sem SRI e sem versão fixada**: `app.js` importava `https://unpkg.com/vue@3/dist/vue.esm-browser.js` — o seletor `vue@3` acompanha sempre a última versão 3.x publicada (supply-chain mutável: qualquer release nova substitui o código servido) e nenhum hash de integridade verificava o conteúdo baixado. Um comprometimento do CDN (ou do alias de versão) injetaria código arbitrário no site de portfólio.

2. **Baixo — links externos sem `rel="noopener noreferrer"`**: 10 links com `target="_blank"` (GitHub, LinkedIn, Instagram) em `index.html`, `about.html`, `projects.html` e `contact.html` permitiam que a página de destino acessasse `window.opener` (risco de tabnabbing reverso) e vazavam o referer.

## Decisão

1. **Pin de versão exata + SRI no Vue**:
   - `app.js` passa a importar `https://unpkg.com/vue@3.5.44/dist/vue.esm-browser.js` (versão vigente de `vue@3` na data da correção, congelada).
   - `index.html` ganha um **import map** com a chave `integrity`, mapeando a URL exata do módulo para o hash `sha256` do arquivo (calculado do binário servido pelo CDN e re-conferido após a edição). Navegadores com suporte à integridade em import maps (Chrome/Edge 127+) recusam o módulo se o conteúdo divergir do hash; navegadores sem suporte ignoram a chave `integrity` e seguem funcionando — degradação graciosa, sem quebra do site.

2. **`rel="noopener noreferrer"`** adicionado a todos os links externos com `target="_blank"` nas quatro páginas.

## Consequências

- **Positivas**: o código Vue executado no site passa a ser imutável e verificável criptograficamente; atualização do Vue torna-se ato deliberado (alterar URL + hash); `window.opener` deixa de ser exposto; referer não vaza para sites de terceiros.
- **Negativas/compensações**: atualizar o Vue exige recomputar o hash SRI e editar dois arquivos; navegadores antigos sem suporte a `integrity` em import maps não verificam o hash (mas o pin de versão exata já elimina a mutabilidade, principal vetor do achado).
- **Fora do escopo**: o stylesheet do Font Awesome (cdnjs, versão 6.4.2 fixada) permanece sem SRI — versão já pinada; anotado como melhoria futura.
- **Validações**: `node --input-type=module --check` em `app.js` (OK); hash SRI do import map reconferido contra o arquivo servido pelo CDN (idêntico); JSON do import map validado; varredura confirmou zero links `target="_blank"` sem `rel` remanescentes.
