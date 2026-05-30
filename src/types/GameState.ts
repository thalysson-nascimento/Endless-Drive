export const GameState = {
  MENU: "MENU",
  RUNNING: "RUNNING",
  GAME_OVER: "GAME_OVER",
  PLAYING: "PLAYING",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];
