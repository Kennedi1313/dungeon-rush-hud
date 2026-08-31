// Componentes visuais puros do HUD. Eles não conhecem o fluxo da aplicação;
// recebem dados e callbacks/contexto e devolvem HTML.
window.DungeonRushComponents = {
  renderStatusPill(name, statusMeta) {
    const meta = statusMeta[name];
    if (!meta) return '';
    return `<span class="status-pill ${meta.key}" data-symbol="${meta.symbol}">${name}</span>`;
  },

  renderHpBar(character) {
    const safeMax = Math.max(character.maxHp, 1);
    const percent = Math.max(0, Math.min(100, (character.hp / safeMax) * 100));
    const isLow = percent <= 35;
    return `
      <div class="hp-bar" aria-label="Vida de ${character.name}">
        <div class="hp-fill ${isLow ? 'low' : ''}" style="width: ${percent}%"></div>
      </div>
      <div class="hp-text">
        <span>${character.hp} / ${character.maxHp} PV</span>
        <div class="combatant-meta-right">
          <span>CA ${character.ac}</span>
          <span>INI ${character.initiative}</span>
        </div>
      </div>`;
  },

  makeCharacterCard(character, { turnLabel, heroLevel, statusMeta }) {
    const isDefeated = Number(character.hp) <= 0;
    const statuses = character.statuses?.length
      ? character.statuses.map((status) => this.renderStatusPill(status, statusMeta)).join('')
      : '<span> </span>';
    const level = character.type === 'hero'
      ? `<span class="combatant-level">Nível ${heroLevel}</span>`
      : '<span class="combatant-level-placeholder"> </span>';
    const heroMeta = character.type === 'hero' && character.className && character.race
      ? `<div class="combatant-subtitle">${character.race} / ${character.className}</div>`
      : '';

    return `
      <article class="combatant-card ${character.type} ${isDefeated ? 'is-defeated' : ''}" data-id="${character.id}" tabindex="0" role="button" aria-label="Detalhar ${character.name}">
        <div class="combatant-header">
          <div class="combatant-turn-div">
            <span class="combatant-turn-marker" aria-label="Posição de iniciativa">${turnLabel}</span>
          </div>
          <h3 class="combatant-name">${character.name}</h3>
          ${level}
        </div>
        ${heroMeta}
        ${this.renderHpBar(character)}
        <div class="status-list">${statuses}</div>
      </article>`;
  },
};
