/**
 * CartoonButton — botão estilo cartoon 3D reutilizável.
 *
 * Uso:
 *   const btn = new CartoonButton({ label: "Play", variant: "pink", onClick: () => {} });
 *   container.appendChild(btn.element);
 */

export type CartoonButtonVariant = "pink" | "yellow" | "blue";

export interface CartoonButtonOptions {
  label: string;
  variant: CartoonButtonVariant;
  onClick: () => void;
}

// Paleta fiel à imagem de referência
const VARIANTS: Record<CartoonButtonVariant, {
  bg: string;
  shadow: string;
  highlight: string;
  textColor: string;
  textShadow: string;
}> = {
  pink: {
    bg:        "#F06090",
    shadow:    "#A02050",
    highlight: "#F898B8",
    textColor: "#ffffff",
    textShadow: "-2px -2px 0 #8B1040, 2px -2px 0 #8B1040, -2px 2px 0 #8B1040, 2px 2px 0 #8B1040",
  },
  yellow: {
    bg:        "#F5C030",
    shadow:    "#A07000",
    highlight: "#FFE070",
    textColor: "#ffffff",
    textShadow: "-2px -2px 0 #7A4800, 2px -2px 0 #7A4800, -2px 2px 0 #7A4800, 2px 2px 0 #7A4800",
  },
  blue: {
    bg:        "#38C0F0",
    shadow:    "#1070A0",
    highlight: "#80DCFF",
    textColor: "#ffffff",
    textShadow: "-2px -2px 0 #0A4870, 2px -2px 0 #0A4870, -2px 2px 0 #0A4870, 2px 2px 0 #0A4870",
  },
};

export class CartoonButton {
  public readonly element: HTMLButtonElement;
  private readonly variant: CartoonButtonVariant;

  constructor({ label, variant, onClick }: CartoonButtonOptions) {
    this.variant = variant;
    this.element = this.build(label, onClick);
  }

  private build(label: string, onClick: () => void): HTMLButtonElement {
    const v = VARIANTS[this.variant];
    const btn = document.createElement("button");
    btn.className = `cartoon-btn cartoon-btn--${this.variant}`;
    btn.innerHTML = `<span class="cartoon-btn__label">${label}</span>`;

    // Estilos inline para garantir as cores certas de cada variante
    btn.style.cssText = `
      --btn-bg:        ${v.bg};
      --btn-shadow:    ${v.shadow};
      --btn-highlight: ${v.highlight};
      --btn-text:      ${v.textColor};
      --btn-ts:        ${v.textShadow};
    `;

    btn.addEventListener("pointerdown", () => btn.classList.add("cartoon-btn--pressed"));
    btn.addEventListener("pointerup",   () => btn.classList.remove("cartoon-btn--pressed"));
    btn.addEventListener("pointerleave",() => btn.classList.remove("cartoon-btn--pressed"));
    btn.addEventListener("click", onClick);

    return btn;
  }
}
