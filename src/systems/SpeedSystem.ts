export class SpeedSystem {
  private speed = 15;

  getSpeed(): number {
    return this.speed;
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }
}
