const { heroCatalog, monsterCatalog, bossCatalog, defaultMockCombatants } = window.DungeonRushData;
const { statusMeta, storageKey: STORAGE_KEY, routeMap, createInitialState } = window.DungeonRushConfig;
const { maxHeroes, maxMonstersPerRoom } = window.DungeonRushConfig;
const state = createInitialState();

const app = document.querySelector('#app');
let renderScheduled = false;

function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    render();
  });
}

function hydrateRoute() {
  if (window.history && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  const hashKey = window.location.hash.replace('#', '').trim();
  const pageKey = hashKey || document.body.dataset.page || 'home';
  const mappedScreen = routeMap[pageKey] || 'home';
  state.screen = mappedScreen;
  loadPersistedState();
  state.screen = mappedScreen;
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return;

    state.selectedHeroIds = Array.isArray(saved.selectedHeroIds) ? saved.selectedHeroIds.slice(0, maxHeroes) : [];
    state.selectedMonsterIds = Array.isArray(saved.selectedMonsterIds) ? saved.selectedMonsterIds.slice(0, maxMonstersPerRoom) : [];
    state.completedRooms = Array.isArray(saved.completedRooms) ? saved.completedRooms : [];
    state.selectedId = saved.selectedId ?? null;
    state.game = saved.game ?? null;
    state.combatants = Array.isArray(saved.combatants) ? saved.combatants : [...defaultMockCombatants].sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name));
    state.screen = routeMap[document.body.dataset.page || 'home'] || state.screen;
  } catch (error) {
    console.warn('Estado persistido inválido:', error);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedHeroIds: state.selectedHeroIds,
      selectedMonsterIds: state.selectedMonsterIds,
      selectedId: state.selectedId,
      game: state.game,
      completedRooms: state.completedRooms,
      combatants: state.combatants,
    }));
  } catch (error) {
    console.warn('Não foi possível salvar o estado:', error);
  }
}

function getDungeonName() {
  return state.game?.dungeonName?.trim() ?? '';
}

function getCompletedRooms() {
  return Array.isArray(state.game?.completedRooms)
    ? state.game.completedRooms
    : Array.isArray(state.completedRooms)
      ? state.completedRooms
      : [];
}

function getRoomOutcome(roomNumber) {
  const outcomes = state.game?.roomOutcomes || {};
  return outcomes[Number(roomNumber)] || null;
}

function renderDungeonProgress() {
  const totalRooms = 10;
  const currentRoom = state.game?.currentRoom || 1;
  const completedRooms = new Set(getCompletedRooms());

  return `
    <div class="dungeon-progress panel">
      <div class="dungeon-progress-head">Mapa da dungeon</div>
      <div class="dungeon-progress-track">
        ${Array.from({ length: totalRooms }, (_, index) => {
          const roomNumber = index + 1;
          const isCompleted = completedRooms.has(roomNumber);
          const isCurrent = roomNumber === currentRoom;
          const isBoss = roomNumber === 10;
          const roomOutcome = isCompleted ? getRoomOutcome(roomNumber) : null;
          const outcomeLabel = roomOutcome === 'battle' ? 'Combate vencido' : roomOutcome === 'treasure' ? 'Baú resolvido' : 'Sala concluída';
          const marker = roomOutcome === 'treasure' ? '✦' : '✓';
          return `
            <div class="dungeon-node ${isCompleted ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''} ${isBoss ? 'is-boss' : ''} ${roomOutcome === 'battle' ? 'is-battle' : ''} ${roomOutcome === 'treasure' ? 'is-treasure' : ''}" title="Sala ${roomNumber} · ${outcomeLabel}">
              ${isCompleted ? marker : roomNumber}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function markRoomAsCompleted(roomNumber, outcome = 'battle') {
  if (!state.game) return;

  const safeRoomNumber = Number(roomNumber);
  if (!Number.isFinite(safeRoomNumber)) return;

  state.game.completedRooms = Array.isArray(state.game.completedRooms) ? state.game.completedRooms : [];
  if (!state.game.completedRooms.includes(safeRoomNumber)) {
    state.game.completedRooms.push(safeRoomNumber);
  }

  state.game.roomOutcomes = state.game.roomOutcomes || {};
  if (!Object.prototype.hasOwnProperty.call(state.game.roomOutcomes, safeRoomNumber)) {
    state.game.roomOutcomes[safeRoomNumber] = outcome;
  }
  state.completedRooms = [...state.game.completedRooms];
}

function resolveBattleOutcome() {
  if (!state.combatants || !state.game) return null;

  const livingHeroes = state.combatants.filter((unit) => unit.type === 'hero' && Number(unit.hp) > 0);
  const livingEnemies = state.combatants.filter((unit) => unit.type !== 'hero' && Number(unit.hp) > 0);
  const currentRoom = state.game.currentRoom || 1;
  const isBossRoom = currentRoom === 10;

  if (!livingHeroes.length) {
    return 'defeat';
  }

  if (!livingEnemies.length) {
    markRoomAsCompleted(currentRoom, 'battle');

    if (isBossRoom) {
      return 'victory';
    }

    return null;
  }

  return null;
}

function getSelectedHeroes() {
  return state.selectedHeroIds
    .map((id) => {
      const baseHero = heroCatalog.find((hero) => hero.id === id);
      if (!baseHero) return null;

      const progress = getHeroProgress(id);
      return {
        ...baseHero,
        hp: progress ? progress.hp : baseHero.hp,
        maxHp: progress ? progress.maxHp : baseHero.maxHp,
      };
    })
    .filter(Boolean);
}

function getSelectedMonsters() {
  return state.selectedMonsterIds
    .map((id) => monsterCatalog.find((monster) => monster.id === id))
    .filter(Boolean);
}

function getSelectedBosses() {
  return state.selectedMonsterIds
    .map((id) => bossCatalog.find((boss) => boss.id === id))
    .filter(Boolean);
}

function getSelectedMonsterThreat() {
  return getSelectedMonsters().reduce((total, monster) => total + (monster.threat || 0), 0);
}

function getSelectedBossThreat() {
  return getSelectedBosses().reduce((total, boss) => total + (boss.threat || 0), 0);
}

function getHeroLevel(heroId) {
  const room = state.game?.currentRoom || 1;
  const hero = heroCatalog.find((entry) => entry.id === heroId);
  if (!hero) return 1;

  return room >= 6 ? 2 : 1;
}

function ensureGameState() {
  if (!state.game) {
    state.game = {
      currentRoom: 1,
      dungeonName: '',
      heroes: [],
      monsters: [],
      combatants: [],
      history: [],
      heroProgress: {},
    };
  }

  state.game.heroProgress = state.game.heroProgress || {};
}

function getHeroProgress(heroId) {
  const baseHero = heroCatalog.find((hero) => hero.id === heroId);
  if (!baseHero) return null;

  ensureGameState();
  const saved = state.game.heroProgress[heroId] || {};
  const maxHp = baseHero.maxHp;

  return {
    hp: Math.max(0, Math.min(saved.hp ?? baseHero.hp, maxHp)),
    maxHp,
    statuses: [],
  };
}

function syncHeroProgressFromCombatants() {
  ensureGameState();

  state.combatants.forEach((unit) => {
    if (unit.type !== 'hero') return;

    const baseHero = heroCatalog.find((hero) => hero.id === unit.id);
    if (!baseHero) return;

    state.game.heroProgress[unit.id] = {
      hp: Math.max(0, Math.min(unit.hp ?? baseHero.hp, baseHero.maxHp)),
      maxHp: baseHero.maxHp,
      statuses: [],
    };
  });
}

function buildCombatants() {
  const heroes = getSelectedHeroes().map((unit, index) => ({ ...unit, selectionOrder: index, statuses: [] }));
  const monsters = getSelectedMonsters().map((unit, index) => ({ ...unit, selectionOrder: index, statuses: [] }));

  return [...heroes, ...monsters].sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }

    if (a.type !== b.type) {
      return a.type === 'hero' ? -1 : 1;
    }

    return a.selectionOrder - b.selectionOrder;
  });
}

function startRoomCombat() {
  const isBossRoom = (state.game?.currentRoom || 1) === 10;
  const selectedBosses = getSelectedBosses();
  const selectedMonsters = getSelectedMonsters();

  if (!isBossRoom && !state.selectedMonsterIds.length) {
    return;
  }

  if (isBossRoom && !selectedBosses.length) {
    return;
  }

  ensureGameState();

  const selectedHeroes = getSelectedHeroes();
  const activeEnemies = isBossRoom ? selectedBosses : selectedMonsters;

  if (!selectedHeroes.length || !activeEnemies.length) {
    return;
  }

  state.game.currentRoom = state.game.currentRoom || 1;
  state.game.heroes = selectedHeroes;
  state.game.monsters = activeEnemies;

  state.combatants = [...selectedHeroes, ...activeEnemies].sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }

    if (a.type !== b.type) {
      return a.type === 'hero' ? -1 : 1;
    }

    const aOrder = selectedHeroes.findIndex((hero) => hero.id === a.id);
    const bOrder = selectedHeroes.findIndex((hero) => hero.id === b.id);
    const aMOrder = activeEnemies.findIndex((enemy) => enemy.id === a.id);
    const bMOrder = activeEnemies.findIndex((enemy) => enemy.id === b.id);

    if (a.type === 'hero') {
      return aOrder - bOrder;
    }

    return aMOrder - bMOrder;
  }).map((unit) => ({
    id: unit.id,
    name: unit.name,
    type: unit.type,
    className: unit.className,
    race: unit.race,
    hp: unit.hp,
    maxHp: unit.maxHp,
    ac: unit.ac,
    initiative: unit.initiative,
    statuses: [],
  }));

  state.game.combatants = state.combatants;
  state.combatants.forEach((unit) => {
    if (unit.type !== 'hero') return;

    const heroProgress = getHeroProgress(unit.id);
    if (!heroProgress) return;

    unit.hp = heroProgress.hp;
    unit.maxHp = heroProgress.maxHp;
    unit.statuses = [];
    state.game.heroProgress[unit.id] = { ...heroProgress, statuses: [] };
  });

  state.selectedId = null;
  state.screen = 'battle';
  resetScrollToTop();
  render();
}

function nextRoom() {
  if (!state.game) {
    state.game = {
      currentRoom: 1,
      heroes: getSelectedHeroes(),
      monsters: [],
      combatants: [],
      history: [],
    };
  }

  const currentRoom = state.game.currentRoom || 1;
  markRoomAsCompleted(currentRoom, 'treasure');

  const nextRoomNumber = Math.min(currentRoom + 1, 10);
  state.game.currentRoom = nextRoomNumber;
  state.selectedMonsterIds = [];
  state.selectedId = null;
  state.screen = 'roomPrep';
  resetScrollToTop();
  render();
}

function resetGame() {
  state.game = {
    currentRoom: 1,
    dungeonName: '',
    heroes: [],
    monsters: [],
    combatants: [],
    history: [],
    heroProgress: {},
    completedRooms: [],
  };
  state.selectedHeroIds = [];
  state.selectedMonsterIds = [];
  state.selectedId = null;
  state.completedRooms = [];
  state.combatants = [...defaultMockCombatants].sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name));
}

function getTurnOrderLabel(characterId) {
  const position = state.combatants.findIndex((unit) => unit.id === characterId);
  const safePosition = position >= 0 ? position + 1 : 1;

  if (safePosition === 1) return '1º';
  if (safePosition === 2) return '2º';
  if (safePosition === 3) return '3º';
  if (safePosition === 4) return '4º';
  return `${safePosition}º`;
}

function renderHomeScreen() {
  return DungeonRushViews.renderHome();
}

function renderLobbyScreen() {
  return DungeonRushViews.renderLobby({ selectedHeroes: getSelectedHeroes() });
}

function renderHeroSelectionScreen() {
  return DungeonRushViews.renderHeroSelection({ heroes: heroCatalog, selectedIds: state.selectedHeroIds, maxHeroes }); /*
    <main class="app-shell">
      <section class="screen selection-screen panel">
        <header class="page-header">
          <div>
            <p class="eyebrow">Aventura</p>
            <h2 class="page-title">Seleção de Heróis</h2>
          </div>
        </header>

        <div class="selection-grid">
          ${heroCatalog.map((hero) => {
            const isSelected = selected.has(hero.id);
            return `
              <button
                class="select-card hero-card ${isSelected ? 'selected' : ''}"
                data-action="toggle-hero"
                data-id="${hero.id}"
                type="button"
              >
                <div class="card-topline">
                  <h3>${hero.name}</h3>
                  <span class="card-symbol">✦</span>
                </div>
                <p class="class-line">${hero.className}</p>
                <div class="mini-stats">
                  <span>PV ${hero.hp}</span>
                  <span>CA ${hero.ac}</span>
                  <span>INI ${hero.initiative}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <div class="action-stack compact-actions">
          <button class="secondary-button" data-action="back-to-lobby">Voltar</button>
          <button class="primary-button" data-action="confirm-heroes">Confirmar Heróis</button>
        </div>
      </section>
    </main>
  `; */
}

function renderRoomPrepScreen() {
  const monsters = getSelectedMonsters();
  const bosses = getSelectedBosses();
  const heroes = getSelectedHeroes();
  const roomNumber = state.game?.currentRoom || 1;
  const isBossRoom = roomNumber === 10;
  const threatTotal = isBossRoom ? getSelectedBossThreat() : getSelectedMonsterThreat();
  const enemyCatalog = isBossRoom ? bossCatalog : monsterCatalog;

  return DungeonRushViews.renderRoomPrep({ heroes, enemies: enemyCatalog, selectedIds: state.selectedMonsterIds, roomNumber, isBossRoom, threatTotal, renderDungeonProgress, maxMonsters: maxMonstersPerRoom }); /*
    <main class="app-shell">
      <section class="screen room-screen panel">
        <header class="page-header room-header-top">
          <div>
            <h2 class="page-title room-setup-title">Preparação da Sala ${roomNumber}</h2>
          </div>
        </header>

        ${renderDungeonProgress()}

        <div class="room-section">
          <div class="room-section-label">Heróis</div>
          <div class="roster-list">
            ${heroes.map((hero) => `
              <div class="roster-entry hero-entry">
                <span>${hero.name}</span>
                <small>${hero.className} · PV ${hero.hp}/${hero.maxHp}</small>
              </div>
            `).join('') || '<div class="roster-empty">Sem heróis selecionados</div>'}
          </div>
        </div>

        <div class="room-section">
          <div class="room-section-label">${isBossRoom ? 'Boss' : 'Ameaça'}</div>
          <div class="threat-summary">
            <span class="threat-label">${isBossRoom ? 'Boss selecionado' : 'Pontos de ameaça'}</span>
            <strong class="threat-value">${threatTotal || (isBossRoom ? 0 : 0)}</strong>
          </div>
        </div>

        <div class="selection-grid">
          ${enemyCatalog.map((enemy) => {
            const isSelected = state.selectedMonsterIds.includes(enemy.id);
            return `
              <button
                class="select-card ${isBossRoom ? 'boss-card' : 'monster-card'} ${isSelected ? 'selected' : ''}"
                data-action="toggle-monster"
                data-id="${enemy.id}"
                type="button"
              >
                <div class="card-topline">
                  <h3>${enemy.name}</h3>
                  <span class="card-symbol">${isBossRoom ? '✹' : '☠'}</span>
                </div>
                <div class="mini-stats">
                  <span>PV ${enemy.hp}</span>
                  <span>CA ${enemy.ac}</span>
                  <span>INI ${enemy.initiative}</span>
                  <span>${isBossRoom ? 'Boss' : `Ameaça ${enemy.threat}`}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <div class="action-stack compact-actions room-prep-actions">
          ${isBossRoom ? '' : `<button class="secondary-button" data-action="advance-room" type="button">Avançar Sala</button>`}
          <button class="primary-button" data-action="start-combat" ${isBossRoom ? (bosses.length === 0 ? 'disabled' : '') : (monsters.length === 0 ? 'disabled' : '')}>
            Iniciar Combate
          </button>
        </div>
      </section>
    </main>
  `; */
}

function renderBattleScreen() {
  return DungeonRushViews.renderBattle({
    state,
    getDungeonName,
    renderDungeonProgress,
    getTurnOrderLabel,
    getHeroLevel,
    components: DungeonRushComponents,
  });
}

function renderOutcomeScreen(result) {
  return DungeonRushViews.renderOutcome(result);
}

function getDraftForSelected(selected) {
  if (!selected) return null;

  if (!state.modalDraft || state.modalDraft.id !== selected.id) {
    state.modalDraft = {
      id: selected.id,
      hp: selected.hp,
      statuses: [...selected.statuses],
    };
  }

  return state.modalDraft;
}

function renderModal() {
  const selected = state.combatants.find((character) => character.id === state.selectedId);
  if (!selected) return '';

  const draft = getDraftForSelected(selected);
  const statusButtons = Object.keys(statusMeta)
    .map((statusName) => {
      const active = draft.statuses.includes(statusName);
      return `
        <button class="status-toggle ${active ? 'is-active' : ''}" data-status="${statusName}" data-action="toggle-status">
          ${statusName}
        </button>
      `;
    })
    .join('');

  return `
    <div class="dialog-backdrop" data-action="close-modal">
      <div class="character-panel panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <div class="character-panel-header">
          <h3 id="panel-title" class="character-panel-title">${selected.name}</h3>
          <button class="close-button" data-action="close-modal" aria-label="Fechar detalhes">×</button>
        </div>

        <div class="detail-grid">
          <div class="detail-cell">
            <span class="detail-label">PV</span>
            <span class="detail-value">${draft.hp} / ${selected.maxHp}</span>
          </div>
          <div class="detail-cell">
            <span class="detail-label">CA</span>
            <span class="detail-value">${selected.ac}</span>
          </div>
          <div class="detail-cell">
            <span class="detail-label">INI</span>
            <span class="detail-value">${selected.initiative}</span>
          </div>
          <div class="detail-cell">
            <span class="detail-label">Tipo</span>
            <span class="detail-value">${selected.type === 'hero' ? 'Herói' : selected.type === 'boss' ? 'Boss' : 'Monstro'}</span>
          </div>
        </div>

        <div class="hp-editor">
          <span class="detail-label">Editar PV</span>
          <div class="hp-editor-row">
            <button class="hp-adjust" data-action="modify-hp" data-delta="-1" type="button">−</button>
            <input class="hp-input" data-action="hp-input" type="number" min="0" max="${selected.maxHp}" value="${draft.hp}" />
            <button class="hp-adjust" data-action="modify-hp" data-delta="1" type="button">+</button>
          </div>
        </div>

        <div>
          <span class="detail-label">Status</span>
          <div class="status-grid">${statusButtons}</div>
        </div>

        <div class="modal-actions">
          <button class="secondary-button" data-action="cancel-status-edits" type="button">Cancelar</button>
          <button class="primary-button" data-action="confirm-status-edits" type="button">Confirmar</button>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmationModal() {
  if (!state.confirmation) return '';

  const { title, message, confirmText, cancelText, confirmAction } = state.confirmation;

  return `
    <div class="dialog-backdrop" data-action="close-confirmation">
      <div class="character-panel panel" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="character-panel-header">
          <h3 id="confirm-title" class="character-panel-title">${title}</h3>
          <button class="close-button" data-action="close-confirmation" aria-label="Fechar confirmação">×</button>
        </div>

        <p class="outcome-message" style="margin-top: 0; margin-bottom: 18px; text-align: left;">${message}</p>

        <div class="modal-actions">
          <button class="secondary-button" data-action="close-confirmation" type="button">${cancelText || 'Cancelar'}</button>
          <button class="primary-button" data-action="${confirmAction}" type="button">${confirmText || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  `;
}

function syncLobbyButtonState() {
  const startButton = document.querySelector('[data-action="start-dungeon"]');
  if (!startButton) return;

  const hasHeroes = state.selectedHeroIds.length > 0;
  startButton.disabled = !hasHeroes;
}

function resetScrollToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  } catch (error) {
    console.warn('Não foi possível resetar o scroll:', error);
  }
}

function render() {
  if (state.screen === 'battle') {
    const result = resolveBattleOutcome();
    if (result) {
      state.screen = result;
    }
  }

  const previousScreen = state.lastRenderedScreen;
  if (previousScreen !== state.screen) {
    resetScrollToTop();
  }

  let content = '';

  switch (state.screen) {
    case 'lobby':
      content = renderLobbyScreen();
      break;
    case 'heroSelect':
      content = renderHeroSelectionScreen();
      break;
    case 'roomPrep':
      content = renderRoomPrepScreen();
      break;
    case 'battle':
      content = renderBattleScreen();
      break;
    case 'victory':
      content = renderOutcomeScreen('victory');
      break;
    case 'defeat':
      content = renderOutcomeScreen('defeat');
      break;
    default:
      content = renderHomeScreen();
      break;
  }

  app.innerHTML = content + renderModal() + renderConfirmationModal();

  if (state.screen === 'lobby') {
    syncLobbyButtonState();
  }

  state.lastRenderedScreen = state.screen;
  saveState();
}

function goToPage(pageKey, screenName) {
  const nextScreen = screenName || routeMap[pageKey] || 'home';
  state.screen = nextScreen;
  saveState();
  const targetHash = pageKey && pageKey !== 'home' ? `#${pageKey}` : '#home';
  if (window.history && window.history.pushState) {
    window.history.pushState({ screen: nextScreen }, '', targetHash);
  } else {
    window.location.hash = targetHash;
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  scheduleRender();
}

app.addEventListener('click', (event) => {
  const actionTarget = event.target.closest('[data-action]');
  const modalPanel = event.target.closest('.character-panel');

  if (actionTarget && actionTarget.classList.contains('dialog-backdrop') && modalPanel) {
    return;
  }

  if (!actionTarget) {
    const card = event.target.closest('.combatant-card');
    if (card) {
      state.selectedId = card.dataset.id;
      render();
    }
    return;
  }

  const { action, id, delta, status } = actionTarget.dataset;

  if (action === 'new-game') {
    resetGame();
    goToPage('lobby', 'lobby');
    return;
  }

  if (action === 'back-to-home') {
    resetGame();
    goToPage('home', 'home');
    return;
  }

  if (action === 'cancel-new-game') {
    resetGame();
    goToPage('home', 'home');
    return;
  }

  if (action === 'open-manual') {
    window.location.href = './manual.html';
    return;
  }

  if (action === 'show-partidas') {
    resetGame();
    state.screen = 'lobby';
    render();
    return;
  }

  if (action === 'open-hero-select') {
    goToPage('heroSelect', 'heroSelect');
    return;
  }

  if (action === 'back-to-lobby') {
    goToPage('lobby', 'lobby');
    return;
  }

  if (action === 'toggle-hero') {
    if (state.selectedHeroIds.includes(id)) {
      state.selectedHeroIds = state.selectedHeroIds.filter((heroId) => heroId !== id);
    } else {
      if (state.selectedHeroIds.length >= maxHeroes) return;
      state.selectedHeroIds = [...state.selectedHeroIds, id];
    }
    render();
    return;
  }

  if (action === 'confirm-heroes') {
    state.game = state.game || {
      currentRoom: 1,
      dungeonName: 'Masmorra do Vale',
      heroes: [],
      monsters: [],
      combatants: [],
      history: [],
    };
    state.game.heroes = getSelectedHeroes();
    state.game.history = state.game.history || [];
    goToPage('lobby', 'lobby');
    return;
  }

  if (action === 'start-dungeon') {
    const dungeonName = (state.game?.dungeonName ?? getDungeonName()).trim();
    if (!state.selectedHeroIds.length) {
      return;
    }
    state.game = state.game || {
      currentRoom: 1,
      dungeonName: '',
      heroes: [],
      monsters: [],
      combatants: [],
      history: [],
    };
    state.game.dungeonName = dungeonName;
    state.game.heroes = getSelectedHeroes();
    state.game.history = state.game.history || [];
    state.game.history.push({
      type: 'dungeon_started',
      name: state.game.dungeonName,
      room: state.game.currentRoom,
    });
    goToPage('roomPrep', 'roomPrep');
    return;
  }

  if (action === 'toggle-monster') {
    const isBossRoom = (state.game?.currentRoom || 1) === 10;

    if (isBossRoom) {
      state.selectedMonsterIds = state.selectedMonsterIds.includes(id) ? [] : [id];
      render();
      return;
    }

    if (state.selectedMonsterIds.includes(id)) {
      state.selectedMonsterIds = state.selectedMonsterIds.filter((monsterId) => monsterId !== id);
    } else {
      if (state.selectedMonsterIds.length >= maxMonstersPerRoom) return;
      state.selectedMonsterIds = [...state.selectedMonsterIds, id];
    }
    render();
    return;
  }

  if (action === 'start-combat') {
    startRoomCombat();
    if (state.screen === 'battle') {
      goToPage('battle', 'battle');
    }
    return;
  }

  if (action === 'advance-room') {
    state.confirmation = {
      title: 'Sala vencida',
      message: 'Os heróis vão vencer a sala atual sem lutar. Isso marca a sala como concluída e avança para a próxima.',
      confirmText: 'Avançar',
      cancelText: 'Cancelar',
      confirmAction: 'advance-room-confirmed'
    };
    render();
    return;
  }

  if (action === 'advance-room-confirmed') {
    state.confirmation = null;
    nextRoom();
    if (state.screen === 'roomPrep') {
      goToPage('roomPrep', 'roomPrep');
    }
    return;
  }

  if (action === 'next-room') {
    nextRoom();
    return;
  }

  if (action === 'end-dungeon') {
    state.confirmation = {
      title: 'Encerrar dungeon',
      message: 'Isso volta para o menu inicial e apaga o andamento atual da dungeon.',
      confirmText: 'Encerrar',
      cancelText: 'Cancelar',
      confirmAction: 'end-dungeon-confirmed'
    };
    render();
    return;
  }

  if (action === 'end-dungeon-confirmed') {
    state.confirmation = null;
    resetGame();
    state.screen = 'home';
    render();
    return;
  }

  if (action === 'close-confirmation') {
    state.confirmation = null;
    render();
    return;
  }

  if (action === 'close-modal' || action === 'cancel-status-edits') {
    state.selectedId = null;
    state.modalDraft = null;
    render();
    return;
  }

  if (action === 'confirm-status-edits') {
    const selected = state.combatants.find((character) => character.id === state.selectedId);
    if (!selected) return;

    const draft = getDraftForSelected(selected);
    selected.hp = Math.max(0, Math.min(selected.maxHp, Number(draft.hp) || 0));
    selected.statuses = [...draft.statuses];

    if (selected.type === 'hero') {
      syncHeroProgressFromCombatants();
    }

    state.selectedId = null;
    state.modalDraft = null;
    render();
    return;
  }

  if (action === 'toggle-status') {
    const selected = state.combatants.find((character) => character.id === state.selectedId);
    if (!selected) return;

    const draft = getDraftForSelected(selected);
    const statusName = status;
    const hasStatus = draft.statuses.includes(statusName);

    draft.statuses = hasStatus
      ? draft.statuses.filter((item) => item !== statusName)
      : [...draft.statuses, statusName];

    render();
    return;
  }

  if (action === 'modify-hp') {
    const selected = state.combatants.find((character) => character.id === state.selectedId);
    if (!selected) return;

    const draft = getDraftForSelected(selected);
    const deltaValue = Number(delta) || 0;
    draft.hp = Math.max(0, Math.min(selected.maxHp, Number(draft.hp) + deltaValue));

    render();
    return;
  }

  const combatantCard = actionTarget.closest('.combatant-card');
  if (combatantCard) {
    state.selectedId = combatantCard.dataset.id;
    render();
  }
});

app.addEventListener('input', (event) => {
  const target = event.target.closest('[data-role="dungeon-name"]');
  if (!target) return;

  state.game = state.game || {
    currentRoom: 1,
    dungeonName: '',
    heroes: [],
    monsters: [],
    combatants: [],
    history: [],
  };

  state.game.dungeonName = target.value;
  syncLobbyButtonState();
});

app.addEventListener('change', (event) => {
  const target = event.target.closest('[data-action="hp-input"]');
  if (!target) return;

  const selected = state.combatants.find((character) => character.id === state.selectedId);
  if (!selected) return;

  const draft = getDraftForSelected(selected);
  const rawValue = Number(target.value);
  draft.hp = Math.max(0, Math.min(selected.maxHp, Number.isFinite(rawValue) ? rawValue : draft.hp));
});

app.addEventListener('input', (event) => {
  const target = event.target.closest('[data-action="hp-input"]');
  if (!target) return;

  const selected = state.combatants.find((character) => character.id === state.selectedId);
  if (!selected) return;

  const draft = getDraftForSelected(selected);
  const rawValue = Number(target.value);
  draft.hp = Number.isFinite(rawValue) ? rawValue : draft.hp;
});

app.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.combatant-card')) {
    event.preventDefault();
    const target = event.target.closest('.combatant-card');
    state.selectedId = target.dataset.id;
    render();
  }
});

hydrateRoute();
render();
