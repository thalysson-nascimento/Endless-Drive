import { Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

import { CameraController } from "../controllers/CameraController";
import { CarEntity } from "../entities/CarEntity";
import { RoadEntity } from "../entities/RoadEntity";
import type { Updatable } from "../interfaces/Updatable";
import { GameStateManager } from "../managers/GameStateManager";
import { CoinSystem } from "../systems/CoinSystem.ts";
import { CoinWallet } from "../systems/CoinWallet.ts";
import { HighScoreSystem } from "../systems/HighScoreSystem.ts";
import { ScoreSystem } from "../systems/ScoreSystem";
import { SpawnSystem } from "../systems/SpawnSystem";
import { SpeedSystem } from "../systems/SpeedSystem";
import { GameState } from "../types/GameState";
import { GameUI } from "../ui/GameUI.ts";
import { BaseScene } from "./BaseScene";

export class RaceScene extends BaseScene {
  public readonly scene: Scene;

  private car?: CarEntity;
  private road?: RoadEntity;
  private cameraController?: CameraController;
  private scoreSystem?: ScoreSystem;
  private spawnSystem?: SpawnSystem;
  private coinSystem?: CoinSystem;
  private readonly highScoreSystem = new HighScoreSystem();
  private readonly coinWallet = new CoinWallet();
  private readonly engine: Engine;
  private readonly updatables: Updatable[] = [];
  private readonly speedSystem = new SpeedSystem();
  private readonly gameStateManager = new GameStateManager();
  private readonly gameUI = new GameUI();

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

  private handleRestart = (event: KeyboardEvent): void => {
    if (event.key !== "r" && event.key !== "R") {
      return;
    }

    if (!this.gameStateManager.isGameOver()) {
      return;
    }

    window.location.reload();
  };

  constructor(engine: Engine) {
    super();

    this.engine = engine;
    this.scene = new Scene(this.engine);
  }

  public async create(): Promise<void> {
    this.createRoad();
    this.createCar();
    this.createLight();
    this.registerEventListeners();
    this.createCameraController();
    this.createSpawnSystem();
    this.createScoreSystem();
    this.createCoinSystem();
  }

  public update(deltaTime: number): void {
    if (this.gameStateManager.isGameOver()) {
      return;
    }

    for (const updatable of this.updatables) {
      updatable.update(deltaTime);
    }

    this.checkCollision();
    this.checkCoinCollision();

    this.gameUI.updateCoins(this.coinWallet.getCoins());
    this.gameUI.updateHighScore(this.highScoreSystem.getHighScore());

    if (this.scoreSystem) {
      const score = this.scoreSystem.getScore();

      if (this.spawnSystem) {
        this.spawnSystem.setScore(score);
      }

      if (this.spawnSystem) {
        const spawnInterval = Math.max(1.2, 2 - score * 0.02);

        this.spawnSystem.setSpawnInterval(spawnInterval);
      }

      this.speedSystem.setSpeed(15 + score * 0.5);

      console.log("Speed:", this.speedSystem.getSpeed());
    }

    if (this.scoreSystem) {
      this.gameUI.updateScore(this.scoreSystem.getScore());
    }
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keydown", this.handleRestart);

    this.car?.dispose();

    this.scene.dispose();
  }

  private checkCollision(): void {
    if (!this.car) {
      return;
    }

    if (!this.spawnSystem) {
      return;
    }

    const obstacles = this.spawnSystem.getObstacles();

    for (const obstacle of obstacles) {
      const sameLane = this.car.getCurrentLane() === obstacle.getCurrentLane();

      const obstacleZ = obstacle.getPosition().z;

      const checkCollisiumGameOver =
        sameLane && obstacleZ <= 1.5 && obstacleZ >= -1.5;

      if (checkCollisiumGameOver) {
        console.log("GAME OVER");

        this.gameStateManager.setState(GameState.GAME_OVER);
        this.gameUI.showGameOver();

        const score = this.scoreSystem?.getScore() ?? 0;

        const isNewRecord = this.highScoreSystem.update(score);

        if (isNewRecord) {
          console.log("NEW HIGH SCORE!");
        }

        return;
      }
    }
  }

  private createRoad(): void {
    this.road = new RoadEntity(this.scene, this.speedSystem);
    this.road.create();
    this.updatables.push(this.road);
  }

  private createCar(): void {
    this.car = new CarEntity(this.scene);
    this.car.create();
    this.updatables.push(this.car);
  }

  private createLight(): void {
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  private registerEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keydown", this.handleRestart);
  }

  private createCameraController(): void {
    this.cameraController = new CameraController(this.scene, this.car);
    this.updatables.push(this.cameraController);
  }

  private createSpawnSystem(): void {
    this.spawnSystem = new SpawnSystem(this.scene, this.speedSystem);
    this.updatables.push(this.spawnSystem);
  }

  private createScoreSystem(): void {
    this.scoreSystem = new ScoreSystem();
    this.updatables.push(this.scoreSystem);
  }

  private createCoinSystem(): void {
    this.coinSystem = new CoinSystem(this.scene, this.speedSystem);
    this.updatables.push(this.coinSystem);
  }

  private checkCoinCollision(): void {
    if (!this.car || !this.coinSystem) return;

    for (const coin of this.coinSystem.getCoins()) {
      const sameLane = this.car.getCurrentLane() === coin.getLane();

      const z = coin.getPosition()?.z ?? 999;

      const collision = sameLane && z <= 1.5 && z >= -1.5;

      if (collision) {
        coin.collect();
        this.coinWallet.add(1);
      }
    }
  }
}
