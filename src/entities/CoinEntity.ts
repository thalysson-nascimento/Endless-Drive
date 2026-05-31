import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

import type { SpeedSystem } from "../systems/SpeedSystem";
import { BaseEntity } from "./BaseEntity";

export class CoinEntity extends BaseEntity {
  private mesh?: Mesh;
  private active = true;

  private readonly speedSystem: SpeedSystem;

  private currentLane = 1;

  private readonly lanePositions = [-2, 0, 2];

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);

    this.speedSystem = speedSystem;
  }

  create(): void {
    this.mesh = MeshBuilder.CreateCylinder(
      "coin",
      {
        diameter: 0.6,
        height: 0.1,
      },
      this.scene,
    );

    const material = new StandardMaterial("coinMaterial", this.scene);

    material.diffuseColor = Color3.Yellow();

    this.mesh.material = material;

    this.mesh.rotation.x = Math.PI / 2;

    this.currentLane = Math.floor(Math.random() * 3);

    this.mesh.position.x = this.lanePositions[this.currentLane];

    this.mesh.position.y = 0.6;

    this.mesh.position.z = 20;
  }

  update(deltaTime: number): void {
    if (!this.mesh) return;

    this.mesh.position.z -= this.speedSystem.getSpeed() * deltaTime;

    if (this.mesh.position.z < -10) {
      this.active = false;
      this.dispose();
    }
  }

  getPosition() {
    return this.mesh?.position;
  }

  getLane(): number {
    return this.currentLane;
  }

  isActive(): boolean {
    return this.active;
  }

  collect(): void {
    this.active = false;
    this.dispose();
  }

  dispose(): void {
    this.mesh?.dispose();
  }
}
