import type { Scene } from "@babylonjs/core";
import { BaseScene } from "./BaseScene";

// Estrutura inicial para MenuScene
export class MenuScene extends BaseScene {
  public scene!: Scene;

  constructor() {
    super();
  }

  public create(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public update(_deltaTime: number): void {
    throw new Error("Method not implemented.");
  }

  public dispose(): void {
    throw new Error("Method not implemented.");
  }
}
