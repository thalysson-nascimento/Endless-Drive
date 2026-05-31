export class HighScoreSystem {
  private highScore = 0;

  private readonly STORAGE_KEY = "game_high_score";

  constructor() {
    this.load();
  }

  getHighScore(): number {
    return this.highScore;
  }

  update(score: number): boolean {
    if (score > this.highScore) {
      this.highScore = score;
      this.save();
      return true; // novo recorde
    }

    return false;
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.highScore));
  }

  private load(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      this.highScore = JSON.parse(saved);
    }
  }
}
