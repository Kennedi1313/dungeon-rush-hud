# Dungeon Rush Companion

Um mini projeto que mistura hobby e estudo: um HUD web para acompanhar uma partida do meu jogo autoral, Dungeon Rush, desenvolvido como uma experiência de aventura inspirada em RPGs de mesa e em Dungeons & Dragons.

A ideia é transformar em interface digital parte das informações que normalmente ficam espalhadas pela mesa — heróis, monstros, salas, cartas, pontos de vida e estados de combate — sem tentar substituir o jogo físico.

Este repositório também funciona como um projeto de portfólio. O foco não é criar um produto comercial completo neste momento, mas demonstrar como estruturo uma aplicação React/Next.js com domínio próprio, fluxo de telas, estado previsível e componentes reutilizáveis.

## O que existe hoje

O protótipo reproduz o fluxo principal do HUD:

```text
Home → Lobby → Seleção de heróis → Preparação da sala → Batalha
```

O fluxo inclui:

- seleção de heróis e monstros;
- preparação de cada sala e salas especiais com chefes;
- ordem de iniciativa;
- edição de PV, CA e condições dos combatentes;
- confirmação antes de alterar estados importantes;
- avanço ou salto de salas;
- estados de vitória, derrota e encerramento da dungeon;
- catálogo de cartas com visualização frente/verso;
- manual do jogo;
- persistência do estado local no navegador.

## Intenção técnica

O projeto foi migrado de uma implementação baseada em arquivos HTML e JavaScript para uma aplicação Next.js com App Router. A migração preserva o comportamento e o visual do HUD original, enquanto organiza o código em camadas mais fáceis de evoluir.

Algumas decisões importantes:

- **Next.js App Router** para estruturar as rotas e separar as telas da aplicação;
- **React Providers** para disponibilizar o estado da partida às telas sem prop drilling;
- **Reducer centralizado** para representar as transições do jogo através de ações explícitas;
- **TypeScript** para modelar entidades como heróis, monstros, salas, cartas e combatentes;
- **estrutura orientada a features** para agrupar componentes por fluxo do produto;
- **componentes compartilhados** para elementos de interface recorrentes, como botões e cabeçalhos;
- **persistência validada** no `localStorage`, evitando confiar diretamente em dados serializados;
- **exportação estática** para manter o protótipo publicável no GitHub Pages.

O estado atual é deliberadamente local. A persistência no navegador é suficiente para o escopo deste protótipo e mantém o projeto simples de executar e publicar.

## Stack

- Next.js
- React
- TypeScript
- CSS
- Vitest
- ESLint
- Prettier

## Estrutura

```text
app/                         rotas do Next.js App Router
src/components/              componentes compartilhados
src/data/                     catálogos estáticos do jogo
src/domain/                   tipos e estado inicial do domínio
src/features/                telas organizadas por fluxo
src/game/                    provider, reducer e persistência
tests/                       testes de reducer e persistência
public/assets/               imagens usadas pelo HUD
```

## Executar localmente

```bash
npm install
npm run dev
```

Depois, abra [http://localhost:3000](http://localhost:3000).

## Verificação

```bash
npm run test
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## GitHub Pages

O projeto usa `output: "export"` e gera uma versão estática na pasta `out/`. O workflow em `.github/workflows/deploy-pages.yml` publica automaticamente essa versão no GitHub Pages.

O deploy estático é suficiente para o HUD local e sua persistência no navegador. O projeto foi mantido sem backend porque esse não é o objetivo desta versão.
