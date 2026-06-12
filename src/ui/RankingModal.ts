import type { RankingEntry, RankingSystem } from "../systems/RankingSystem";

/**
 * RankingModal — modal de ranking estilo cartoon.
 *
 * Dois modos:
 *  - "view"   → apenas exibe o ranking (chamado do menu)
 *  - "submit" → exibe input de 4 letras antes de mostrar o ranking
 *               (chamado após game over quando score qualifica)
 */
export class RankingModal {
  private overlay!: HTMLDivElement;
  private readonly rankingSystem: RankingSystem;

  constructor(rankingSystem: RankingSystem) {
    this.rankingSystem = rankingSystem;
    this.injectStyles();
  }

  // ── ESTILOS ────────────────────────────────────────────────────────────

  private injectStyles(): void {
    if (document.getElementById("ranking-styles")) return;
    const s = document.createElement("style");
    s.id = "ranking-styles";
    s.textContent = `
      /* ── OVERLAY fosco igual ao game over ── */
      #ranking-overlay {
        position: fixed;
        inset: 24px;                      /* margin de 24px em todos os lados */
        z-index: 200;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        animation: ranking-enter 0.28s cubic-bezier(0.34, 1.3, 0.64, 1) both;
      }

      @keyframes ranking-enter {
        from { transform: scale(0.88); opacity: 0; }
        to   { transform: scale(1);    opacity: 1; }
      }

      /* ── HEADER ── */
      .ranking-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 20px 0;
        position: relative;
      }

      .ranking-title {
        font-family: 'Lilita One', sans-serif;
        font-size: clamp(28px, 7vw, 38px);
        color: #FFD700;
        text-shadow:
          -2px -2px 0 #A07000,
           2px -2px 0 #A07000,
          -2px  2px 0 #A07000,
           2px  2px 0 #A07000;
        letter-spacing: 0.08em;
      }

      /* Botão fechar — canto superior direito */
      .ranking-close {
        position: absolute;
        right: 16px;
        top: 16px;
        width: 38px; height: 38px;
        border-radius: 50%;
        border: 3px solid #FF6060;
        background: #CC2020;
        box-shadow: 0 4px 0 #880000;
        color: #fff;
        font-size: 18px;
        font-weight: 900;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.08s ease;
        line-height: 1;
      }

      .ranking-close:active { transform: translateY(3px); box-shadow: 0 1px 0 #880000; }

      /* ── LISTA ── */
      .ranking-list {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ranking-list::-webkit-scrollbar { width: 4px; }
      .ranking-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

      /* Linha do ranking */
      .ranking-row {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255,255,255,0.07);
        border-radius: 12px;
        padding: 10px 14px;
        border: 1px solid rgba(255,255,255,0.10);
        animation: row-slide-in 0.25s ease both;
      }

      .ranking-row.is-new {
        background: rgba(255, 215, 0, 0.18);
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 0 0 12px rgba(255, 215, 0, 0.2);
      }

      @keyframes row-slide-in {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Posição */
      .ranking-pos {
        font-family: 'Lilita One', sans-serif;
        font-size: 18px;
        min-width: 32px;
        text-align: center;
      }

      .ranking-pos.gold   { color: #FFD700; text-shadow: 0 0 8px rgba(255,215,0,0.6); }
      .ranking-pos.silver { color: #C0C0C0; }
      .ranking-pos.bronze { color: #CD7F32; }
      .ranking-pos.normal { color: rgba(255,255,255,0.5); }

      /* Tag */
      .ranking-tag {
        font-family: 'Lilita One', sans-serif;
        font-size: 20px;
        color: #fff;
        letter-spacing: 0.12em;
        flex: 1;
      }

      /* Score */
      .ranking-score {
        font-family: 'Lilita One', sans-serif;
        font-size: 18px;
        color: #7DF0FF;
        letter-spacing: 0.04em;
      }

      /* Data */
      .ranking-date {
        font-size: 11px;
        color: rgba(255,255,255,0.35);
        min-width: 60px;
        text-align: right;
      }

      /* Vazio */
      .ranking-empty {
        text-align: center;
        padding: 40px 0;
        font-family: 'Lilita One', sans-serif;
        font-size: 18px;
        color: rgba(255,255,255,0.3);
      }

      /* ── SUBMIT FORM (input de 4 letras) ── */
      .ranking-submit-wrap {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 24px 0;
        gap: 12px;
      }

      .ranking-submit-label {
        font-family: 'Lilita One', sans-serif;
        font-size: clamp(14px, 3.5vw, 17px);
        color: rgba(255,255,255,0.75);
        text-align: center;
        letter-spacing: 0.04em;
      }

      .ranking-tag-input-wrap {
        display: flex;
        gap: 8px;
      }

      /* 4 caixinhas individuais */
      .ranking-char-box {
        width: 48px; height: 56px;
        border-radius: 10px;
        border: 3px solid rgba(255,255,255,0.25);
        background: rgba(255,255,255,0.10);
        color: #fff;
        font-family: 'Lilita One', sans-serif;
        font-size: 28px;
        text-align: center;
        text-transform: uppercase;
        outline: none;
        caret-color: transparent;
        transition: border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .ranking-char-box:focus {
        border-color: #FFD700;
        background: rgba(255, 215, 0, 0.12);
      }

      .ranking-confirm-btn {
        width: 100%;
        padding: 14px 0;
        border: none;
        border-radius: 12px;
        background: #F5C030;
        border-bottom: 5px solid #A07000;
        border-top: 3px solid #FFE070;
        font-family: 'Lilita One', sans-serif;
        font-size: 20px;
        color: #fff;
        text-shadow: -1px -1px 0 #7A4800, 1px 1px 0 #7A4800;
        cursor: pointer;
        letter-spacing: 0.08em;
        transition: transform 0.08s ease;
      }

      .ranking-confirm-btn:active {
        transform: translateY(3px);
        border-bottom-width: 2px;
      }

      /* Separador */
      .ranking-divider {
        width: calc(100% - 48px);
        height: 1px;
        background: rgba(255,255,255,0.12);
        margin: 8px 0 0;
      }
    `;
    document.head.appendChild(s);
  }

  // ── MODO VIEW (menu principal) ─────────────────────────────────────────

  public openView(onClose: () => void): void {
    this.build(onClose, null, null);
  }

  // ── MODO SUBMIT (após game over) ───────────────────────────────────────

  public openSubmit(score: number, onClose: () => void): void {
    this.build(onClose, score, null);
  }

  // ── BUILD ──────────────────────────────────────────────────────────────

  private build(
    onClose: () => void,
    submitScore: number | null,
    highlightTag: string | null,
  ): void {
    this.remove();

    this.overlay = document.createElement("div");
    this.overlay.id = "ranking-overlay";

    // ── Header ──
    const header = document.createElement("div");
    header.className = "ranking-header";

    const title = document.createElement("span");
    title.className = "ranking-title";
    title.textContent = "🏆  RANKING";

    const closeBtn = document.createElement("button");
    closeBtn.className = "ranking-close";
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", () => {
      this.remove();
      onClose();
    });

    header.appendChild(title);
    header.appendChild(closeBtn);
    this.overlay.appendChild(header);

    // ── Submit form (só se vier do game over) ──
    if (submitScore !== null) {
      const wrap = document.createElement("div");
      wrap.className = "ranking-submit-wrap";

      const label = document.createElement("p");
      label.className = "ranking-submit-label";
      label.innerHTML = `Your score: <strong style="color:#7DF0FF">${submitScore}</strong><br>Enter your 4-letter tag to save!`;

      // 4 input boxes
      const inputWrap = document.createElement("div");
      inputWrap.className = "ranking-tag-input-wrap";

      const boxes: HTMLInputElement[] = [];
      for (let i = 0; i < 4; i++) {
        const box = document.createElement("input");
        box.className = "ranking-char-box";
        box.maxLength = 1;
        box.type = "text";
        box.inputMode = "text";
        box.autocomplete = "off";

        box.addEventListener("input", () => {
          const val = box.value.replace(/[^a-zA-Z]/g, "");
          box.value = val.toUpperCase();
          if (val && i < 3) boxes[i + 1].focus();
        });

        box.addEventListener("keydown", (e) => {
          if (e.key === "Backspace" && !box.value && i > 0) {
            boxes[i - 1].focus();
            boxes[i - 1].value = "";
          }
        });

        boxes.push(box);
        inputWrap.appendChild(box);
      }

      const confirmBtn = document.createElement("button");
      confirmBtn.className = "ranking-confirm-btn";
      confirmBtn.textContent = "✓  CONFIRM";

      confirmBtn.addEventListener("click", () => {
        const tag = boxes.map(b => b.value || "·").join("");
        const pos = this.rankingSystem.submit(tag, submitScore);
        // Reconstruir em modo view, destacando a nova entrada
        this.build(onClose, null, tag);
        // Scroll para a posição do novo item
        setTimeout(() => {
          const rows = this.overlay.querySelectorAll<HTMLElement>(".ranking-row");
          if (rows[pos - 1]) rows[pos - 1].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      });

      wrap.appendChild(label);
      wrap.appendChild(inputWrap);
      wrap.appendChild(confirmBtn);

      const divider = document.createElement("div");
      divider.className = "ranking-divider";

      this.overlay.appendChild(wrap);
      this.overlay.appendChild(divider);

      // Focar primeiro box
      setTimeout(() => boxes[0].focus(), 50);
    }

    // ── Lista ──
    const list = document.createElement("div");
    list.className = "ranking-list";

    const entries = this.rankingSystem.getEntries();

    if (entries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "ranking-empty";
      empty.textContent = "No records yet.\nBe the first! 🏁";
      list.appendChild(empty);
    } else {
      entries.forEach((entry: RankingEntry, idx: number) => {
        const row = this.buildRow(entry, idx, highlightTag);
        row.style.animationDelay = `${idx * 0.04}s`;
        list.appendChild(row);
      });
    }

    this.overlay.appendChild(list);
    document.body.appendChild(this.overlay);
  }

  private buildRow(entry: RankingEntry, idx: number, highlightTag: string | null): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "ranking-row";
    if (highlightTag && entry.tag === highlightTag) row.classList.add("is-new");

    // Posição
    const pos = document.createElement("span");
    pos.className = "ranking-pos";
    if (idx === 0)      { pos.classList.add("gold");   pos.textContent = "🥇"; }
    else if (idx === 1) { pos.classList.add("silver");  pos.textContent = "🥈"; }
    else if (idx === 2) { pos.classList.add("bronze");  pos.textContent = "🥉"; }
    else                { pos.classList.add("normal");  pos.textContent = `#${idx + 1}`; }

    // Tag
    const tag = document.createElement("span");
    tag.className = "ranking-tag";
    tag.textContent = entry.tag;

    // Score
    const score = document.createElement("span");
    score.className = "ranking-score";
    score.textContent = entry.score.toLocaleString();

    // Data
    const date = document.createElement("span");
    date.className = "ranking-date";
    date.textContent = entry.date;

    row.appendChild(pos);
    row.appendChild(tag);
    row.appendChild(score);
    row.appendChild(date);

    return row;
  }

  public remove(): void {
    const existing = document.getElementById("ranking-overlay");
    if (existing) existing.remove();
  }
}
