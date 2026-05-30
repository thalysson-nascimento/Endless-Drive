import type { Scene } from "@babylonjs/core";
import { BaseScene } from "./BaseScene";

// Estrutura inicial para MenuScene
export class MenuScene extends BaseScene {
  public scene: Scene;

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(_deltaTime: number): void {
    throw new Error("Method not implemented.");
  }
  dispose(): void {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
  }
}
