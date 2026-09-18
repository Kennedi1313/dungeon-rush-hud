"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export default function ManualPage() {
  return (
    <main className="manual-page">
      <article className="page-shell">
        <header className="header-banner">
          <Link className="secondary-button compact-header-button manual-back-link" href="/">
            Voltar ao menu
          </Link>
          <h1>Dungeon Rush</h1>
          <p>Manual de Regras</p>
        </header>
        <div className="manual-body">
          <div className="intro">
            <span className="dropcap">D</span>ungeon Rush é um jogo cooperativo de combate tático em
            masmorras para grupos de até 3 heróis contra 1 Mestre da Dungeon. Os jogadores precisam
            sobreviver a 10 salas para vencer; o Mestre vence se todos os heróis morrerem.
          </div>
          <div className="columns">
            <div>
              <Section title="1. Estrutura da Masmorra">
                <p>A jornada é linear e dividida em 10 salas:</p>
                <ul>
                  <li>
                    <strong>Salas 1 a 5:</strong> heróis no nível 1.
                  </li>
                  <li>
                    <strong>Após a Sala 5:</strong> todos sobem para o Nível 2.
                  </li>
                  <li>
                    <strong>Salas 6 a 9:</strong> dungeon avançada.
                  </li>
                  <li>
                    <strong>Sala 10:</strong> batalha final contra o Boss.
                  </li>
                </ul>
              </Section>
              <Section title="2. O Teste de Sorte">
                <p>
                  Antes de cada sala, exceto a Sala 10, um herói rola 1d20. O resultado define o
                  orçamento de ameaça ou uma sala segura.
                </p>
                <LuckTable
                  title="Salas 1 a 5 (Início)"
                  values={[
                    "Pacto de Sangue: herói morre imediatamente.",
                    "15 Pontos de Ameaça.",
                    "10 Pontos de Ameaça.",
                    "7 Pontos de Ameaça.",
                    "Baú: comprar 1 carta de Poção.",
                    "Bênção: reviver com 5 PV ou receber 2 Poções.",
                  ]}
                />
                <LuckTable
                  title="Salas 6 a 9 (Avançada)"
                  values={[
                    "Pacto de Sangue: herói morre imediatamente.",
                    "20 Pontos de Ameaça.",
                    "15 Pontos de Ameaça.",
                    "10 Pontos de Ameaça.",
                    "Baú: comprar 1 carta de Poção.",
                    "Bênção: reviver com 5 PV ou receber 2 Poções.",
                  ]}
                />
                <div className="note-box">
                  <strong>Nota:</strong> o Deck de Poções tem cartas únicas. Na 5ª vez que sair Baú,
                  ele estará vazio.
                </div>
              </Section>
              <Section title="3. Regras do Mestre">
                <p>O Mestre usa Pontos de Ameaça para comprar monstros:</p>
                <ul>
                  <li>No máximo 3 monstros por sala.</li>
                  <li>Na Sala 10, o limite é de 1 Boss.</li>
                  <li>Não pode repetir monstro na mesma sala.</li>
                  <li>A ameaça total não pode ultrapassar o orçamento.</li>
                </ul>
              </Section>
              <Section title="4. O Sistema de Combate">
                <p>Todos os monstros devem ser derrotados para avançar:</p>
                <ol>
                  <li>Ordene por iniciativa; em empate, heróis agem primeiro.</li>
                  <li>Aplique efeitos de início da sala.</li>
                  <li>Cada participante joga em seu turno.</li>
                </ol>
              </Section>
            </div>
            <div>
              <Section title="Economia do Turno">
                <ul>
                  <li>
                    <strong>1 Ação Normal:</strong> ataque básico ou habilidade.
                  </li>
                  <li>
                    <strong>1 Ação Bônus:</strong> limite de 1 por turno.
                  </li>
                  <li>
                    <strong>1 Reação:</strong> limite de 1 por rodada.
                  </li>
                </ul>
              </Section>
              <Section title="5. Ataques e Acertos">
                <p>
                  Não há distância. Role 1d20; se dado + bônus ≥ CA, acerta. Role o dado de dano
                  indicado + bônus. Com Vantagem/Desvantagem, role 2d20 e use o maior/menor
                  resultado.
                </p>
                <p>
                  <strong>Regra de alvo:</strong> o Mestre deve declarar o alvo antes de rolar.
                </p>
              </Section>
              <Section title="6. Recompensas (Poções)">
                <ul>
                  <li>Usar uma poção consome a Ação Normal.</li>
                  <li>Poções não podem ser usadas na Sala 10.</li>
                </ul>
              </Section>
              <Section title="7. Estados de Status">
                <ul>
                  <li>
                    <strong>Atordoado:</strong> não age; ataques contra ele têm Vantagem.
                  </li>
                  <li>
                    <strong>Restrito:</strong> ataques contra ele têm Vantagem.
                  </li>
                  <li>
                    <strong>Amedrontado:</strong> ataques realizados por ele têm Desvantagem.
                  </li>
                  <li>
                    <strong>Inspiração:</strong> recebe Vantagem em seus ataques.
                  </li>
                </ul>
              </Section>
              <Section title="8. Morte e Vitória">
                <ul>
                  <li>Com 0 PV, o herói é removido, salvo por carta.</li>
                  <li>O Mestre vence quando todos os heróis morrem.</li>
                  <li>Os heróis vencem ao derrotar o Boss da Sala 10.</li>
                </ul>
              </Section>
              <div className="note-box">
                <strong>Limite:</strong> a formação normal é de 3 jogadores e 3 heróis. Para 2
                jogadores, use o Modo Duo; para 1, use o Modo Solo.
              </div>
            </div>
          </div>
          <section className="variant-section">
            <h2>Variantes de Jogo (Modo Extra)</h2>
            <div className="variant-columns">
              <Variant title="Modo Duo (2 Heróis)">
                <p>
                  +5 PV Máximos, 1 Poção de Cura adicional e −3 Pontos de Ameaça em qualquer Teste
                  de Sorte.
                </p>
              </Variant>
              <Variant title="Modo Solo (1 Herói)">
                <p>
                  +15 PV Máximos, +2 INI, +1 em acerto/dano, 2 Ações Normais por turno e −5 Pontos
                  de Ameaça.
                </p>
              </Variant>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="manual-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function Variant({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="variant-box">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
function LuckTable({ title, values }: { title: string; values: string[] }) {
  const ranges = ["1", "2 a 6", "7 a 12", "13 a 16", "17 a 19", "20"];
  return (
    <div className="table-container">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Dado</th>
            <th>Efeito na Sala</th>
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={ranges[index]}>
              <td>
                <strong>{ranges[index]}</strong>
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
