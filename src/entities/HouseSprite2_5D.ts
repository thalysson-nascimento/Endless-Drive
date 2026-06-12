import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";

export class HouseSprite2_5D {
  private mesh!: Mesh;
  private readonly scene: Scene;

  private static readonly TEXTURE_PATH = "/models/assets/house-a.2-5d.png";
  private static sharedMaterial: StandardMaterial | null = null;

  // Proporcao real da imagem: 512 x 770 px
  private static readonly ASPECT_RATIO = 512 / 770;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public create(position: Vector3, width = 7): void {
    const height = width / HouseSprite2_5D.ASPECT_RATIO; // ~10.5

    this.mesh = MeshBuilder.CreatePlane(
      "house-sprite-2_5d",
      { width, height, sideOrientation: Mesh.DOUBLESIDE },
      this.scene,
    );

    // position.y ja deve ser o centro do plano (base em y=0 => centro em height/2)
    this.mesh.position = position.clone();

    // Sem rotation.y: plano ja nasce voltado para -Z (direcao da camera)
    // rotation.y = 0 => face frontal visivel a partir de -Z
    this.mesh.rotation.y = 0;

    this.mesh.material = this.getOrCreateMaterial();
    this.mesh.isPickable = false;
  }

  private getOrCreateMaterial(): StandardMaterial {
    if (HouseSprite2_5D.sharedMaterial) {
      return HouseSprite2_5D.sharedMaterial;
    }

    const mat = new StandardMaterial("house-sprite-mat", this.scene);

    const tex = new Texture(
      HouseSprite2_5D.TEXTURE_PATH,
      this.scene,
      false, // noMipmap
      true,  // invertY = true (padrao OpenGL/BabylonJS)
      Texture.TRILINEAR_SAMPLINGMODE,
    );

    tex.hasAlpha = true;

    // Corrige o espelhamento horizontal sem girar o mesh:
    // uScale = -1 inverte o eixo U da textura
    tex.uScale = -1;

    mat.diffuseTexture = tex;
    mat.useAlphaFromDiffuseTexture = true;

    // emissiveColor branco: cancela o efeito da luz da cena,
    // preservando as cores exatas do PNG original
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.specularColor = new Color3(0, 0, 0);
    mat.backFaceCulling = false;
    mat.transparencyMode = StandardMaterial.MATERIAL_ALPHABLEND;

    HouseSprite2_5D.sharedMaterial = mat;
    return mat;
  }

  public setPositionZ(z: number): void {
    this.mesh.position.z = z;
  }

  public get positionZ(): number {
    return this.mesh.position.z;
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
