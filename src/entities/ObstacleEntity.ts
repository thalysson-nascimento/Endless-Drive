import {
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";

import type { SpeedSystem } from "../systems/SpeedSystem";
import { BaseEntity } from "./BaseEntity";

export class ObstacleEntity extends BaseEntity {
  private root?: TransformNode;
  private currentLane = 1;
  private active = true;
  private readonly lanePositions = [-2, 0, 2];
  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);

    this.speedSystem = speedSystem;
  }

  public create(): void {
    this.root = new TransformNode("obstacleRoot", this.scene);

    const material = new StandardMaterial("obstacleMaterial", this.scene);

    material.diffuseColor = Color3.Red();

    const body = MeshBuilder.CreateBox(
      "obstacleBody",
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
      "obstacleCabin",
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

    this.currentLane = this.randomLane();

    this.root.position.x = this.lanePositions[this.currentLane];

    this.root.position.z = 15;
  }

  public update(deltaTime: number): void {
    if (!this.root) {
      return;
    }

    this.root.position.z -= this.speedSystem.getSpeed() * deltaTime;

    if (this.root.position.z < -10) {
      this.active = false;
      this.dispose();
    }
  }

  public dispose(): void {
    this.root?.dispose();
  }

  public getPosition() {
    if (!this.root) {
      throw new Error("Obstacle mesh não criada");
    }

    return this.root.position;
  }

  public getCurrentLane(): number {
    return this.currentLane;
  }

  public setLane(lane: number): void {
    if (!this.root) {
      return;
    }

    this.currentLane = lane;

    this.root.position.x = this.lanePositions[lane];
  }

  public setPositionZ(z: number): void {
    if (!this.root) {
      return;
    }

    this.root.position.z = z;
  }

  isActive(): boolean {
    return this.active;
  }

  private randomLane(): number {
    return Math.floor(Math.random() * 3);
  }
}
