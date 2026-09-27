"use client";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import Image from "next/image";
import { CardViewer, basePath, cardNames } from "./CardViewer";

export function CardsScreen({ onBack }: { onBack: () => void }) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
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
          {cardNames.map((name, index) => (
            <button
              className="catalog-card"
              key={name}
              onClick={() => {
                setSelectedCard(name);
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
      {selectedCard && <CardViewer cardName={selectedCard} onClose={() => setSelectedCard(null)} />}
    </main>
  );
}
