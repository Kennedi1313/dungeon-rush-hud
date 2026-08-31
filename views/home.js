window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderHome = function renderHome() {
  return `
    <main class="app-shell">
      <section class="screen home-screen">
        <div class="title-block panel">
          <h1 class="logo">Dungeon Rush</h1>
          <p class="subtitle">HUD</p>
          <div class="home-actions">
            <button class="primary-button" data-action="new-game">Novo Jogo</button>
            <button class="secondary-button" data-action="open-manual">Manual</button>
          </div>
        </div>
      </section>
    </main>`;
};
