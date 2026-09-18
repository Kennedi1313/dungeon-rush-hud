"use client";

import { useRouter } from "next/navigation";
import { RoomPreparationScreen } from "../../../src/features/room-preparation/RoomPreparationScreen";
import { useGame } from "../../../src/game/GameProvider";

export default function RoomPreparationPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();

  return (
    <RoomPreparationScreen
      state={state}
      onToggleMonster={(monsterId) => dispatch({ type: "TOGGLE_MONSTER", monsterId })}
      onStartCombat={() => {
        dispatch({ type: "START_COMBAT" });
        router.push("/new-game/battle");
      }}
      onSkipRoom={() => dispatch({ type: "REQUEST_SKIP_ROOM" })}
      onCancelConfirmation={() => dispatch({ type: "CANCEL_CONFIRMATION" })}
      onConfirmSkipRoom={() => dispatch({ type: "CONFIRM_SKIP_ROOM" })}
    />
  );
}
