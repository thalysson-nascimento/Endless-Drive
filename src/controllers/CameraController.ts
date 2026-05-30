import { FreeCamera, Scene, Vector3 } from "@babylonjs/core";

import { CarEntity } from "../entities/CarEntity";
import type { Updatable } from "../interfaces/Updatable";

export class CameraController implements Updatable {
  private readonly camera: FreeCamera;
  private readonly car: CarEntity;

  constructor(scene: Scene, car: CarEntity) {
    this.car = car;

    this.camera = new FreeCamera("camera", new Vector3(0, 6, -12), scene);
  }

  public getCamera(): FreeCamera {
    return this.camera;
  }

  public update(_deltaTime: number): void {
    const carPosition = this.car.getPosition();

    this.camera.position.x = carPosition.x;

    this.camera.setTarget(
      new Vector3(carPosition.x, carPosition.y, carPosition.z + 10),
    );
  }
}
