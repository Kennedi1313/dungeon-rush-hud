export type CombatantType = "hero" | "monster" | "boss";

export type GamePhase =
  "lobby" | "hero-selection" | "room-preparation" | "battle" | "victory" | "defeat";

export type RoomOutcome = "battle" | "treasure";

export type StatusName = "Atordoado" | "Restrito" | "Amedrontado" | "Inspiração";

export type CatalogEntry = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initiative: number;
  type: CombatantType | "item";
};

export type Hero = CatalogEntry & {
  type: "hero";
  className: string;
  race: string;
  bonus: string;
};

export type Enemy = CatalogEntry & {
  type: "monster" | "boss";
  threat?: number;
  damage?: string;
  ability?: string;
  bonus?: string;
};

export type Reward = {
  id: string;
  name: string;
  type: "item";
  category: "recompensa";
  effect: string;
};

export type Combatant = {
  id: string;
  name: string;
  type: CombatantType;
  className?: string;
  race?: string;
  hp: number;
  maxHp: number;
  ac: number;
  baseAc: number;
  initiative: number;
  statuses: StatusName[];
  selectionOrder?: number;
};

export type GameEvent = {
  type: string;
  room: number;
  createdAt: string;
  payload?: Record<string, unknown>;
};

export type GameState = {
  dungeonName: string;
  phase: GamePhase;
  currentRoom: number;
  heroes: Hero[];
  monsters: Enemy[];
  combatants: Combatant[];
  completedRooms: number[];
  roomOutcomes: Record<number, RoomOutcome>;
  heroProgress: Record<string, { hp: number; maxHp: number; statuses: StatusName[] }>;
  history: GameEvent[];
};

export type UiState = {
  screen: GamePhase | "home" | "cards";
  selectedId: string | null;
  modalDraft: { id: string; hp: number; ac: number; statuses: StatusName[] } | null;
  confirmation: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmAction: string;
  } | null;
};

export type AppState = {
  ui: UiState;
  game: GameState | null;
  selectedHeroIds: string[];
  selectedMonsterIds: string[];
  completedRooms: number[];
  combatants: Combatant[];
};
