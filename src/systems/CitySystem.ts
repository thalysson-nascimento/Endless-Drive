import { AbstractMesh, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { HouseSprite2_5D } from "../entities/HouseSprite2_5D";

export class CitySystem {
  private readonly scene: Scene;

  private templates: AbstractMesh[] = [];
  private buildings: AbstractMesh[] = [];
  private houseSprites: HouseSprite2_5D[] = [];

  private readonly spacing = 25;
  private readonly leftX = -10;
  private readonly rightX = 10;
  private readonly recyclePoint = -30;

  // width=7 => height = 7 / (512/770) = ~10.55
  // Para base da casa ficar em y=0: spriteY = height/2 = ~5.3
  // spriteX proximo a borda esquerda da pista (leftX = -10)
  private readonly spriteWidth = 7;
  private readonly spriteX = -8;
  private readonly spriteY = 5.3; // centro do plano; base em y=0 (nivel do chao)
  private readonly spriteSpacing = 28;
  private readonly spritePoolSize = 8;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public async initialize(): Promise<void> {
    await this.loadTemplates();
    this.createBuildings();
    this.createHouseSprites();
  }

  private async loadTemplates(): Promise<void> {
    const files = [
      "building-type-a.glb",
      "building-type-b.glb",
      "building-type-c.glb",
      "building-type-d.glb",
    ];

    for (const file of files) {
      const result = await SceneLoader.ImportMeshAsync(
        "",
        "/models/",
        file,
        this.scene,
      );

      const building = result.meshes[1];
      building.setEnabled(false);
      this.templates.push(building);
    }
  }

  private createBuildings(): void {
    let z = 0;

    for (let i = 0; i < 20; i++) {
      const leftTemplate = this.templates[i % this.templates.length];
      const rightTemplate = this.templates[(i + 1) % this.templates.length];

      const leftBuilding = leftTemplate.clone(`left-building-${i}`, null);
      const rightBuilding = rightTemplate.clone(`right-building-${i}`, null);

      if (!leftBuilding || !rightBuilding) continue;

      leftBuilding.setEnabled(true);
      rightBuilding.setEnabled(true);

      leftBuilding.position = new Vector3(this.leftX, 1, z);
      rightBuilding.position = new Vector3(this.rightX, 1, z);

      leftBuilding.scaling = new Vector3(6, 6, 6);
      rightBuilding.scaling = new Vector3(6, 6, 6);

      leftBuilding.rotation.y = -Math.PI / 2;
      rightBuilding.rotation.y = Math.PI / 2;

      this.buildings.push(leftBuilding);
      this.buildings.push(rightBuilding);

      z += this.spacing;
    }
  }

  private createHouseSprites(): void {
    for (let i = 0; i < this.spritePoolSize; i++) {
      const sprite = new HouseSprite2_5D(this.scene);

      sprite.create(
        new Vector3(this.spriteX, this.spriteY, i * this.spriteSpacing),
        this.spriteWidth,
      );

      this.houseSprites.push(sprite);
    }
  }

  public update(speed: number): void {
    this.updateBuildings(speed);
    this.updateHouseSprites(speed);
  }

  private updateBuildings(speed: number): void {
    let highestZ = 0;

    for (const building of this.buildings) {
      if (building.position.z > highestZ) highestZ = building.position.z;
    }

    for (const building of this.buildings) {
      building.position.z -= speed;

      if (building.position.z < this.recyclePoint) {
        building.position.z = highestZ + this.spacing;
      }
    }
  }

  private updateHouseSprites(speed: number): void {
    let highestSpriteZ = 0;

    for (const sprite of this.houseSprites) {
      if (sprite.positionZ > highestSpriteZ) highestSpriteZ = sprite.positionZ;
    }

    for (const sprite of this.houseSprites) {
      sprite.setPositionZ(sprite.positionZ - speed);

      if (sprite.positionZ < this.recyclePoint) {
        sprite.setPositionZ(highestSpriteZ + this.spriteSpacing);
      }
    }
  }
}
