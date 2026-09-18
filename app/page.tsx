"use client";

import { useRouter } from "next/navigation";
import { useGame } from "../src/game/GameProvider";
import { HomeScreen } from "../src/features/home/HomeScreen";

export default function HomePage() {
  const router = useRouter();
  const { dispatch } = useGame();
  return (
    <HomeScreen
      onNewGame={() => {
        dispatch({ type: "NEW_GAME" });
        router.push("/new-game");
      }}
      onOpenCards={() => router.push("/cards")}
      onOpenManual={() => router.push("/manual")}
    />
  );
}
