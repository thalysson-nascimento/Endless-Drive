export class GameUI {
  private coinsElement: HTMLDivElement;
  private highScoreElement: HTMLDivElement;
  private menuElement: HTMLDivElement;
  private scoreElement: HTMLDivElement;
  private gameOverElement: HTMLDivElement;

  constructor() {
    this.createScoreUI();
    this.createCoinsUI();
    this.createHighScoreUI();
    this.createMenuUI();
    this.createGameOverUI();

    this.setState("MENU");
  }

  // -------------------------
  // CREATE ELEMENTS
  // -------------------------

  private createScoreUI(): void {
    this.scoreElement = document.createElement("div");

    this.scoreElement.style.position = "absolute";
    this.scoreElement.style.top = "20px";
    this.scoreElement.style.left = "20px";
    this.scoreElement.style.color = "white";
    this.scoreElement.style.fontSize = "24px";

    document.body.appendChild(this.scoreElement);
  }

  private createCoinsUI(): void {
    this.coinsElement = document.createElement("div");

    this.coinsElement.style.position = "absolute";
    this.coinsElement.style.top = "50px";
    this.coinsElement.style.left = "20px";
    this.coinsElement.style.color = "yellow";
    this.coinsElement.style.fontSize = "24px";

    document.body.appendChild(this.coinsElement);
  }

  private createHighScoreUI(): void {
    this.highScoreElement = document.createElement("div");

    this.highScoreElement.style.position = "absolute";
    this.highScoreElement.style.top = "80px";
    this.highScoreElement.style.left = "20px";
    this.highScoreElement.style.color = "cyan";
    this.highScoreElement.style.fontSize = "24px";

    document.body.appendChild(this.highScoreElement);
  }

  private createMenuUI(): void {
    this.menuElement = document.createElement("div");

    this.menuElement.style.position = "absolute";
    this.menuElement.style.top = "50%";
    this.menuElement.style.left = "50%";
    this.menuElement.style.transform = "translate(-50%, -50%)";
    this.menuElement.style.color = "white";
    this.menuElement.style.fontSize = "40px";
    this.menuElement.style.textAlign = "center";

    this.menuElement.innerHTML = `
      <div>ENDLESS RACE</div>
      <button id="playBtn">PLAY</button>
    `;

    document.body.appendChild(this.menuElement);
  }

  private createGameOverUI(): void {
    this.gameOverElement = document.createElement("div");

    this.gameOverElement.style.position = "absolute";
    this.gameOverElement.style.top = "50%";
    this.gameOverElement.style.left = "50%";
    this.gameOverElement.style.transform = "translate(-50%, -50%)";
    this.gameOverElement.style.color = "red";
    this.gameOverElement.style.fontSize = "48px";
    this.gameOverElement.style.textAlign = "center";

    this.gameOverElement.style.display = "none";

    document.body.appendChild(this.gameOverElement);
  }

  // -------------------------
  // STATE CONTROL
  // -------------------------

  public setState(state: "MENU" | "PLAYING" | "GAME_OVER"): void {
    switch (state) {
      case "MENU":
        this.menuElement.style.display = "block";
        this.gameOverElement.style.display = "none";
        break;

      case "PLAYING":
        this.menuElement.style.display = "none";
        this.gameOverElement.style.display = "none";
        break;

      case "GAME_OVER":
        this.menuElement.style.display = "none";
        this.gameOverElement.style.display = "block";
        break;
    }
  }

  // -------------------------
  // UPDATES
  // -------------------------

  public updateScore(score: number): void {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  public updateCoins(coins: number): void {
    this.coinsElement.textContent = `Coins: ${coins}`;
  }

  public updateHighScore(score: number): void {
    this.highScoreElement.textContent = `High Score: ${score}`;
  }

  // -------------------------
  // MENU EVENTS
  // -------------------------

  public bindMenuEvents(onPlay: () => void): void {
    const btn = document.getElementById("playBtn");

    btn?.addEventListener("click", () => {
      this.setState("PLAYING");
      onPlay();
    });
  }

  public showMenu(): void {
    this.menuElement.style.display = "block";

    this.gameOverElement.style.display = "none";
  }

  public hideMenu(): void {
    this.menuElement.style.display = "none";
  }

  public showGameOver(): void {
    this.gameOverElement.innerHTML = `
    GAME OVER
    <br>
    Pressione R para reiniciar
  `;

    this.gameOverElement.style.display = "block";

    this.menuElement.style.display = "none";
  }
}
