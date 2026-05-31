import {
  Color3,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class CarEntity extends BaseEntity {
  /**
   * Centraliza o carro na pista (lane central)
   */
  public reset(): void {
    this.currentLane = 1;
    this.updateLanePosition();
  }
  private root?: TransformNode;
  private currentLane = 1;
  private readonly lanePositions = [-2, 0, 2];

  public create(): void {
    this.root = new TransformNode("carRoot", this.scene);

    const material = new StandardMaterial("carMaterial", this.scene);

    material.diffuseColor = Color3.Blue();

    const body = MeshBuilder.CreateBox(
      "carBody",
      {
        width: 1.4,
        height: 0.5,
        depth: 2.5,
      },
      this.scene,
    );

    body.material = material;

    body.position.y = 0.5;

    body.parent = this.root;

    const cabin = MeshBuilder.CreateBox(
      "carCabin",
      {
        width: 1,
        height: 0.5,
        depth: 1.2,
      },
      this.scene,
    );

    cabin.material = material;

    cabin.position.y = 1;

    cabin.position.z = -0.2;

    cabin.parent = this.root;

    this.updateLanePosition();
  }

  public update(_deltaTime: number): void {}

  public dispose(): void {
    this.root?.dispose();
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
    if (!this.root) {
      return Vector3.Zero();
    }

    return this.root.position;
  }

  public getCurrentLane(): number {
    return this.currentLane;
  }

  private updateLanePosition(): void {
    if (!this.root) {
      return;
    }

    this.root.position.x = this.lanePositions[this.currentLane];
    console.log("Lane:", this.currentLane, "X:", this.root.position.x);
  }
}
