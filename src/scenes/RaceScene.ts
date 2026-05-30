import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";

import { BaseScene } from "./BaseScene";

export class RaceScene extends BaseScene {
  public readonly scene: Scene;

  private box?: ReturnType<typeof MeshBuilder.CreateBox>;
  private readonly engine: Engine;

  constructor(engine: Engine) {
    super();

    this.engine = engine;
    this.scene = new Scene(this.engine);
  }

  async create(): Promise<void> {
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      8,
      Vector3.Zero(),
      this.scene,
    );

    camera.attachControl(this.engine.getRenderingCanvas(), true);

    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    this.box = MeshBuilder.CreateBox(
      "box",
      {
        size: 2,
      },
      this.scene,
    );
  }

  update(deltaTime: number): void {
    if (!this.box) {
      return;
    }

    this.box.rotation.y += deltaTime;
  }

  dispose(): void {
    this.scene.dispose();
  }
}
