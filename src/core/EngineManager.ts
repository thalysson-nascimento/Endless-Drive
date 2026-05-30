import { Engine } from "@babylonjs/core";

export class EngineManager {
  public readonly engine: Engine;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
  }

  public resize(): void {
    this.engine.resize();
  }
}
