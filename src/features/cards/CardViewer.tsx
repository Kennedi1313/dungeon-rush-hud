"use client";

import Image from "next/image";
import { useState } from "react";

export const cardNames = [
  "Eldrin", "Cedric", "Nyssa", "Brok", "Theia", "Atlas", "Kaelthyr", "Lysenda", "Lysara",
  "Kai Tung", "Echo", "Thorgar", "Luthien", "Morghena", "Illithid", "Beholder", "Nightwalker",
  "Balor", "Rato Gigante", "Goblin", "Esqueleto", "Zumbi", "Lobo Terrível", "Orc", "Ogro",
  "Cavaleiro Negro", "Aberração do Esgoto", "Cultista Sombrio", "Aranha Gigante", "Gnoll Saqueador",
  "Sombra Errante", "Demônio Menor", "Besta Deslocadora", "Devorador de Intelecto", "Poção de Cura",
  "Poção de Mana", "Sorte Líquida", "Força de Vontade",
];

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CardViewer({ cardName, onClose }: { cardName: string; onClose: () => void }) {
  const [side, setSide] = useState<"front" | "back">("front");
  const cardIndex = cardNames.indexOf(cardName);
  if (cardIndex < 0) return null;
  const cardFile = `${basePath}/assets/${cardIndex + 1} - ${cardName}.png`;
  const stopClosing = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <div className="card-lightbox" onClick={onClose} role="presentation">
      <button className="lightbox-close" onClick={onClose} aria-label="Fechar carta" type="button">×</button>
      <button className="lightbox-arrow previous" onClick={(event) => { stopClosing(event); setSide("front"); }} aria-label="Ver frente" type="button">‹</button>
      <div className="card-face-window" onClick={stopClosing}>
        <Image src={cardFile} alt={cardName} width={1654} height={1181} style={{ transform: side === "back" ? "translateX(-50.1%)" : "translateX(0)" }} unoptimized />
      </div>
      <button className="lightbox-arrow next" onClick={(event) => { stopClosing(event); setSide("back"); }} aria-label="Ver verso" type="button">›</button>
      <span className="card-side-label">{side === "front" ? "Frente" : "Verso"}</span>
    </div>
  );
}
