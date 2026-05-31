import type { Scene } from "@babylonjs/core";
import { ObstacleEntity } from "../entities/ObstacleEntity";
import type { SpeedSystem } from "./SpeedSystem";

export class SpawnSystem {
  private elapsedTime = 0;
  private spawnInterval = 2;
  private obstacles: ObstacleEntity[] = [];
  private score = 0;
  private readonly spawnZ = 60;
  private readonly minDistanceBetweenObstacles = 10;
  private readonly scene: Scene;
  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    this.scene = scene;
    this.speedSystem = speedSystem;
  }

  public update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= this.spawnInterval && this.canSpawnObstacle()) {
      this.spawnPattern(this.score);

      this.elapsedTime = 0;
    }

    for (const obstacle of this.obstacles) {
      obstacle.update(deltaTime);
    }

    this.obstacles = this.obstacles.filter((obstacle) => obstacle.isActive());
  }

  public getObstacles(): ObstacleEntity[] {
    return this.obstacles;
  }

  public setSpawnInterval(interval: number): void {
    this.spawnInterval = interval;
  }

  private canSpawnObstacle(): boolean {
    if (this.obstacles.length === 0) {
      return true;
    }

    const lastObstacle = this.obstacles[this.obstacles.length - 1];

    const lastZ = lastObstacle.getPosition().z;

    return lastZ < this.spawnZ - this.minDistanceBetweenObstacles;
  }

  public setScore(score: number): void {
    this.score = score;
  }

  private createObstacle(lane: number, z: number): void {
    const obstacle = new ObstacleEntity(this.scene, this.speedSystem);

    obstacle.create();

    obstacle.setLane(lane);

    obstacle.setPositionZ(z);

    this.obstacles.push(obstacle);
  }

  private spawnSingle(): void {
    this.createObstacle(Math.floor(Math.random() * 3), this.spawnZ);
  }

  private spawnDouble(): void {
    const freeLane = Math.floor(Math.random() * 3);

    for (let lane = 0; lane < 3; lane++) {
      if (lane === freeLane) {
        continue;
      }

      this.createObstacle(lane, this.spawnZ);
    }
  }

  private spawnDiagonal(): void {
    this.createObstacle(0, this.spawnZ + 8);

    this.createObstacle(1, 48);
  }

  private spawnSides(): void {
    this.createObstacle(0, this.spawnZ);

    this.createObstacle(2, this.spawnZ);
  }

  private spawnPattern(score: number): void {
    const availablePatterns = this.getAvailablePatterns(score);

    const randomIndex = Math.floor(Math.random() * availablePatterns.length);

    const pattern = availablePatterns[randomIndex];

    switch (pattern) {
      case 0:
        this.spawnSingle();
        break;

      case 1:
        this.spawnDouble();
        break;

      case 2:
        this.spawnSides();
        break;

      case 3:
        this.spawnDiagonal();
        break;
    }
  }

  private getAvailablePatterns(score: number): number[] {
    if (score < 10) {
      return [0];
    }

    if (score < 20) {
      return [0, 1];
    }

    if (score < 40) {
      return [0, 1, 2];
    }

    return [0, 1, 2, 3];
  }
}
