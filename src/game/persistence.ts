import type { AppState } from "../domain/types";

export const STORAGE_KEY = "dungeon-rush-state-v2";

export function readPersistedState(storage: Storage): AppState | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isAppState(value) ? value : null;
  } catch {
    return null;
  }
}

export function writePersistedState(storage: Storage, state: AppState) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AppState>;
  return Boolean(
    candidate.ui &&
    typeof candidate.ui === "object" &&
    Array.isArray(candidate.selectedHeroIds) &&
    Array.isArray(candidate.selectedMonsterIds) &&
    Array.isArray(candidate.combatants),
  );
}
