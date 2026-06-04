import { FreeCamera, Scene, Vector3 } from "@babylonjs/core";

import { CarEntity } from "../entities/CarEntity";
import type { Updatable } from "../interfaces/Updatable";

export class CameraController implements Updatable {
  private readonly camera: FreeCamera;
  private readonly car: CarEntity;

  // Valores de offset calculados com base na imagem do Dreamina
  private readonly heightOffset = 4.0; // Altura da câmera (Eixo Y)
  private readonly distanceOffset = -8; // Distância atrás do carro (Eixo Z)
  private readonly targetAheadDistance = 25.0; // Distância do ponto focal no horizonte (Eixo Z)
  private readonly targetHeight = 1.0; // Altura do ponto focal no horizonte (Eixo Y)

  constructor(scene: Scene, car: CarEntity) {
    this.car = car;

    // Inicializa a câmera na posição matemática traseira ideal
    this.camera = new FreeCamera(
      "camera",
      new Vector3(0, this.heightOffset, this.distanceOffset),
      scene,
    );

    // Abre o Campo de Visão (Field of View) para dar efeito de lente grande-angular
    // Valores por volta de 0.9 radianos geram a perspectiva idêntica à do modelo enviado
    this.camera.fov = 0.9;
  }

  public getCamera(): FreeCamera {
    return this.camera;
  }

  public update(_deltaTime: number): void {
    const carPosition = this.car.getPosition();

    // Interpolação Linear (Lerp) para suavizar a transição lateral (Eixo X) ao mudar de pista
    // 0.15 determina a velocidade da resposta física da câmera (quanto menor, mais suave)
    const targetX = carPosition.x;
    this.camera.position.x =
      this.camera.position.x + (targetX - this.camera.position.x) * 0.15;

    // Vincula rigidamente os eixos Y e Z ao progresso contínuo do carro na pista infinita
    this.camera.position.y = carPosition.y + this.heightOffset;
    this.camera.position.z = carPosition.z + this.distanceOffset;

    // Faz a câmera olhar para um ponto fixo projetado à frente no horizonte (Ponto de Fuga)
    // Acompanha o eixo X suavizado para manter o alinhamento estético centralizado
    const lookAtTarget = new Vector3(
      this.camera.position.x,
      carPosition.y + this.targetHeight,
      carPosition.z + this.targetAheadDistance,
    );

    this.camera.setTarget(lookAtTarget);
  }

  public reset(): void {
    this.camera.position.x = 0;
    this.camera.position.y = this.heightOffset;
    this.camera.position.z = this.distanceOffset;

    this.camera.setTarget(
      new Vector3(0, this.targetHeight, this.targetAheadDistance),
    );
  }
}
