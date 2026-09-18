import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "../src/game/GameProvider";

export const metadata: Metadata = {
  title: "Dungeon Rush Companion",
  description: "HUD de combate e acompanhamento de partidas de Dungeon Rush.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
