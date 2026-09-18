import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/domain/initial-state";
import { gameReducer } from "../src/game/reducer";

function stateWithHeroes() {
  let state = createInitialState();
  state = gameReducer(state, { type: "NEW_GAME" });
  state = gameReducer(state, { type: "TOGGLE_HERO", heroId: "eldrin" });
  state = gameReducer(state, { type: "TOGGLE_HERO", heroId: "nyssa" });
  state = gameReducer(state, { type: "TOGGLE_HERO", heroId: "brok" });
  return state;
}

describe("gameReducer", () => {
  it("limits hero selection to three heroes", () => {
    let state = stateWithHeroes();
    state = gameReducer(state, { type: "TOGGLE_HERO", heroId: "atlas" });
    expect(state.selectedHeroIds).toHaveLength(3);
  });

  it("keeps combatant edits in a draft until confirmation", () => {
    let state = stateWithHeroes();
    state = gameReducer(state, { type: "START_DUNGEON" });
    state = gameReducer(state, { type: "TOGGLE_MONSTER", monsterId: "goblin" });
    state = gameReducer(state, { type: "START_COMBAT" });
    state = gameReducer(state, { type: "SELECT_COMBATANT", combatantId: "eldrin" });
    state = gameReducer(state, { type: "ADJUST_HP", delta: -5 });

    expect(state.combatants.find((unit) => unit.id === "eldrin")?.hp).toBe(25);
    expect(state.ui.modalDraft?.hp).toBe(20);

    state = gameReducer(state, { type: "CONFIRM_COMBATANT" });
    expect(state.combatants.find((unit) => unit.id === "eldrin")?.hp).toBe(20);
    expect(state.game?.heroProgress.eldrin.hp).toBe(20);
  });

  it("marks a skipped room as treasure and advances", () => {
    let state = stateWithHeroes();
    state = gameReducer(state, { type: "START_DUNGEON" });
    state = gameReducer(state, { type: "CONFIRM_SKIP_ROOM" });

    expect(state.game?.currentRoom).toBe(2);
    expect(state.game?.completedRooms).toEqual([1]);
    expect(state.game?.roomOutcomes[1]).toBe("treasure");
  });

  it("allows only one boss in room ten", () => {
    let state = stateWithHeroes();
    state = gameReducer(state, { type: "START_DUNGEON" });
    state = { ...state, game: { ...state.game!, currentRoom: 10 } };
    state = gameReducer(state, { type: "TOGGLE_MONSTER", monsterId: "illithid" });
    state = gameReducer(state, { type: "TOGGLE_MONSTER", monsterId: "balor" });

    expect(state.selectedMonsterIds).toEqual(["illithid"]);
  });
});
