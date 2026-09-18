import type { Combatant, StatusName } from "../../domain/types";
import { Button } from "../../components/ui/Button";

const statuses: StatusName[] = ["Atordoado", "Restrito", "Amedrontado", "Inspiração"];

type Props = {
  combatant: Combatant;
  onClose: () => void;
  onAdjustHp: (delta: number) => void;
  onAdjustAc: (delta: number) => void;
  onToggleStatus: (status: StatusName) => void;
  onConfirm: () => void;
};

export function CombatantModal({
  combatant,
  onClose,
  onAdjustHp,
  onAdjustAc,
  onToggleStatus,
  onConfirm,
}: Props) {
  return (
    <div className="dialog-backdrop" onClick={onClose} role="presentation">
      <section
        className="character-panel panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="character-panel-header">
          <h3 className="character-panel-title">{combatant.name}</h3>
          <button className="close-button" onClick={onClose} aria-label="Fechar detalhes">
            ×
          </button>
        </div>
        <div className="detail-grid">
          <Detail label="PV" value={`${combatant.hp} / ${combatant.maxHp}`} />
          <Detail label="CA original" value={`${combatant.baseAc}`} />
          <Detail label="INI" value={`${combatant.initiative}`} />
          <Detail
            label="Tipo"
            value={
              combatant.type === "hero" ? "Herói" : combatant.type === "boss" ? "Boss" : "Monstro"
            }
          />
        </div>
        <Editor label="Editar PV">
          <AdjustButton onClick={() => onAdjustHp(-1)} label="−" />
          <input className="hp-input" readOnly value={combatant.hp} />
          <AdjustButton onClick={() => onAdjustHp(1)} label="+" />
        </Editor>
        <Editor label="Editar CA">
          <AdjustButton onClick={() => onAdjustAc(-1)} label="−" />
          <input className="hp-input" readOnly value={combatant.ac} />
          <AdjustButton onClick={() => onAdjustAc(1)} label="+" />
        </Editor>
        <div>
          <span className="detail-label">Status</span>
          <div className="status-grid">
            {statuses.map((status) => (
              <button
                className={`status-toggle ${combatant.statuses.includes(status) ? "is-active" : ""}`}
                key={status}
                onClick={() => onToggleStatus(status)}
                type="button"
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </div>
      </section>
    </div>
  );
}

function AdjustButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="hp-adjust" onClick={onClick} type="button">
      {label}
    </button>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-cell">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}
function Editor({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hp-editor">
      <span className="detail-label">{label}</span>
      <div className="hp-editor-row">{children}</div>
    </div>
  );
}
