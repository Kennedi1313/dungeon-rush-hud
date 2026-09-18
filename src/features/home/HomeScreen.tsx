import { Button } from "../../components/ui/Button";

type HomeScreenProps = {
  onNewGame: () => void;
  onOpenCards: () => void;
  onOpenManual: () => void;
};

export function HomeScreen({ onNewGame, onOpenCards, onOpenManual }: HomeScreenProps) {
  return (
    <main className="app-shell">
      <section className="screen home-screen">
        <div className="title-block panel">
          <h1 className="logo">Dungeon Rush</h1>
          <p className="subtitle">HUD</p>
          <div className="home-actions">
            <Button onClick={onNewGame}>Novo Jogo</Button>
            <Button variant="secondary" onClick={onOpenCards}>
              Cartas
            </Button>
            <Button variant="secondary" onClick={onOpenManual}>
              Manual
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
