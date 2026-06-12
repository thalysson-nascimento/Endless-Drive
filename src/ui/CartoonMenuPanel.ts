import { CartoonButton } from "./CartoonButton";

/**
 * CartoonMenuPanel — panel azul com os 3 botões cartoon do menu principal.
 * Renderiza centralizado no meio da tela com animação de pop-in sequencial.
 */

export interface CartoonMenuPanelOptions {
  onPlay:    () => void;
  onRanking: () => void;
  onShop:    () => void;
}

export class CartoonMenuPanel {
  public readonly element: HTMLDivElement;

  constructor(options: CartoonMenuPanelOptions) {
    this.element = this.build(options);
  }

  private build({ onPlay, onRanking, onShop }: CartoonMenuPanelOptions): HTMLDivElement {
    const panel = document.createElement("div");
    panel.className = "cartoon-panel";

    const playBtn    = new CartoonButton({ label: "▶  START",   variant: "pink",   onClick: onPlay });
    const rankingBtn = new CartoonButton({ label: "🏆  RANKING", variant: "yellow", onClick: onRanking });
    const shopBtn    = new CartoonButton({ label: "🛒  SHOP",    variant: "blue",   onClick: onShop });

    panel.appendChild(playBtn.element);
    panel.appendChild(rankingBtn.element);
    panel.appendChild(shopBtn.element);

    // Animação sequencial: cada botão expande do centro com delay
    [playBtn, rankingBtn, shopBtn].forEach((btn, i) => {
      btn.element.style.animationDelay = `${i * 0.12}s`;
      btn.element.classList.add("cartoon-btn--enter");
    });

    return panel;
  }
}
