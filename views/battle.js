window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderBattle = function renderBattle({ state, getDungeonName, renderDungeonProgress, getTurnOrderLabel, getHeroLevel, components }) {
  const orderedList = state.combatants
    .map((character) => components.makeCharacterCard(character, {
      turnLabel: getTurnOrderLabel(character.id),
      heroLevel: getHeroLevel(character.id),
      statusMeta: window.DungeonRushConfig.statusMeta,
    }))
    .join('');
  const battleTitle = getDungeonName() || 'Dungeon';
  const roomNumber = state.game?.currentRoom || 1;
  const isFinalBossRoom = roomNumber >= 10;
  const livingEnemies = state.combatants.filter((unit) => unit.type !== 'hero' && Number(unit.hp) > 0);
  const roomCleared = !livingEnemies.length && !isFinalBossRoom;
  const canAdvanceRoom = livingEnemies.length === 0 && !isFinalBossRoom;

  return `
    <main class="app-shell">
      <section class="screen battle-screen">
        ${renderDungeonProgress()}
        ${roomCleared ? '<div class="battle-status success">Sala finalizada</div>' : ''}
        <div class="combat-list">${orderedList}</div>
        <div class="action-stack compact-actions battle-actions">
          <button class="danger-button" data-action="end-dungeon">Encerrar Dungeon</button>
          ${!isFinalBossRoom ? `<button class="primary-button" data-action="next-room" ${canAdvanceRoom ? '' : 'disabled'}>Encerrar Sala</button>` : ''}
        </div>
      </section>
    </main>`;
};
