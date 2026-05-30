import { Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class CarEntity extends BaseEntity {
  private mesh?: Mesh;
  private currentLane = 1;
  private readonly lanePositions = [-2, 0, 2];

  public create(): void {
    this.mesh = MeshBuilder.CreateBox(
      "car",
      {
        width: 1,
        height: 1,
        depth: 2,
      },
      this.scene,
    );

    this.mesh.position.y = 0.5;

    this.updateLanePosition();
  }

  public update(_deltaTime: number): void {}

  public dispose(): void {
    this.mesh?.dispose();
  }

  public moveLeft(): void {
    if (this.currentLane <= 0) {
      return;
    }

    this.currentLane--;

    this.updateLanePosition();
  }

  public moveRight(): void {
    if (this.currentLane >= 2) {
      return;
    }

    this.currentLane++;

    this.updateLanePosition();
  }

  public getPosition(): Vector3 {
    if (!this.mesh) {
      return Vector3.Zero();
    }

    return this.mesh.position;
  }

  public getCurrentLane(): number {
    return this.currentLane;
  }

  private updateLanePosition(): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.position.x = this.lanePositions[this.currentLane];
    console.log("Lane:", this.currentLane, "X:", this.mesh.position.x);
  }
}
