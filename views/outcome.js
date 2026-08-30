window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderOutcome = function renderOutcome(result) {
  const isVictory = result === 'victory';
  const title = isVictory ? 'Vitória' : 'Derrota';
  const message = isVictory
    ? 'O boss foi derrotado. A dungeon foi concluída.'
    : 'Todos os heróis estão mortos.';

  return `
    <main class="app-shell">
      <section class="screen outcome-screen panel">
        <h1 class="outcome-title">${title}</h1>
        <p class="outcome-message">${message}</p>
        <div class="action-stack compact-actions">
          <button class="primary-button" data-action="back-to-home">Voltar ao menu</button>
        </div>
      </section>
    </main>`;
};
