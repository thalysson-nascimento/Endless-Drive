import { GameState } from "../types/GameState";

export class GameStateManager {
  private currentState: GameState = GameState.MENU;

  public getState(): GameState {
    return this.currentState;
  }

  public setState(state: GameState): void {
    this.currentState = state;
  }

  public isMenu(): boolean {
    return this.currentState === GameState.MENU;
  }

  public isPlaying(): boolean {
    return this.currentState === GameState.PLAYING;
  }

  public isGameOver(): boolean {
    return this.currentState === GameState.GAME_OVER;
  }
}
