import "./style.css";

import { Game } from "./core/Game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="gameCanvas"></canvas>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas");

if (!canvas) {
  throw new Error("Canvas não encontrado");
}

const game = new Game(canvas);

game.start();
