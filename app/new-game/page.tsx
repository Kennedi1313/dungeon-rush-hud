"use client";

import { useRouter } from "next/navigation";
import { LobbyScreen } from "../../src/features/lobby/LobbyScreen";
import { useGame } from "../../src/game/GameProvider";

export default function NewGamePage() {
  const router = useRouter();
  const { state, dispatch } = useGame();

  return (
    <LobbyScreen
      state={state}
      onCancel={() => {
        dispatch({ type: "BACK_TO_HOME" });
        router.push("/");
      }}
      onSelectHeroes={() => {
        dispatch({ type: "OPEN_HERO_SELECTION" });
        router.push("/new-game/heroes");
      }}
      onStartDungeon={() => {
        dispatch({ type: "START_DUNGEON" });
        router.push("/new-game/room");
      }}
    />
  );
}
