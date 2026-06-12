import {
  Color3,
  Engine,
  HemisphericLight,
  Layer,
  Scene,
  Vector3,
} from "@babylonjs/core";

import "@babylonjs/loaders";
import { CameraController } from "../controllers/CameraController";
import { CarEntity } from "../entities/CarEntity";
import { RoadEntity } from "../entities/RoadEntity";
import type { Updatable } from "../interfaces/Updatable";
import { GameStateManager } from "../managers/GameStateManager";
import { CitySystem } from "../systems/CitySystem.ts";
import { CoinSystem } from "../systems/CoinSystem.ts";
import { CoinWallet } from "../systems/CoinWallet.ts";
import { HighScoreSystem } from "../systems/HighScoreSystem.ts";
import { ScoreSystem } from "../systems/ScoreSystem";
import { SpawnSystem } from "../systems/SpawnSystem";
import { SpeedSystem } from "../systems/SpeedSystem";
import { GameState } from "../types/GameState";
import { GameUI } from "../ui/GameUI.ts";
import { LoadingScreen } from "../ui/LoadingScreen.ts";
import { BaseScene } from "./BaseScene";

export class RaceScene extends BaseScene {
  public readonly scene: Scene;

  private car?: CarEntity;
  private road?: RoadEntity;
  private cameraController?: CameraController;
  private scoreSystem?: ScoreSystem;
  private spawnSystem?: SpawnSystem;
  private coinSystem?: CoinSystem;
  private citySystem!: CitySystem;

  private readonly highScoreSystem = new HighScoreSystem();
  private readonly coinWallet = new CoinWallet();

  private readonly engine: Engine;
  private readonly updatables: Updatable[] = [];
  private readonly speedSystem = new SpeedSystem();
  private readonly gameStateManager = new GameStateManager();
  private readonly gameUI = new GameUI();
  private readonly loadingScreen = new LoadingScreen();

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.scene = new Scene(this.engine);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.car) return;
    if (!this.gameStateManager.isPlaying()) return;

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

  public async create(): Promise<void> {
    this.loadingScreen.mount();
    this.loadingScreen.setProgress(0.05);

    this.createEnvironment();
    this.loadingScreen.setProgress(0.15);

    this.createRoad();
    this.loadingScreen.setProgress(0.30);

    this.createCar();
    this.loadingScreen.setProgress(0.40);

    await this.createCitySystem();
    this.loadingScreen.setProgress(0.75);

    this.registerEventListeners();
    this.createCameraController();
    this.createSpawnSystem();
    this.createScoreSystem();
    this.createCoinSystem();
    this.loadingScreen.setProgress(1.0);

    await this.wait(300);
    await this.loadingScreen.dismiss();

    this.gameStateManager.setState(GameState.MENU);
    this.gameUI.showMenu();
    this.gameUI.bindMenuEvents(() => this.startGame());
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── GAME FLOW ─────────────────────────────────────────────────────────

  public update(deltaTime: number): void {
    if (this.gameStateManager.isMenu() || this.gameStateManager.isGameOver()) {
      this.gameUI.updateCoins(this.coinWallet.getCoins());
      this.gameUI.updateHighScore(this.highScoreSystem.getHighScore());
      return;
    }

    for (const updatable of this.updatables) {
      updatable.update(deltaTime);
    }

    this.citySystem.update(this.speedSystem.getSpeed() * deltaTime);
    this.checkCollision();
    this.checkCoinCollision();

    if (this.scoreSystem) {
      const score = this.scoreSystem.getScore();
      this.gameUI.updateScore(score);

      if (this.spawnSystem) {
        this.spawnSystem.setScore(score);
        this.spawnSystem.setSpawnInterval(Math.max(1.2, 2 - score * 0.02));
      }

      this.speedSystem.setSpeed(15 + score * 0.5);
      this.gameUI.updateHighScore(this.highScoreSystem.getHighScore());
    }

    this.gameUI.updateCoins(this.coinWallet.getCoins());
  }

  private startGame(): void {
    this.gameStateManager.setState(GameState.PLAYING);
    this.gameUI.hideMenu();
  }

  private gameOver(): void {
    this.gameStateManager.setState(GameState.GAME_OVER);
    const score = this.scoreSystem?.getScore() ?? 0;
    this.highScoreSystem.update(score);
    // Passa o score para o GameUI verificar se entra no ranking
    this.gameUI.showGameOver(
      score,
      () => this.resetGame(false),
      () => this.resetGame(true),
    );
  }

  private resetGame(goToMenu: boolean): void {
    this.scoreSystem?.reset?.();
    this.spawnSystem?.reset?.();
    this.coinSystem?.reset?.();
    this.speedSystem.setSpeed(15);
    this.car?.reset();
    this.cameraController?.reset();

    if (goToMenu) {
      this.gameStateManager.setState(GameState.MENU);
      this.gameUI.showMenu();
      this.gameUI.bindMenuEvents(() => this.startGame());
    } else {
      this.gameStateManager.setState(GameState.PLAYING);
      this.gameUI.setState("PLAYING");
    }
  }

  // ── COLISÕES ──────────────────────────────────────────────────────────

  private checkCollision(): void {
    if (!this.car || !this.spawnSystem) return;
    for (const obstacle of this.spawnSystem.getObstacles()) {
      const sameLane = this.car.getCurrentLane() === obstacle.getCurrentLane();
      const z = obstacle.getPosition().z;
      if (sameLane && z <= 1.5 && z >= -1.5) { this.gameOver(); return; }
    }
  }

  private checkCoinCollision(): void {
    if (!this.car || !this.coinSystem) return;
    for (const coin of this.coinSystem.getCoins()) {
      const sameLane = this.car.getCurrentLane() === coin.getLane();
      const z = coin.getPosition()?.z ?? 999;
      if (sameLane && z <= 1.5 && z >= -1.5) {
        coin.collect();
        this.coinWallet.add(1);
      }
    }
  }

  // ── CRIAÇÃO ───────────────────────────────────────────────────────────

  private createEnvironment(): void {
    const sunsetLayer = new Layer(
      "sunsetBackground",
      "models/Textures/sky_sunset.png",
      this.scene,
      true,
    );
    sunsetLayer.offset.y = 0.9;

    const light = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), this.scene);
    light.diffuse = Color3.White();
    light.groundColor = new Color3(0.2, 0.2, 0.2);
    this.scene.fogMode = Scene.FOGMODE_NONE;
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

  private registerEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  private createCameraController(): void {
    this.cameraController = new CameraController(this.scene, this.car!);
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

  private async createCitySystem(): Promise<void> {
    this.citySystem = new CitySystem(this.scene);
    await this.citySystem.initialize();
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.car?.dispose();
    this.scene.dispose();
  }
}
