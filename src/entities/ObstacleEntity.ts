import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

import type { SpeedSystem } from "../systems/SpeedSystem";
import { BaseEntity } from "./BaseEntity";

export class ObstacleEntity extends BaseEntity {
  private mesh?: Mesh;
  private currentLane = 1;
  private active = true;
  private readonly lanePositions = [-2, 0, 2];
  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);

    this.speedSystem = speedSystem;
  }

  public create(): void {
    this.mesh = MeshBuilder.CreateBox(
      "obstacle",
      {
        width: 1,
        height: 1,
        depth: 1,
      },
      this.scene,
    );

    this.mesh.position.y = 0.5;

    const material = new StandardMaterial("obstacleMaterial", this.scene);

    material.diffuseColor = Color3.Red();

    this.mesh.material = material;

    // pista central
    this.currentLane = this.randomLane();

    this.mesh.position.x = this.lanePositions[this.currentLane];
    // alguns metros à frente do carro
    this.mesh.position.z = 15;
  }

  public update(deltaTime: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.position.z -= this.speedSystem.getSpeed() * deltaTime;

    if (this.mesh.position.z < -10) {
      this.active = false;
      this.dispose();

      // this.currentLane = this.randomLane();

      // this.mesh.position.x = this.lanePositions[this.currentLane];
    }
  }

  public dispose(): void {
    this.mesh?.dispose();
  }

  public getPosition() {
    if (!this.mesh) {
      throw new Error("Obstacle mesh não criada");
    }

    return this.mesh.position;
  }

  public getCurrentLane(): number {
    return this.currentLane;
  }

  public setLane(lane: number): void {
    if (!this.mesh) {
      return;
    }

    this.currentLane = lane;

    this.mesh.position.x = this.lanePositions[lane];
  }

  public setPositionZ(z: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.position.z = z;
  }

  isActive(): boolean {
    return this.active;
  }

  private randomLane(): number {
    return Math.floor(Math.random() * 3);
  }
}
