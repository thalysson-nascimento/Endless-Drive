import { Scene } from "@babylonjs/core";

export abstract class BaseScene {
  public abstract readonly scene: Scene;

  abstract create(): Promise<void>;

  abstract update(deltaTime: number): void;

  abstract dispose(): void;
}
