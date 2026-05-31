export class CoinWallet {
  private coins = 0;

  private readonly STORAGE_KEY = "game_coins";

  constructor() {
    this.load();
  }

  add(amount: number): void {
    this.coins += amount;
    this.save();
  }

  getCoins(): number {
    return this.coins;
  }

  reset(): void {
    this.coins = 0;
    this.save();
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.coins));
  }

  private load(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      this.coins = JSON.parse(saved);
    }
  }
}
