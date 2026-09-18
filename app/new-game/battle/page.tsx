"use client";

import { useRouter } from "next/navigation";
import { BattleScreen } from "../../../src/features/battle/BattleScreen";
import { useGame } from "../../../src/game/GameProvider";
import { OutcomeScreen } from "../../../src/features/outcome/OutcomeScreen";

export default function BattlePage() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  if (state.ui.screen === "victory" || state.ui.screen === "defeat")
    return (
      <OutcomeScreen
        result={state.ui.screen}
        onBackToHome={() => {
          dispatch({ type: "END_DUNGEON" });
          router.push("/");
        }}
      />
    );
  return (
    <BattleScreen
      state={state}
      onSelect={(combatantId) => dispatch({ type: "SELECT_COMBATANT", combatantId })}
      onClose={() => dispatch({ type: "CLOSE_COMBATANT" })}
      onAdjustHp={(delta) => dispatch({ type: "ADJUST_HP", delta })}
      onAdjustAc={(delta) => dispatch({ type: "ADJUST_AC", delta })}
      onToggleStatus={(status) => dispatch({ type: "TOGGLE_STATUS", status })}
      onConfirm={() => dispatch({ type: "CONFIRM_COMBATANT" })}
      onAdvanceRoom={() => {
        dispatch({ type: "ADVANCE_ROOM" });
        router.push("/new-game/room");
      }}
      onRequestEndDungeon={() => dispatch({ type: "REQUEST_END_DUNGEON" })}
      onCancelConfirmation={() => dispatch({ type: "CANCEL_CONFIRMATION" })}
      onConfirmEndDungeon={() => {
        dispatch({ type: "CONFIRM_END_DUNGEON" });
        router.push("/");
      }}
    />
  );
}
