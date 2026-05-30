import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class CubeEntity extends BaseEntity {
  private mesh?: Mesh;

  constructor(scene: Scene) {
    super(scene);
  }

  public create(): void {
    this.mesh = MeshBuilder.CreateBox(
      "cube",
      {
        size: 2,
      },
      this.scene,
    );
  }

  public update(deltaTime: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.rotation.y += deltaTime;
  }

  public dispose(): void {
    this.mesh?.dispose();
  }
}
