"use client";

import { useRouter } from "next/navigation";
import { HeroSelectionScreen } from "../../../src/features/hero-selection/HeroSelectionScreen";
import { useGame } from "../../../src/game/GameProvider";

export default function HeroSelectionPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();

  return (
    <HeroSelectionScreen
      state={state}
      onBack={() => {
        dispatch({ type: "BACK_TO_LOBBY" });
        router.push("/new-game");
      }}
      onToggleHero={(heroId) => dispatch({ type: "TOGGLE_HERO", heroId })}
      onConfirm={() => {
        dispatch({ type: "CONFIRM_HEROES" });
        router.push("/new-game");
      }}
    />
  );
}
