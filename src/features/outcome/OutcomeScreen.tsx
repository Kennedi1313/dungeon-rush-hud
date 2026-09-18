import { Button } from "../../components/ui/Button";

type Props = { result: "victory" | "defeat"; onBackToHome: () => void };

export function OutcomeScreen({ result, onBackToHome }: Props) {
  const victory = result === "victory";
  return (
    <main className="app-shell">
      <section className="screen outcome-screen panel">
        <h1 className="outcome-title">{victory ? "Vitória" : "Derrota"}</h1>
        <p className="outcome-message">
          {victory
            ? "O boss foi derrotado. A dungeon foi concluída."
            : "Todos os heróis estão mortos."}
        </p>
        <div className="action-stack compact-actions">
          <Button onClick={onBackToHome}>Voltar ao menu</Button>
        </div>
      </section>
    </main>
  );
}
