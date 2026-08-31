window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderLobby = function renderLobby({ selectedHeroes, dungeonName }) {
  return `
    <main class="app-shell">
      <section class="screen lobby-screen panel">
        <header class="page-header">
          <div><p class="eyebrow">Dungeon Rush</p><h2 class="page-title">Novo Jogo</h2></div>
          <div class="header-actions"><button class="secondary-button compact-header-button" data-action="cancel-new-game" type="button">Cancelar</button></div>
        </header>
        <div class="lobby-summary lobby-hero-summary">
          <div class="summary-header"><span>Heróis</span></div>
          <div class="roster-list compact-roster">
            ${selectedHeroes.length ? selectedHeroes.map((hero) => `<div class="roster-entry hero-entry"><span>${hero.name}</span><small>${hero.className} </small></div>`).join('') : '<div class="roster-empty">Nenhum herói selecionado</div>'}
          </div>
        </div>
        <div class="action-stack">
          <button class="primary-button" data-action="open-hero-select">Selecionar Heróis</button>
          <button class="hero-start-button" data-action="start-dungeon" ${selectedHeroes.length === 0 ? 'disabled' : ''}>Iniciar Dungeon</button>
        </div>
      </section>
    </main>`;
};
