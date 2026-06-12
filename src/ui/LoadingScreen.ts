/**
 * LoadingScreen — tela de carregamento estilo cartoon.
 * Exibe a imagem de fundo (main-menu.png) enquanto o vídeo carrega.
 * A barra de progresso é amarela animada com visual infantil/cartoon.
 *
 * Uso:
 *   const loader = new LoadingScreen();
 *   loader.mount();                    // injeta no DOM
 *   loader.setProgress(0.6);          // 0..1 — atualiza a barra
 *   await loader.dismiss();           // fade-out e remove do DOM
 */
export class LoadingScreen {
  private overlay!: HTMLDivElement;
  private fillEl!: HTMLDivElement;
  private labelEl!: HTMLSpanElement;
  private mounted = false;

  // ── BUILD ──────────────────────────────────────────────────────────────

  private build(): void {
    this.injectStyles();

    this.overlay = document.createElement("div");
    this.overlay.id = "loading-overlay";

    this.overlay.innerHTML = `
      <div class="loading-inner">

        <div class="loading-title-wrap">
          <span class="loading-title">Loading</span>
          <span class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>

        <div class="loading-bar-track">
          <div class="loading-bar-fill" id="loading-bar-fill"></div>
          <div class="loading-bar-shine"></div>
        </div>

        <span class="loading-pct" id="loading-pct">0%</span>

      </div>
    `;

    this.fillEl  = this.overlay.querySelector("#loading-bar-fill")!;
    this.labelEl = this.overlay.querySelector("#loading-pct")!;
  }

  private injectStyles(): void {
    if (document.getElementById("loading-styles")) return;
    const s = document.createElement("style");
    s.id = "loading-styles";
    s.textContent = `
      /* ── OVERLAY ── */
      #loading-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background-image: url('/models/assets/main-menu.png');
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 80px;
        transition: opacity 0.5s ease;
      }

      #loading-overlay.loading-fade-out {
        opacity: 0;
        pointer-events: none;
      }

      /* ── INNER BOX ── */
      .loading-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: min(88vw, 340px);
      }

      /* ── TÍTULO ── */
      .loading-title-wrap {
        display: flex;
        align-items: baseline;
        gap: 2px;
      }

      .loading-title {
        font-family: 'Lilita One', sans-serif;
        font-size: 28px;
        color: #fff;
        text-shadow:
          -2px -2px 0 #1070A0,
           2px -2px 0 #1070A0,
          -2px  2px 0 #1070A0,
           2px  2px 0 #1070A0;
        letter-spacing: 0.06em;
      }

      /* Pontinhos animados */
      .loading-dots span {
        font-family: 'Lilita One', sans-serif;
        font-size: 28px;
        color: #FFD700;
        text-shadow: -1px -1px 0 #A07000, 1px 1px 0 #A07000;
        animation: loading-dot-bounce 1.2s infinite;
        display: inline-block;
      }

      .loading-dots span:nth-child(1) { animation-delay: 0s; }
      .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
      .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes loading-dot-bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40%            { transform: translateY(-8px); }
      }

      /* ── BARRA TRACK ── */
      .loading-bar-track {
        width: 100%;
        height: 28px;
        background: #38C0F0;
        border-radius: 50px;
        border: 4px solid #1070A0;
        box-shadow:
          0 5px 0 #0A4870,
          inset 0 3px 0 rgba(255,255,255,0.3);
        overflow: hidden;
        position: relative;
      }

      /* ── BARRA FILL (amarela) ── */
      .loading-bar-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(180deg, #FFE566 0%, #F5C030 50%, #E0A010 100%);
        border-radius: 50px;
        transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }

      /* Brilho deslizando na barra */
      .loading-bar-fill::after {
        content: '';
        position: absolute;
        top: 3px; left: -60%;
        width: 50%;
        height: 40%;
        background: rgba(255,255,255,0.55);
        border-radius: 50px;
        animation: bar-shine 1.8s linear infinite;
      }

      @keyframes bar-shine {
        0%   { left: -60%; }
        100% { left: 110%; }
      }

      /* Shine estático no topo da track */
      .loading-bar-shine {
        position: absolute;
        top: 4px; left: 8%; right: 8%;
        height: 5px;
        background: rgba(255,255,255,0.35);
        border-radius: 50px;
        pointer-events: none;
      }

      /* ── PORCENTAGEM ── */
      .loading-pct {
        font-family: 'Lilita One', sans-serif;
        font-size: 18px;
        color: #fff;
        text-shadow:
          -1px -1px 0 #1070A0,
           1px  1px 0 #1070A0;
        letter-spacing: 0.08em;
      }
    `;
    document.head.appendChild(s);
  }

  // ── API PÚBLICA ────────────────────────────────────────────────────────

  public mount(): void {
    if (this.mounted) return;
    this.build();
    document.body.appendChild(this.overlay);
    this.mounted = true;
  }

  /** progress: 0.0 → 1.0 */
  public setProgress(progress: number): void {
    const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
    if (this.fillEl)  this.fillEl.style.width = `${pct}%`;
    if (this.labelEl) this.labelEl.textContent = `${pct}%`;
  }

  /** Fade-out e remove do DOM. Retorna Promise que resolve após a transição. */
  public dismiss(): Promise<void> {
    return new Promise(resolve => {
      if (!this.overlay) { resolve(); return; }
      this.overlay.classList.add("loading-fade-out");
      setTimeout(() => {
        this.overlay.remove();
        this.mounted = false;
        resolve();
      }, 520);
    });
  }
}
