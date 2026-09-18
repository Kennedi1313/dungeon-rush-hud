import type { AppState, GamePhase, StatusName } from "../domain/types";
import { heroCatalog } from "../data/heroes";
import { monsterCatalog } from "../data/monsters";
import { bossCatalog } from "../data/bosses";

export const MAX_HEROES = 3;

export type GameAction =
  | { type: "HYDRATE"; state: AppState }
  | { type: "NEW_GAME" }
  | { type: "OPEN_HERO_SELECTION" }
  | { type: "TOGGLE_HERO"; heroId: string }
  | { type: "CONFIRM_HEROES" }
  | { type: "START_DUNGEON" }
  | { type: "TOGGLE_MONSTER"; monsterId: string }
  | { type: "START_COMBAT" }
  | { type: "SKIP_ROOM" }
  | { type: "REQUEST_SKIP_ROOM" }
  | { type: "CONFIRM_SKIP_ROOM" }
  | { type: "SELECT_COMBATANT"; combatantId: string }
  | { type: "CLOSE_COMBATANT" }
  | { type: "ADJUST_HP"; delta: number }
  | { type: "SET_HP"; value: number }
  | { type: "ADJUST_AC"; delta: number }
  | { type: "SET_AC"; value: number }
  | { type: "TOGGLE_STATUS"; status: StatusName }
  | { type: "CONFIRM_COMBATANT" }
  | { type: "ADVANCE_ROOM" }
  | { type: "END_DUNGEON" }
  | { type: "REQUEST_END_DUNGEON" }
  | { type: "CANCEL_CONFIRMATION" }
  | { type: "CONFIRM_END_DUNGEON" }
  | { type: "BACK_TO_HOME" }
  | { type: "BACK_TO_LOBBY" };

const screenFor = (screen: GamePhase | "home" | "cards"): AppState["ui"]["screen"] => screen;

export function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "NEW_GAME":
      return {
        ...state,
        ui: { ...state.ui, screen: "lobby", selectedId: null },
        game: null,
        selectedHeroIds: [],
        selectedMonsterIds: [],
        completedRooms: [],
        combatants: [],
      };
    case "OPEN_HERO_SELECTION":
      return { ...state, ui: { ...state.ui, screen: screenFor("hero-selection") } };
    case "TOGGLE_HERO": {
      const isSelected = state.selectedHeroIds.includes(action.heroId);
      if (!isSelected && state.selectedHeroIds.length >= MAX_HEROES) return state;

      return {
        ...state,
        selectedHeroIds: isSelected
          ? state.selectedHeroIds.filter((id) => id !== action.heroId)
          : [...state.selectedHeroIds, action.heroId],
      };
    }
    case "CONFIRM_HEROES":
      return { ...state, ui: { ...state.ui, screen: "lobby" } };
    case "START_DUNGEON":
      return {
        ...state,
        ui: { ...state.ui, screen: "room-preparation" },
        game: {
          dungeonName: "Masmorra do Vale",
          phase: "room-preparation",
          currentRoom: 1,
          heroes: heroCatalog.filter((hero) => state.selectedHeroIds.includes(hero.id)),
          monsters: [],
          combatants: [],
          completedRooms: [],
          roomOutcomes: {},
          heroProgress: Object.fromEntries(
            heroCatalog
              .filter((hero) => state.selectedHeroIds.includes(hero.id))
              .map((hero) => [hero.id, { hp: hero.hp, maxHp: hero.maxHp, statuses: [] }]),
          ),
          history: [{ type: "dungeon_started", room: 1, createdAt: new Date().toISOString() }],
        },
      };
    case "TOGGLE_MONSTER": {
      const isSelected = state.selectedMonsterIds.includes(action.monsterId);
      const selectionLimit = state.game?.currentRoom === 10 ? 1 : 3;
      if (!isSelected && state.selectedMonsterIds.length >= selectionLimit) return state;
      return {
        ...state,
        selectedMonsterIds: isSelected
          ? state.selectedMonsterIds.filter((id) => id !== action.monsterId)
          : [...state.selectedMonsterIds, action.monsterId],
      };
    }
    case "START_COMBAT": {
      const heroes = heroCatalog.filter((hero) => state.selectedHeroIds.includes(hero.id));
      const enemies = (state.game?.currentRoom === 10 ? bossCatalog : monsterCatalog).filter(
        (enemy) => state.selectedMonsterIds.includes(enemy.id),
      );
      const combatants = [...heroes, ...enemies]
        .sort((a, b) => b.initiative - a.initiative)
        .map((unit) => ({
          id: unit.id,
          name: unit.name,
          type: unit.type,
          hp: unit.type === "hero" ? (state.game?.heroProgress[unit.id]?.hp ?? unit.hp) : unit.hp,
          maxHp: unit.maxHp,
          ac: unit.ac,
          baseAc: unit.ac,
          initiative: unit.initiative,
          statuses: [],
          ...(unit.type === "hero" ? { className: unit.className, race: unit.race } : {}),
        }));
      return {
        ...state,
        ui: { ...state.ui, screen: "battle" },
        game: state.game
          ? { ...state.game, phase: "battle", monsters: enemies, combatants }
          : state.game,
        combatants,
      };
    }
    case "SKIP_ROOM":
      return advanceRoom(state, "treasure");
    case "REQUEST_SKIP_ROOM":
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmation: {
            title: "Sala vencida",
            message: "Os heróis vão avançar sem lutar. A sala atual será marcada como concluída.",
            confirmText: "Avançar",
            cancelText: "Cancelar",
            confirmAction: "CONFIRM_SKIP_ROOM",
          },
        },
      };
    case "CONFIRM_SKIP_ROOM":
      return advanceRoom({ ...state, ui: { ...state.ui, confirmation: null } }, "treasure");
    case "SELECT_COMBATANT": {
      const combatant = state.combatants.find((entry) => entry.id === action.combatantId);
      if (!combatant) return state;
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedId: action.combatantId,
          modalDraft: {
            id: combatant.id,
            hp: combatant.hp,
            ac: combatant.ac,
            statuses: [...combatant.statuses],
          },
        },
      };
    }
    case "CLOSE_COMBATANT":
      return { ...state, ui: { ...state.ui, selectedId: null, modalDraft: null } };
    case "ADJUST_HP":
      return updateModalDraft(state, (draft, combatant) => ({
        ...draft,
        hp: clamp(draft.hp + action.delta, 0, combatant.maxHp),
      }));
    case "SET_HP":
      return updateModalDraft(state, (draft, combatant) => ({
        ...draft,
        hp: clamp(action.value, 0, combatant.maxHp),
      }));
    case "ADJUST_AC":
      return updateModalDraft(state, (draft) => ({ ...draft, ac: draft.ac + action.delta }));
    case "SET_AC":
      return updateModalDraft(state, (draft) => ({ ...draft, ac: action.value }));
    case "TOGGLE_STATUS":
      return updateModalDraft(state, (draft) => ({
        ...draft,
        statuses: draft.statuses.includes(action.status)
          ? draft.statuses.filter((status) => status !== action.status)
          : [...draft.statuses, action.status],
      }));
    case "CONFIRM_COMBATANT":
      return commitModalDraft(state);
    case "ADVANCE_ROOM":
      return {
        ...state,
        ui: { ...state.ui, screen: "room-preparation", selectedId: null },
        selectedMonsterIds: [],
        combatants: [],
        game: state.game
          ? {
              ...state.game,
              phase: "room-preparation",
              currentRoom: Math.min(state.game.currentRoom + 1, 10),
              completedRooms: [...state.game.completedRooms, state.game.currentRoom],
              roomOutcomes: { ...state.game.roomOutcomes, [state.game.currentRoom]: "battle" },
            }
          : state.game,
      };
    case "END_DUNGEON":
      return {
        ...state,
        ui: { ...state.ui, screen: "home", selectedId: null },
        game: null,
        selectedHeroIds: [],
        selectedMonsterIds: [],
        combatants: [],
      };
    case "REQUEST_END_DUNGEON":
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmation: {
            title: "Encerrar Dungeon",
            message:
              "Tem certeza que deseja encerrar esta dungeon? O progresso atual será perdido.",
            confirmText: "Encerrar",
            cancelText: "Continuar",
            confirmAction: "CONFIRM_END_DUNGEON",
          },
        },
      };
    case "CANCEL_CONFIRMATION":
      return { ...state, ui: { ...state.ui, confirmation: null } };
    case "CONFIRM_END_DUNGEON":
      return {
        ...state,
        ui: { ...state.ui, confirmation: null, screen: "home" },
        game: null,
        selectedHeroIds: [],
        selectedMonsterIds: [],
        combatants: [],
      };
    case "BACK_TO_HOME":
      return { ...state, ui: { ...state.ui, screen: "home" }, game: null };
    case "BACK_TO_LOBBY":
      return { ...state, ui: { ...state.ui, screen: "lobby" } };
    default:
      return state;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function updateModalDraft(
  state: AppState,
  update: (
    draft: NonNullable<AppState["ui"]["modalDraft"]>,
    combatant: AppState["combatants"][number],
  ) => NonNullable<AppState["ui"]["modalDraft"]>,
): AppState {
  const draft = state.ui.modalDraft;
  const combatant = state.combatants.find((entry) => entry.id === state.ui.selectedId);
  if (!draft || !combatant) return state;
  return { ...state, ui: { ...state.ui, modalDraft: update(draft, combatant) } };
}

function commitModalDraft(state: AppState): AppState {
  const draft = state.ui.modalDraft;
  if (!draft) return state;
  const combatants = state.combatants.map((combatant) =>
    combatant.id === draft.id
      ? { ...combatant, hp: draft.hp, ac: draft.ac, statuses: draft.statuses }
      : combatant,
  );
  const heroProgress = { ...(state.game?.heroProgress ?? {}) };
  const hero = combatants.find(
    (combatant) => combatant.id === draft.id && combatant.type === "hero",
  );
  if (hero) heroProgress[hero.id] = { hp: hero.hp, maxHp: hero.maxHp, statuses: hero.statuses };
  const heroesAlive = combatants.some((combatant) => combatant.type === "hero" && combatant.hp > 0);
  const enemiesAlive = combatants.some(
    (combatant) => combatant.type !== "hero" && combatant.hp > 0,
  );
  const phase = !heroesAlive
    ? "defeat"
    : !enemiesAlive && state.game?.currentRoom === 10
      ? "victory"
      : state.ui.screen;
  return {
    ...state,
    combatants,
    ui: { ...state.ui, selectedId: null, modalDraft: null, screen: phase },
    game: state.game
      ? {
          ...state.game,
          combatants,
          heroProgress,
          phase: phase === "victory" || phase === "defeat" ? phase : state.game.phase,
        }
      : state.game,
  };
}

function advanceRoom(state: AppState, outcome: "battle" | "treasure"): AppState {
  if (!state.game) return state;
  const room = state.game.currentRoom;
  return {
    ...state,
    ui: { ...state.ui, screen: "room-preparation" },
    selectedMonsterIds: [],
    combatants: [],
    game: {
      ...state.game,
      phase: "room-preparation",
      currentRoom: Math.min(room + 1, 10),
      completedRooms: [...state.game.completedRooms, room],
      roomOutcomes: { ...state.game.roomOutcomes, [room]: outcome },
    },
  };
}
