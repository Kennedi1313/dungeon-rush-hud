"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/Button";

const cards = [
  "Eldrin",
  "Cedric",
  "Nyssa",
  "Brok",
  "Theia",
  "Atlas",
  "Kaelthyr",
  "Lysenda",
  "Lysara",
  "Kai Tung",
  "Echo",
  "Thorgar",
  "Luthien",
  "Morghena",
  "Illithid",
  "Beholder",
  "Nightwalker",
  "Balor",
  "Rato Gigante",
  "Goblin",
  "Esqueleto",
  "Zumbi",
  "Lobo Terrível",
  "Orc",
  "Ogro",
  "Cavaleiro Negro",
  "Aberração do Esgoto",
  "Cultista Sombrio",
  "Aranha Gigante",
  "Gnoll Saqueador",
  "Sombra Errante",
  "Demônio Menor",
  "Besta Deslocadora",
  "Devorador de Intelecto",
  "Poção de Cura",
  "Poção de Mana",
  "Sorte Líquida",
  "Força de Vontade",
];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CardsScreen({ onBack }: { onBack: () => void }) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const cardIndex = selectedCard ? cards.indexOf(selectedCard) : -1;
  const cardFile = selectedCard ? `${basePath}/assets/${cardIndex + 1} - ${selectedCard}.png` : "";
  const stopClosing = (event: React.MouseEvent) => event.stopPropagation();
  return (
    <main className="app-shell cards-shell">
      <section className="screen cards-screen panel">
        <header className="page-header">
          <div>
            <p className="eyebrow">Dungeon Rush</p>
            <h2 className="page-title">Catálogo de Cartas</h2>
          </div>
          <div className="header-actions">
            <Button variant="secondary" className="compact-header-button" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </header>
        <div className="cards-grid">
          {cards.map((name, index) => (
            <button
              className="catalog-card"
              key={name}
              onClick={() => {
                setSelectedCard(name);
                setSide("front");
              }}
              type="button"
            >
              <Image
                src={`${basePath}/assets/${index + 1} - ${name}.png`}
                alt={name}
                width={1654}
                height={1181}
                loading="lazy"
                unoptimized
              />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </section>
      {selectedCard && (
        <div className="card-lightbox" onClick={() => setSelectedCard(null)} role="presentation">
          <button
            className="lightbox-close"
            onClick={(event) => {
              stopClosing(event);
              setSelectedCard(null);
            }}
            aria-label="Fechar carta"
            type="button"
          >
            ×
          </button>
          <button
            className="lightbox-arrow previous"
            onClick={(event) => {
              stopClosing(event);
              setSide("front");
            }}
            aria-label="Ver frente"
            type="button"
          >
            ‹
          </button>
          <div className="card-face-window" onClick={stopClosing}>
            <Image
              src={cardFile}
              alt={selectedCard}
              width={1654}
              height={1181}
              style={{ transform: side === "back" ? "translateX(-50.1%)" : "translateX(0)" }}
              unoptimized
            />
          </div>
          <button
            className="lightbox-arrow next"
            onClick={(event) => {
              stopClosing(event);
              setSide("back");
            }}
            aria-label="Ver verso"
            type="button"
          >
            ›
          </button>
          <span className="card-side-label">{side === "front" ? "Frente" : "Verso"}</span>
        </div>
      )}
    </main>
  );
}
