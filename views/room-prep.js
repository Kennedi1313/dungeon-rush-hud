window.DungeonRushViews = window.DungeonRushViews || {};

window.DungeonRushViews.renderRoomPrep = function renderRoomPrep({ heroes, enemies, selectedIds, roomNumber, isBossRoom, threatTotal, renderDungeonProgress, maxMonsters = 3 }) {
  const selected = new Set(selectedIds);
  const limitReached = !isBossRoom && selected.size >= maxMonsters;
  return `
    <main class="app-shell"><section class="screen room-screen panel">
      <header class="page-header room-header-top"><div><h2 class="page-title room-setup-title">Preparação da Sala ${roomNumber}</h2></div></header>
      ${renderDungeonProgress()}
      <div class="room-section"><div class="room-section-label">Heróis</div><div class="roster-list">${heroes.map((hero) => `<div class="roster-entry hero-entry"><span>${hero.name}</span><small>${hero.className} · PV ${hero.hp}/${hero.maxHp}</small></div>`).join('') || '<div class="roster-empty">Sem heróis selecionados</div>'}</div></div>
      <div class="room-section"><div class="room-section-label">${isBossRoom ? 'Boss' : 'Ameaça'}</div><div class="threat-summary"><span class="threat-label">${isBossRoom ? 'Boss selecionado' : `Monstros selecionados (${selected.size}/${maxMonsters})`}</span><strong class="threat-value">${threatTotal || 0}</strong></div></div>
      <div class="selection-grid">${enemies.map((enemy) => `<button class="select-card ${isBossRoom ? 'boss-card' : 'monster-card'} ${selected.has(enemy.id) ? 'selected' : ''} ${limitReached && !selected.has(enemy.id) ? 'is-disabled' : ''}" data-action="toggle-monster" data-id="${enemy.id}" type="button" ${limitReached && !selected.has(enemy.id) ? 'aria-disabled="true"' : ''}><div class="card-topline"><h3 title="${enemy.name}">${enemy.name}</h3><span class="card-symbol">${isBossRoom ? '✹' : '☠'}</span></div><div class="mini-stats"><span>PV ${enemy.hp}</span><span>CA ${enemy.ac}</span><span>INI ${enemy.initiative}</span><span>${isBossRoom ? 'Boss' : `Ameaça ${enemy.threat}`}</span></div></button>`).join('')}</div>
      <div class="action-stack compact-actions room-prep-actions">${isBossRoom ? '' : '<button class="secondary-button" data-action="advance-room" type="button">Avançar Sala</button>'}<button class="primary-button" data-action="start-combat" ${selected.size === 0 ? 'disabled' : ''}>Iniciar Combate</button></div>
    </section></main>`;
};
