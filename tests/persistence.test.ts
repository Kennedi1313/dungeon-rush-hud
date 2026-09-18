import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/domain/initial-state";
import { readPersistedState, writePersistedState } from "../src/game/persistence";

function storageMock(): Storage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

describe("game persistence", () => {
  it("round-trips a valid app state", () => {
    const storage = storageMock();
    const state = createInitialState();
    writePersistedState(storage, state);
    expect(readPersistedState(storage)).toEqual(state);
  });

  it("rejects malformed persisted data", () => {
    const storage = storageMock();
    storage.setItem("dungeon-rush-state-v2", JSON.stringify({ invalid: true }));
    expect(readPersistedState(storage)).toBeNull();
  });
});
