import type { Scene } from "@babylonjs/core";
import { ObstacleEntity } from "../entities/ObstacleEntity";
import type { SpeedSystem } from "./SpeedSystem";

export class SpawnSystem {
  private elapsedTime = 0;
  private obstacles: ObstacleEntity[] = [];
  private readonly scene: Scene;
  private readonly spawnZ = 30;
  private readonly minDistanceBetweenObstacles = 10;

  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    this.scene = scene;
    this.speedSystem = speedSystem;
  }

  public update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= 2 && this.canSpawnObstacle()) {
      this.spawnObstacle();

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

  private spawnObstacle(): void {
    const obstacle = new ObstacleEntity(this.scene, this.speedSystem);

    obstacle.create();

    obstacle.setLane(Math.floor(Math.random() * 3));

    obstacle.setPositionZ(40);

    this.obstacles.push(obstacle);
  }

  private canSpawnObstacle(): boolean {
    if (this.obstacles.length === 0) {
      return true;
    }

    const lastObstacle = this.obstacles[this.obstacles.length - 1];

    const lastZ = lastObstacle.getPosition().z;

    return lastZ < this.spawnZ - this.minDistanceBetweenObstacles;
  }
}
