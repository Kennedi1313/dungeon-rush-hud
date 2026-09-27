import type { AppState, StatusName } from "../../domain/types";
import { Button } from "../../components/ui/Button";
import { CombatantCard } from "./CombatantCard";
import { CombatantModal } from "./CombatantModal";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";
import { CardViewer, cardNames } from "../cards/CardViewer";

type Props = {
  state: AppState;
  onSelect: (id: string) => void;
  onClose: () => void;
  onAdjustHp: (delta: number) => void;
  onAdjustAc: (delta: number) => void;
  onToggleStatus: (status: StatusName) => void;
  onConfirm: () => void;
  onAdvanceRoom: () => void;
  onRequestEndDungeon: () => void;
  onCancelConfirmation: () => void;
  onConfirmEndDungeon: () => void;
};

export function BattleScreen({
  state,
  onSelect,
  onClose,
  onAdjustHp,
  onAdjustAc,
  onToggleStatus,
  onConfirm,
  onAdvanceRoom,
  onRequestEndDungeon,
  onCancelConfirmation,
  onConfirmEndDungeon,
}: Props) {
  const [viewedCard, setViewedCard] = useState<string | null>(null);
  const selected = state.combatants.find((combatant) => combatant.id === state.ui.selectedId);
  const editableSelected =
    selected && state.ui.modalDraft ? { ...selected, ...state.ui.modalDraft } : selected;
  const roomCleared = !state.combatants.some(
    (combatant) => combatant.type !== "hero" && combatant.hp > 0,
  );

  return (
    <main className="app-shell">
      <section className="screen battle-screen">
        <DungeonProgress
          currentRoom={state.game?.currentRoom ?? 1}
          completedRooms={state.game?.completedRooms ?? []}
          roomOutcomes={state.game?.roomOutcomes ?? {}}
        />
        {roomCleared && <div className="battle-status success">Sala finalizada</div>}
        <div className="combat-list">
          {state.combatants.map((combatant, index) => (
            <CombatantCard
              combatant={combatant}
              position={index + 1}
              key={combatant.id}
              onSelect={onSelect}
              onViewCard={(name) => setViewedCard(cardNames.includes(name) ? name : null)}
            />
          ))}
        </div>
        <div className="action-stack compact-actions battle-actions">
          <Button variant="secondary" onClick={onRequestEndDungeon}>
            Encerrar Dungeon
          </Button>
          {roomCleared && <Button onClick={onAdvanceRoom}>Encerrar Sala</Button>}
        </div>
        {editableSelected && (
          <CombatantModal
            combatant={editableSelected}
            onClose={onClose}
            onAdjustHp={onAdjustHp}
            onAdjustAc={onAdjustAc}
            onToggleStatus={onToggleStatus}
            onConfirm={onConfirm}
          />
        )}
        {state.ui.confirmation && (
          <ConfirmationDialog
            title={state.ui.confirmation.title}
            message={state.ui.confirmation.message}
            cancelText={state.ui.confirmation.cancelText}
            confirmText={state.ui.confirmation.confirmText}
            onCancel={onCancelConfirmation}
            onConfirm={onConfirmEndDungeon}
          />
        )}
        {viewedCard && <CardViewer cardName={viewedCard} onClose={() => setViewedCard(null)} />}
      </section>
    </main>
  );
}

function DungeonProgress({
  currentRoom,
  completedRooms,
  roomOutcomes,
}: {
  currentRoom: number;
  completedRooms: number[];
  roomOutcomes: Record<number, "battle" | "treasure">;
}) {
  return (
    <div className="dungeon-progress panel">
      <div className="dungeon-progress-head">Mapa da dungeon</div>
      <div className="dungeon-progress-track">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            className={`dungeon-node ${completedRooms.includes(index + 1) ? "is-complete" : ""} ${
              roomOutcomes[index + 1] ? `is-${roomOutcomes[index + 1]}` : ""
            } ${index + 1 === currentRoom ? "is-current" : ""}`}
            key={index}
          >
            {completedRooms.includes(index + 1) ? (
              <span className="room-cleared-glyph" aria-label="Sala concluída">
                ◆
              </span>
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
