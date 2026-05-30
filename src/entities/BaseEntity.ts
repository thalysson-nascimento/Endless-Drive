import { Scene } from "@babylonjs/core";
import type { Updatable } from "../interfaces/Updatable";

export abstract class BaseEntity implements Updatable {
  protected readonly scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  abstract create(): void;

  abstract update(deltaTime: number): void;

  abstract dispose(): void;
}
