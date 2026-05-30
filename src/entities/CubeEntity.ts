import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class CubeEntity extends BaseEntity {
  private mesh?: Mesh;

  constructor(scene: Scene) {
    super(scene);
  }

  create(): void {
    this.mesh = MeshBuilder.CreateBox(
      "cube",
      {
        size: 2,
      },
      this.scene,
    );
  }

  update(deltaTime: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.rotation.y += deltaTime;
  }

  dispose(): void {
    this.mesh?.dispose();
  }
}
