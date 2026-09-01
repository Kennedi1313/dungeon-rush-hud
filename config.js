// Configuração compartilhada do HUD. Mantida fora do motor da aplicação para
// que rotas, estado inicial e metadados visuais possam evoluir separadamente.
const initialCombatants = window.DungeonRushData.defaultMockCombatants;

window.DungeonRushConfig = {
  statusMeta: {
    Atordoado: { symbol: 'A', key: 'atordoado' },
    Restrito: { symbol: 'R', key: 'restrito' },
    Amedrontado: { symbol: 'M', key: 'amedrontado' },
    Inspiração: { symbol: 'I', key: 'inspiracao' },
  },
  storageKey: 'dungeon-rush-state-v1',
  maxHeroes: 3,
  maxMonstersPerRoom: 3,
  routeMap: {
    home: 'home',
    lobby: 'lobby',
    heroSelect: 'heroSelect',
    roomPrep: 'roomPrep',
    battle: 'battle',
    victory: 'victory',
    defeat: 'defeat',
    cards: 'cards',
  },
  createInitialState() {
    return {
      screen: 'home',
      lastRenderedScreen: null,
      selectedId: null,
      modalDraft: null,
      confirmation: null,
      game: null,
      selectedHeroIds: [],
      selectedMonsterIds: [],
      completedRooms: [],
      combatants: [...initialCombatants].map((unit) => ({ ...unit, baseAc: unit.ac })).sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name)),
    };
  },
};
