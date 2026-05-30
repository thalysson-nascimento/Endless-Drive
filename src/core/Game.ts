import { RaceScene } from "../scenes/RaceScene";
import { AssetManager } from "./AssetManager";
import { EngineManager } from "./EngineManager";
import { SceneManager } from "./SceneManager";

export class Game {
  private readonly engineManager: EngineManager;
  private readonly sceneManager: SceneManager;
  private readonly assetManager: AssetManager;

  constructor(canvas: HTMLCanvasElement) {
    this.engineManager = new EngineManager(canvas);

    this.sceneManager = new SceneManager();

    this.assetManager = new AssetManager();
  }

  public async start(): Promise<void> {
    await this.assetManager.load();

    await this.sceneManager.changeScene(
      new RaceScene(this.engineManager.engine),
    );

    this.engineManager.engine.runRenderLoop(() => {
      const deltaTime = this.engineManager.engine.getDeltaTime() / 1000;

      this.sceneManager.update(deltaTime);

      const currentScene = this.sceneManager.getScene();

      currentScene?.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engineManager.resize();
    });
  }
}
