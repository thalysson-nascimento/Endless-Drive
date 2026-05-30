import { Color3, Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class ObstacleEntity extends BaseEntity {
  private mesh?: Mesh;
  private readonly speed = 15;
  private readonly lanePositions = [-2, 0, 2];
  private currentLane = 1;

  create(): void {
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

  update(deltaTime: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.position.z -= this.speed * deltaTime;

    if (this.mesh.position.z < -10) {
      this.mesh.position.z = 30;

      this.currentLane = this.randomLane();

      this.mesh.position.x = this.lanePositions[this.currentLane];
    }
  }

  dispose(): void {
    this.mesh?.dispose();
  }

  getPosition() {
    if (!this.mesh) {
      throw new Error("Obstacle mesh não criada");
    }

    return this.mesh.position;
  }

  getCurrentLane(): number {
    return this.currentLane;
  }

  private randomLane(): number {
    return Math.floor(Math.random() * 3);
  }
}
