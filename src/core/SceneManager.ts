import { BaseScene } from "../scenes/BaseScene";

export class SceneManager {
  private currentScene: BaseScene | null = null;

  public async changeScene(scene: BaseScene): Promise<void> {
    if (this.currentScene) {
      this.currentScene.dispose();
    }

    this.currentScene = scene;

    await this.currentScene.create();
  }

  public update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  public getScene(): BaseScene | null {
    return this.currentScene;
  }
}
