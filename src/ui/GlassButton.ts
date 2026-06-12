/**
 * GlassButton — componente de botão reutilizavel com estilo glassmorphism.
 *
 * Uso:
 *   const btn = new GlassButton({ label: "Play", onClick: () => {} });
 *   container.appendChild(btn.element);
 */

export interface GlassButtonOptions {
  label: string;
  id?: string;
  onClick: () => void;
}

export class GlassButton {
  public readonly element: HTMLButtonElement;

  constructor({ label, id, onClick }: GlassButtonOptions) {
    this.element = document.createElement("button");
    this.element.className = "glass-btn";
    if (id) this.element.id = id;
    this.element.innerHTML = label;

    this.element.addEventListener("click", () => {
      this.element.classList.add("pressed");
      setTimeout(() => this.element.classList.remove("pressed"), 450);
      onClick();
    });
  }
}
