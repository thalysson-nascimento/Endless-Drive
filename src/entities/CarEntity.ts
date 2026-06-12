import {
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class CarEntity extends BaseEntity {
  private root?: TransformNode;
  private currentLane = 1;
  private readonly lanePositions = [-2, 0, 2];

  public reset(): void {
    this.currentLane = 1;
    this.updateLanePosition();
  }

  public create(): void {
    this.root = new TransformNode("carRoot", this.scene);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TAMANHO DO CARRO — mexa aqui para redimensionar
    //   width  = largura do sprite (eixo X, lateral)
    //   height = altura do sprite (eixo Y, vertical)
    // Mantenha a proporcao original do PNG para nao distorcer.
    // Proporcao do car-a.2-5d.png: width / height ~ 0.857
    //
    //   Menor  -> width: 1.4,  height: 1.8
    //   Medio  -> width: 1.8,  height: 2.2  << atual
    //   Grande -> width: 3.0,  height: 3.5
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const width = 1.5;
    const height = 1.9;

    const plane = MeshBuilder.CreatePlane(
      "carSprite",
      { width, height, sideOrientation: Mesh.DOUBLESIDE },
      this.scene,
    );

    // Centro vertical: base do carro em y=0
    plane.position.y = height / 2;
    plane.parent = this.root;

    plane.rotation.y = 0;

    const mat = new StandardMaterial("carSpriteMat", this.scene);

    const tex = new Texture(
      "/models/assets/car-a.2-5d.png",
      this.scene,
      false, // noMipmap
      true, // invertY
      Texture.TRILINEAR_SAMPLINGMODE,
    );

    tex.hasAlpha = true;

    mat.diffuseTexture = tex;
    mat.useAlphaFromDiffuseTexture = true;

    // emissiveColor branco: ignora a luz da cena, mostra as cores exatas do PNG
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.specularColor = new Color3(0, 0, 0);
    mat.backFaceCulling = false;
    mat.transparencyMode = StandardMaterial.MATERIAL_ALPHABLEND;

    plane.material = mat;
    plane.isPickable = false;

    this.updateLanePosition();
  }

  public update(_deltaTime: number): void {}

  public dispose(): void {
    this.root?.dispose();
  }

  public moveLeft(): void {
    if (this.currentLane <= 0) return;
    this.currentLane--;
    this.updateLanePosition();
  }

  public moveRight(): void {
    if (this.currentLane >= 2) return;
    this.currentLane++;
    this.updateLanePosition();
  }

  public getPosition(): Vector3 {
    if (!this.root) return Vector3.Zero();
    return this.root.position;
  }

  public getCurrentLane(): number {
    return this.currentLane;
  }

  private updateLanePosition(): void {
    if (!this.root) return;
    this.root.position.x = this.lanePositions[this.currentLane];
  }
}
