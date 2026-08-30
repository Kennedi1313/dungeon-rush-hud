window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderHeroSelection = function renderHeroSelection({ heroes, selectedIds, maxHeroes = 3 }) {
  const selected = new Set(selectedIds);
  const limitReached = selected.size >= maxHeroes;
  return `
    <main class="app-shell"><section class="screen selection-screen panel">
      <header class="page-header"><div><p class="eyebrow">Aventura</p><h2 class="page-title">Seleção de Heróis</h2><p class="eyebrow">${selected.size}/${maxHeroes} heróis selecionados</p></div></header>
      <div class="selection-grid">${heroes.map((hero) => `
        <button class="select-card hero-card ${selected.has(hero.id) ? 'selected' : ''} ${limitReached && !selected.has(hero.id) ? 'is-disabled' : ''}" data-action="toggle-hero" data-id="${hero.id}" type="button" ${limitReached && !selected.has(hero.id) ? 'aria-disabled="true"' : ''}>
          <div class="card-topline"><h3>${hero.name}</h3><span class="card-symbol">✦</span></div>
          <p class="class-line">${hero.className}</p>
          <div class="mini-stats"><span>PV ${hero.hp}</span><span>CA ${hero.ac}</span><span>INI ${hero.initiative}</span></div>
        </button>`).join('')}</div>
      <div class="action-stack compact-actions"><button class="secondary-button" data-action="back-to-lobby">Voltar</button><button class="primary-button" data-action="confirm-heroes">Confirmar Heróis</button></div>
    </section></main>`;
};
