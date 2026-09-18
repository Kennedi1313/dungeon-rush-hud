import { heroCatalog } from "../../data";
import type { AppState } from "../../domain/types";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/layout/PageHeader";

type LobbyScreenProps = {
  state: AppState;
  onCancel: () => void;
  onSelectHeroes: () => void;
  onStartDungeon: () => void;
};

export function LobbyScreen({ state, onCancel, onSelectHeroes, onStartDungeon }: LobbyScreenProps) {
  const selectedHeroes = heroCatalog.filter((hero) => state.selectedHeroIds.includes(hero.id));

  return (
    <main className="app-shell">
      <section className="screen lobby-screen panel">
        <PageHeader
          eyebrow="Dungeon Rush"
          title="Novo Jogo"
          action={
            <Button variant="secondary" className="compact-header-button" onClick={onCancel}>
              Cancelar
            </Button>
          }
        />

        <section className="lobby-summary lobby-hero-summary">
          <div className="summary-header">
            <span>Heróis</span>
          </div>
          <div className="roster-list compact-roster">
            {selectedHeroes.length > 0 ? (
              selectedHeroes.map((hero) => (
                <div className="roster-entry hero-entry" key={hero.id}>
                  <span>{hero.name}</span>
                  <small>{hero.className}</small>
                </div>
              ))
            ) : (
              <div className="roster-empty">Nenhum herói selecionado</div>
            )}
          </div>
        </section>

        <div className="action-stack">
          <Button onClick={onSelectHeroes}>Selecionar Heróis</Button>
          <Button
            variant="hero-start"
            disabled={selectedHeroes.length === 0}
            onClick={onStartDungeon}
          >
            Iniciar Dungeon
          </Button>
        </div>
      </section>
    </main>
  );
}
