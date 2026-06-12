import { RankingSystem } from "../systems/RankingSystem";
import { CartoonMenuPanel } from "./CartoonMenuPanel";
import { GlassButton } from "./GlassButton";
import { LoadingScreen } from "./LoadingScreen";
import { RankingModal } from "./RankingModal";

export class GameUI {
  private hudContainer!: HTMLDivElement;
  private coinsValueEl!: HTMLSpanElement;
  private highScoreElement!: HTMLDivElement;
  private menuElement!: HTMLDivElement;
  private scoreElement!: HTMLDivElement;
  private gameOverElement!: HTMLDivElement;
  private bgVideo!: HTMLVideoElement;

  private readonly rankingSystem = new RankingSystem();
  private readonly rankingModal: RankingModal;

  constructor() {
    this.rankingModal = new RankingModal(this.rankingSystem);
    this.injectGlobalStyles();
    this.createScoreUI();
    this.createHudContainer();
    this.createHighScoreUI();
    this.createMenuUI();
    this.createGameOverUI();
    this.setState("MENU");
  }

  // ── ESTILOS ────────────────────────────────────────────────────────────

  private injectGlobalStyles(): void {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Inter:wght@700;900&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; overflow: hidden; }

      .cartoon-panel {
        display: flex; flex-direction: column; align-items: center;
        gap: 14px; background: #38C0F0; border-radius: 22px;
        padding: 22px 20px 24px; width: min(88vw, 340px);
        border: 4px solid #1070A0;
        box-shadow: 0 8px 0 #0A4870, 0 12px 28px rgba(0,0,0,0.45),
          inset 0 3px 0 rgba(255,255,255,0.35);
      }

      .cartoon-btn {
        width: 100%; padding: 14px 0 18px; border: none; border-radius: 14px;
        cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent;
        position: relative; background: var(--btn-bg);
        font-family: 'Lilita One', 'Inter', sans-serif;
        font-size: clamp(20px, 5vw, 26px); font-weight: 900;
        letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--btn-text); text-shadow: var(--btn-ts);
        border-top: 3px solid var(--btn-highlight);
        border-left: 3px solid var(--btn-highlight);
        border-right: 3px solid var(--btn-shadow);
        border-bottom: 6px solid var(--btn-shadow);
        box-shadow: 0 6px 0 var(--btn-shadow), inset 0 2px 0 var(--btn-highlight);
        transition: transform 0.08s ease, box-shadow 0.08s ease;
        user-select: none;
      }

      .cartoon-btn__label { pointer-events: none; display: block; }

      .cartoon-btn--pressed {
        transform: translateY(4px) scale(0.98);
        box-shadow: 0 2px 0 var(--btn-shadow), inset 0 2px 0 var(--btn-highlight);
        border-bottom-width: 2px;
      }

      @keyframes cartoon-pop-in {
        0%   { transform: scale(0);    opacity: 0; }
        65%  { transform: scale(1.1);  opacity: 1; }
        85%  { transform: scale(0.95); }
        100% { transform: scale(1);    opacity: 1; }
      }

      .cartoon-btn--enter {
        animation: cartoon-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }

      .glass-btn {
        width: 100%; padding: 18px 0;
        border: 1px solid rgba(255,255,255,0.25); border-radius: 8px;
        cursor: pointer; font-family: 'Inter', sans-serif;
        font-size: 18px; font-weight: 700; letter-spacing: 0.12em;
        text-transform: uppercase; color: rgba(255,255,255,0.95);
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(18px) saturate(1.6);
        -webkit-backdrop-filter: blur(18px) saturate(1.6);
        box-shadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
        transition: box-shadow 0.15s ease, transform 0.1s ease, background 0.15s ease;
        position: relative; overflow: hidden; outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      .glass-btn:hover  { background: rgba(255,255,255,0.18); }
      .glass-btn:active { transform: scale(0.97); background: rgba(255,255,255,0.22); }
      .glass-btn::after {
        content: ''; position: absolute; inset: -2px; border-radius: 10px;
        opacity: 0; box-shadow: 0 0 0 3px rgba(255,255,255,0.7);
      }
      .glass-btn.pressed::after { animation: btn-glow 0.4s ease forwards; }

      @keyframes btn-glow {
        0%   { opacity: 1; box-shadow: 0 0 0 3px rgba(255,255,255,0.8); }
        100% { opacity: 0; box-shadow: 0 0 0 14px rgba(255,255,255,0); }
      }

      #menu-overlay {
        position: fixed; inset: 0; z-index: 100;
        display: flex; flex-direction: column;
        align-items: center; justify-content: flex-end;
        padding-bottom: 48px; overflow: hidden;
        transition: opacity 0.3s ease;
        background-image: url('/models/assets/main-menu.png');
        background-size: cover; background-position: center;
      }

      #menu-overlay.fade-out { opacity: 0; pointer-events: none; }

      #menu-overlay.video-playing {
        background-image: none;
        background-color: transparent;
      }

      #menu-overlay .cartoon-panel { position: relative; z-index: 1; }

      #hud-score {
        position: fixed; top: 16px; left: 16px;
        color: white; font-size: 18px; font-weight: 700;
        text-shadow: 0 1px 6px rgba(0,0,0,0.7);
        z-index: 10; pointer-events: none; display: none;
      }

      #hud-container {
        position: fixed; top: 16px; right: 16px;
        z-index: 10; pointer-events: none; display: none;
      }

      .hud-box {
        display: flex; align-items: center; gap: 0;
        background: rgba(0,0,0,0.5); border-radius: 12px; padding: 8px 12px;
      }

      .hud-coin-icon  { width: 24px; height: 24px; object-fit: contain; flex-shrink: 0; }
      .hud-coins-value {
        color: #fff; font-size: 16px; font-weight: 700;
        letter-spacing: 0.04em; min-width: 20px; text-align: left; margin-left: 6px;
      }
      .hud-ray-icon { width: 24px; height: 24px; object-fit: contain; flex-shrink: 0; margin-left: 5px; }

      #hud-highscore {
        position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
        color: #00E5FF; font-size: 16px; font-weight: 700;
        text-shadow: 0 1px 6px rgba(0,0,0,0.7);
        z-index: 10; pointer-events: none; white-space: nowrap; display: none;
      }

      #gameover-overlay {
        position: fixed; inset: 0; z-index: 100; display: none;
        flex-direction: column; align-items: center; justify-content: flex-end;
        padding: 16px; padding-bottom: 48px; gap: 12px;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      }

      #gameover-title {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -60%); text-align: center;
      }

      #gameover-title h1 {
        font-family: 'Lilita One', sans-serif;
        font-size: 52px; font-weight: 900; letter-spacing: 0.05em;
        color: #FF4C4C; text-shadow: 0 0 32px rgba(255,76,76,0.7); white-space: nowrap;
      }

      #gameover-title p {
        margin-top: 8px; font-size: 15px;
        color: rgba(255,255,255,0.55); letter-spacing: 0.06em;
      }

      #gameover-overlay .glass-btn { max-width: 100%; }
    `;
    document.head.appendChild(style);
  }

  // ── ELEMENTOS ──────────────────────────────────────────────────────────

  private createScoreUI(): void {
    this.scoreElement = document.createElement("div");
    this.scoreElement.id = "hud-score";
    document.body.appendChild(this.scoreElement);
  }

  private createHudContainer(): void {
    this.hudContainer = document.createElement("div");
    this.hudContainer.id = "hud-container";
    const box = document.createElement("div");
    box.className = "hud-box";

    const coinIcon = document.createElement("img");
    coinIcon.src = "/models/assets/coin.png";
    coinIcon.alt = "coin";
    coinIcon.className = "hud-coin-icon";

    this.coinsValueEl = document.createElement("span");
    this.coinsValueEl.className = "hud-coins-value";
    this.coinsValueEl.textContent = "0";

    const rayIcon = document.createElement("img");
    rayIcon.src = "/models/assets/ray.png";
    rayIcon.alt = "ray";
    rayIcon.className = "hud-ray-icon";

    box.appendChild(coinIcon);
    box.appendChild(this.coinsValueEl);
    box.appendChild(rayIcon);
    this.hudContainer.appendChild(box);
    document.body.appendChild(this.hudContainer);
  }

  private createHighScoreUI(): void {
    this.highScoreElement = document.createElement("div");
    this.highScoreElement.id = "hud-highscore";
    document.body.appendChild(this.highScoreElement);
  }

  private createMenuUI(): void {
    this.menuElement = document.createElement("div");
    this.menuElement.id = "menu-overlay";
    document.body.appendChild(this.menuElement);

    this.bgVideo = document.getElementById("bg-video") as HTMLVideoElement;

    this.bgVideo.addEventListener("playing", () => {
      this.bgVideo.style.display = "block";
      this.menuElement.classList.add("video-playing");
    });

    this.bgVideo.addEventListener("pause", () => {
      this.bgVideo.style.display = "none";
      this.menuElement.classList.remove("video-playing");
    });
  }

  private createGameOverUI(): void {
    this.gameOverElement = document.createElement("div");
    this.gameOverElement.id = "gameover-overlay";
    document.body.appendChild(this.gameOverElement);
  }

  // ── ESTADO ────────────────────────────────────────────────────────────

  public setState(state: "MENU" | "PLAYING" | "GAME_OVER"): void {
    const showHud = state === "PLAYING";

    this.hudContainer.style.display     = showHud ? "flex"  : "none";
    this.scoreElement.style.display     = showHud ? "block" : "none";
    this.highScoreElement.style.display = showHud ? "block" : "none";

    this.menuElement.style.display      = state === "MENU"      ? "flex" : "none";
    this.gameOverElement.style.display  = state === "GAME_OVER" ? "flex" : "none";

    if (state === "MENU") {
      this.menuElement.classList.remove("fade-out");
      this.bgVideo.play().catch(() => {});
    } else {
      this.bgVideo.pause();
      this.bgVideo.style.display = "none";
      this.menuElement.classList.remove("video-playing");
    }
  }

  // ── UPDATES ───────────────────────────────────────────────────────────

  public updateScore(score: number): void {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  public updateCoins(coins: number): void {
    this.coinsValueEl.textContent = String(coins);
  }

  public updateHighScore(score: number): void {
    this.highScoreElement.textContent = `Best: ${score}`;
  }

  // ── MENU ──────────────────────────────────────────────────────────────

  public bindMenuEvents(onPlay: () => void): void {
    const oldPanel = this.menuElement.querySelector(".cartoon-panel");
    if (oldPanel) oldPanel.remove();

    const panel = new CartoonMenuPanel({
      onPlay: () => {
        setTimeout(() => this.menuElement.classList.add("fade-out"), 80);
        setTimeout(() => { this.setState("PLAYING"); onPlay(); }, 380);
      },
      onRanking: () => {
        // Abre modal sobre o menu (menu continua visível atrás)
        this.rankingModal.openView(() => {
          // Ao fechar, menu continua aparecendo — não precisa fazer nada
        });
      },
      onShop: () => { console.log("Shop clicked"); },
    });

    this.menuElement.appendChild(panel.element);
  }

  public showMenu(): void {
    this.setState("MENU");
    const onPlay = () => {
      setTimeout(() => this.menuElement.classList.add("fade-out"), 80);
      setTimeout(() => this.setState("PLAYING"), 380);
    };
    this.bindMenuEvents(onPlay);
  }

  public hideMenu(): void {
    this.setState("PLAYING");
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────

  public showGameOver(
    score: number,
    onRestart: () => void,
    onMenu: () => void,
  ): void {
    this.gameOverElement.innerHTML = "";

    const title = document.createElement("div");
    title.id = "gameover-title";
    title.innerHTML = `<h1>GAME OVER</h1><p>Better luck next time</p>`;
    this.gameOverElement.appendChild(title);

    // Se o score qualifica para o ranking, mostrar botão de salvar
    if (this.rankingSystem.qualifiesFor(score)) {
      const rankBtn = new GlassButton({
        label: "🏆&nbsp;&nbsp;Save to Ranking",
        onClick: () => {
          this.rankingModal.openSubmit(score, () => {
            // Ao fechar o modal, volta para o game over normal
          });
        },
      });
      this.gameOverElement.appendChild(rankBtn.element);
    }

    const restartBtn = new GlassButton({ label: "↺&nbsp;&nbsp;Try Again", onClick: onRestart });
    const menuBtn    = new GlassButton({ label: "⌂&nbsp;&nbsp;Main Menu",  onClick: onMenu });

    this.gameOverElement.appendChild(restartBtn.element);
    this.gameOverElement.appendChild(menuBtn.element);

    this.setState("GAME_OVER");
  }

  // Getter para uso externo
  public getRankingSystem(): RankingSystem {
    return this.rankingSystem;
  }
}
