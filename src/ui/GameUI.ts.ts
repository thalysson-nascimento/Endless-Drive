export class GameUI {
  private readonly scoreElement: HTMLDivElement;
  private readonly gameOverElement: HTMLDivElement;
  private coinsElement: HTMLDivElement;

  constructor() {
    this.scoreElement = document.createElement("div");

    this.gameOverElement = document.createElement("div");

    this.handleCoinsUI();

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

  public handleCoinsUI() {
    this.coinsElement = document.createElement("div");

    this.coinsElement.style.position = "absolute";

    this.coinsElement.style.top = "50px";

    this.coinsElement.style.left = "20px";

    this.coinsElement.style.color = "yellow";

    this.coinsElement.style.fontSize = "24px";

    document.body.appendChild(this.coinsElement);
  }

  public updateScore(score: number): void {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  public updateCoins(coins: number): void {
    this.coinsElement.textContent = `Coins: ${coins}`;
  }

  public showGameOver(): void {
    this.gameOverElement.innerHTML = `
      GAME OVER
      <br>
      Pressione R para reiniciar
      `;

    this.gameOverElement.style.display = "block";
  }
}
