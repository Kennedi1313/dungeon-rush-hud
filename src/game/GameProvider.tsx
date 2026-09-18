"use client";

import { createContext, useContext, useEffect, useReducer, type PropsWithChildren } from "react";
import { createInitialState } from "../domain/initial-state";
import { gameReducer, type GameAction } from "./reducer";
import type { AppState } from "../domain/types";
import { readPersistedState, STORAGE_KEY, writePersistedState } from "./persistence";

type GameContextValue = {
  state: AppState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  useEffect(() => {
    const saved = readPersistedState(window.localStorage);
    if (saved) dispatch({ type: "HYDRATE", state: saved });
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);
  useEffect(() => {
    writePersistedState(window.localStorage, state);
  }, [state]);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame deve ser usado dentro de GameProvider");
  return context;
}
