export class GameUI {
  private readonly scoreElement: HTMLDivElement;
  private readonly gameOverElement: HTMLDivElement;

  constructor() {
    this.scoreElement = document.createElement("div");

    this.gameOverElement = document.createElement("div");

    this.setup();
  }

  private setup(): void {
    this.scoreElement.style.position = "absolute";

    this.scoreElement.style.top = "20px";

    this.scoreElement.style.left = "20px";

    this.scoreElement.style.color = "white";

    this.scoreElement.style.fontSize = "24px";

    document.body.appendChild(this.scoreElement);

    this.gameOverElement.style.position = "absolute";

    this.gameOverElement.style.top = "50%";

    this.gameOverElement.style.left = "50%";

    this.gameOverElement.style.transform = "translate(-50%, -50%)";

    this.gameOverElement.style.color = "red";

    this.gameOverElement.style.fontSize = "48px";

    this.gameOverElement.style.display = "none";

    document.body.appendChild(this.gameOverElement);
  }

  updateScore(score: number): void {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  showGameOver(): void {
    this.gameOverElement.innerHTML = `
      GAME OVER
      <br>
      Pressione R para reiniciar
      `;

    this.gameOverElement.style.display = "block";
  }
}
