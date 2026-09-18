import type { Combatant } from "../../domain/types";

type Props = {
  combatant: Combatant;
  position: number;
  onSelect: (id: string) => void;
};

export function CombatantCard({ combatant, position, onSelect }: Props) {
  const hpPercent = Math.max(0, Math.min(100, (combatant.hp / combatant.maxHp) * 100));
  const acClass =
    combatant.ac > combatant.baseAc
      ? "ac-buffed"
      : combatant.ac < combatant.baseAc
        ? "ac-debuffed"
        : "";

  return (
    <article
      className={`combatant-card ${combatant.type} ${acClass} ${combatant.hp <= 0 ? "is-defeated" : ""}`}
      onClick={() => onSelect(combatant.id)}
      role="button"
      tabIndex={0}
    >
      <div className="combatant-header">
        <div className="combatant-turn-div">
          <span className="combatant-turn-marker">{position}º</span>
        </div>
        <h3 className="combatant-name">{combatant.name}</h3>
        {combatant.type === "hero" ? (
          <span className="combatant-level">Nível 1</span>
        ) : (
          <span className="combatant-level-placeholder" />
        )}
      </div>
      {combatant.className && (
        <div className="combatant-subtitle">
          {combatant.race} / {combatant.className}
        </div>
      )}
      <div className="hp-bar" aria-label={`Vida de ${combatant.name}`}>
        <div
          className={`hp-fill ${hpPercent >= 70 ? "hp-high" : hpPercent >= 30 ? "hp-medium" : "hp-low"}`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>
      <div className="hp-text">
        <span>
          <strong className="hp-current">{combatant.hp}</strong>
          <span className="hp-max"> / {combatant.maxHp} PV</span>
        </span>
        <div className="combatant-meta-right">
          <span className={acClass}>CA {combatant.ac}</span>
          <span>INI {combatant.initiative}</span>
        </div>
      </div>
      <div className="status-list">
        {combatant.statuses.map((status) => (
          <span
            className={`status-pill ${status
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}`}
            key={status}
          >
            {status}
          </span>
        ))}
      </div>
    </article>
  );
}
