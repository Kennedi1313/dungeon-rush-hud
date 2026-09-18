import type { Reward } from "../domain/types";

export const rewardCatalog: Reward[] = [
  {
    id: "pocao-cura",
    name: "Poção de Cura",
    type: "item",
    category: "recompensa",
    effect: "Cura em 2d8 PV todos os heróis desta sala.",
  },
  {
    id: "pocao-mana",
    name: "Poção de Mana",
    type: "item",
    category: "recompensa",
    effect: "Durante esta sala, os heróis não possuem limite de uso das habilidades.",
  },
  {
    id: "sorte-liquida",
    name: "Sorte Líquida",
    type: "item",
    category: "recompensa",
    effect: "Concede Inspiração a todos os jogadores durante esta sala.",
  },
  {
    id: "forca-de-vontade",
    name: "Força de Vontade",
    type: "item",
    category: "recompensa",
    effect: "Heróis não podem ficar abaixo de 1 PV durante esta sala.",
  },
];
