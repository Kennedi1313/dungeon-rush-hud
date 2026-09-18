import type { AppState } from "./types";

export const createInitialState = (): AppState => ({
  ui: {
    screen: "home",
    selectedId: null,
    modalDraft: null,
    confirmation: null,
  },
  game: null,
  selectedHeroIds: [],
  selectedMonsterIds: [],
  completedRooms: [],
  combatants: [],
});
