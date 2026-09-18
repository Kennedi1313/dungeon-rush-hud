import type { AppState } from "../../domain/types";
import { heroCatalog } from "../../data";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/layout/PageHeader";
import { MAX_HEROES } from "../../game/reducer";

type HeroSelectionScreenProps = {
  state: AppState;
  onBack: () => void;
  onToggleHero: (heroId: string) => void;
  onConfirm: () => void;
};

export function HeroSelectionScreen({
  state,
  onBack,
  onToggleHero,
  onConfirm,
}: HeroSelectionScreenProps) {
  const selectionLimitReached = state.selectedHeroIds.length >= MAX_HEROES;

  return (
    <main className="app-shell">
      <section className="screen selection-screen panel">
        <PageHeader
          eyebrow="Aventura"
          title="Seleção de Heróis"
          description={`${state.selectedHeroIds.length}/${MAX_HEROES} heróis selecionados`}
        />

        <div className="selection-grid">
          {heroCatalog.map((hero) => {
            const isSelected = state.selectedHeroIds.includes(hero.id);
            const isDisabled = selectionLimitReached && !isSelected;

            return (
              <button
                className={`select-card hero-card ${isSelected ? "selected" : ""} ${isDisabled ? "is-disabled" : ""}`}
                disabled={isDisabled}
                key={hero.id}
                onClick={() => onToggleHero(hero.id)}
                type="button"
              >
                <div className="card-topline">
                  <h3>{hero.name}</h3>
                  <span className="card-symbol">✦</span>
                </div>
                <p className="class-line">
                  {hero.race} / {hero.className}
                </p>
                <div className="mini-stats">
                  <span>PV {hero.hp}</span>
                  <span>CA {hero.ac}</span>
                  <span>INI {hero.initiative}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="action-stack compact-actions">
          <Button variant="secondary" onClick={onBack}>
            Voltar
          </Button>
          <Button disabled={state.selectedHeroIds.length === 0} onClick={onConfirm}>
            Confirmar Heróis
          </Button>
        </div>
      </section>
    </main>
  );
}
