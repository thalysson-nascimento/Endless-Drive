import type { Updatable } from "../interfaces/Updatable";

export class ScoreSystem implements Updatable {
  private score = 0;

  private elapsedTime = 0;

  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= 1) {
      this.score++;

      this.elapsedTime = 0;

      console.log("Score:", this.score);
    }
  }

  getScore(): number {
    return this.score;
  }
}
