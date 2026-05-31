import { Scene } from "@babylonjs/core";
import { CoinEntity } from "../entities/CoinEntity";
import type { SpeedSystem } from "./SpeedSystem";

export class CoinSystem {
  private coins: CoinEntity[] = [];
  private elapsedTime = 0;
  private spawnInterval = 3;
  private readonly scene: Scene;
  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    this.scene = scene;
    this.speedSystem = speedSystem;
  }

  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= this.spawnInterval) {
      this.spawnCoin();
      this.elapsedTime = 0;
    }

    for (const coin of this.coins) {
      coin.update(deltaTime);
    }

    this.coins = this.coins.filter((coin) => coin.isActive());
  }

  private spawnCoin(): void {
    const coin = new CoinEntity(this.scene, this.speedSystem);

    coin.create();

    this.coins.push(coin);
  }

  getCoins(): CoinEntity[] {
    return this.coins;
  }
}
