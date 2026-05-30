import type { Scene } from "@babylonjs/core";
import { BaseScene } from "./BaseScene";

// Estrutura inicial para GameOverScene
export class GameOverScene extends BaseScene {
  public scene: Scene;

  constructor() {
    super();
  }

  public create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public update(deltaTime: number): void {
    console.log("Game Over", deltaTime);
    throw new Error("Method not implemented.");
  }

  public dispose(): void {
    throw new Error("Method not implemented.");
  }
}
