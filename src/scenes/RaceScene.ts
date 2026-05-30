import { Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

import { CameraController } from "../controllers/CameraController";
import { CarEntity } from "../entities/CarEntity";
import { ObstacleEntity } from "../entities/ObstacleEntity";
import { RoadEntity } from "../entities/RoadEntity";
import type { Updatable } from "../interfaces/Updatable";
import { GameStateManager } from "../managers/GameStateManager";
import { GameState } from "../types/GameState";
import { BaseScene } from "./BaseScene";

export class RaceScene extends BaseScene {
  public readonly scene: Scene;

  private car?: CarEntity;
  private road?: RoadEntity;
  private cameraController?: CameraController;
  private obstacle?: ObstacleEntity;
  private readonly engine: Engine;
  private readonly updatables: Updatable[] = [];
  private readonly gameStateManager = new GameStateManager();

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.car) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        this.car.moveLeft();
        break;

      case "ArrowRight":
      case "d":
      case "D":
        this.car.moveRight();
        break;
    }
  };

  constructor(engine: Engine) {
    super();

    this.engine = engine;
    this.scene = new Scene(this.engine);
  }

  public async create(): Promise<void> {
    this.road = new RoadEntity(this.scene);
    this.road.create();
    this.updatables.push(this.road);

    this.car = new CarEntity(this.scene);
    this.car.create();
    this.updatables.push(this.car);

    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    window.addEventListener("keydown", this.handleKeyDown);

    this.cameraController = new CameraController(this.scene, this.car);

    this.updatables.push(this.cameraController);

    this.obstacle = new ObstacleEntity(this.scene);

    this.obstacle.create();

    this.updatables.push(this.obstacle);
  }

  public update(deltaTime: number): void {
    if (this.gameStateManager.isGameOver()) {
      return;
    }

    for (const updatable of this.updatables) {
      updatable.update(deltaTime);
    }

    this.checkCollision();
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.handleKeyDown);

    this.car?.dispose();

    this.scene.dispose();
  }

  private checkCollision(): void {
    if (!this.car) {
      return;
    }

    if (!this.obstacle) {
      return;
    }

    const sameLane =
      this.car.getCurrentLane() === this.obstacle.getCurrentLane();

    const obstacleZ = this.obstacle.getPosition().z;

    const collision = sameLane && obstacleZ <= 1.5 && obstacleZ >= -1.5;

    if (collision) {
      console.log("GAME OVER");

      this.gameStateManager.setState(GameState.GAME_OVER);
    }
  }
}
