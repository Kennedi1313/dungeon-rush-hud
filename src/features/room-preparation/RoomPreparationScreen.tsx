import type { AppState } from "../../domain/types";
import { monsterCatalog } from "../../data";
import { bossCatalog } from "../../data";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  state: AppState;
  onToggleMonster: (monsterId: string) => void;
  onStartCombat: () => void;
  onSkipRoom: () => void;
  onCancelConfirmation: () => void;
  onConfirmSkipRoom: () => void;
};

export function RoomPreparationScreen({
  state,
  onToggleMonster,
  onStartCombat,
  onSkipRoom,
  onCancelConfirmation,
  onConfirmSkipRoom,
}: Props) {
  const selectedCount = state.selectedMonsterIds.length;
  const isBossRoom = state.game?.currentRoom === 10;
  const enemies = isBossRoom ? bossCatalog : monsterCatalog;
  return (
    <>
      <main className="app-shell">
        <section className="screen room-screen panel">
          <PageHeader
            eyebrow="Dungeon Rush"
            title={`Preparação da Sala ${state.game?.currentRoom ?? 1}`}
          />
          <div className="room-section">
            <div className="room-section-label">Heróis</div>
            <div className="roster-list">
              {state.game?.heroes.map((hero) => {
                const progress = state.game?.heroProgress[hero.id];
                return (
                  <div className="roster-entry hero-entry" key={hero.id}>
                    <span>{hero.name}</span>
                    <small>
                      {hero.className} · PV {progress?.hp ?? hero.hp}/
                      {progress?.maxHp ?? hero.maxHp}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="room-section">
            <div className="room-section-label">{isBossRoom ? "Boss" : "Ameaça"}</div>
            <div className="threat-summary">
              <span className="threat-label">
                {isBossRoom ? "Boss selecionado" : `Monstros selecionados (${selectedCount}/3)`}
              </span>
              <strong className="threat-value">
                {enemies
                  .filter((enemy) => state.selectedMonsterIds.includes(enemy.id))
                  .reduce((total, enemy) => total + (enemy.threat ?? 0), 0)}
              </strong>
            </div>
          </div>
          <div className="selection-grid">
            {enemies.map((monster) => {
              const selected = state.selectedMonsterIds.includes(monster.id);
              const disabled = selectedCount >= (isBossRoom ? 1 : 3) && !selected;
              return (
                <button
                  className={`select-card ${isBossRoom ? "boss-card" : "monster-card"} ${selected ? "selected" : ""} ${disabled ? "is-disabled" : ""}`}
                  disabled={disabled}
                  key={monster.id}
                  onClick={() => onToggleMonster(monster.id)}
                  type="button"
                >
                  <div className="card-topline">
                    <h3>{monster.name}</h3>
                  </div>
                  <div className="mini-stats">
                    <span>PV {monster.hp}</span>
                    <span>CA {monster.ac}</span>
                    <span>INI {monster.initiative}</span>
                    <span>{isBossRoom ? "Boss" : `Ameaça ${monster.threat}`}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="action-stack compact-actions">
            {!isBossRoom && (
              <Button variant="secondary" onClick={onSkipRoom}>
                Pular Sala
              </Button>
            )}
            <Button disabled={selectedCount === 0} onClick={onStartCombat}>
              Iniciar Combate
            </Button>
          </div>
        </section>
      </main>
      {state.ui.confirmation && (
        <div className="dialog-backdrop" onClick={onCancelConfirmation} role="presentation">
          <section className="character-panel panel" onClick={(event) => event.stopPropagation()}>
            <div className="character-panel-header">
              <h3 className="character-panel-title">{state.ui.confirmation.title}</h3>
              <button className="close-button" onClick={onCancelConfirmation} type="button">
                ×
              </button>
            </div>
            <p className="outcome-message" style={{ marginTop: 0, textAlign: "left" }}>
              {state.ui.confirmation.message}
            </p>
            <div className="modal-actions">
              <Button variant="secondary" onClick={onCancelConfirmation}>
                {state.ui.confirmation.cancelText}
              </Button>
              <Button onClick={onConfirmSkipRoom}>{state.ui.confirmation.confirmText}</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
