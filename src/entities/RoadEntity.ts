import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";
import type { SpeedSystem } from "../systems/SpeedSystem";
import { BaseEntity } from "./BaseEntity";

export class RoadEntity extends BaseEntity {
  private readonly speedSystem: SpeedSystem;

  private segments: Mesh[] = [];

  // Segmento maior elimina a juncao visivel — menos emendas na tela
  private readonly segmentLength = 60;

  // 8 segmentos x 60 = 480 unidades — cobre os predios (20 x 25 = 500)
  private readonly totalSegments = 8;

  private readonly roadWidth = 7.0;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);
    this.speedSystem = speedSystem;
  }

  public create(): void {
    for (let i = 0; i < this.totalSegments; i++) {
      const segment = this.createRoadSegment(`road_seg_${i}`);
      // Distribui os segmentos de 0 ate o final, cobrindo toda a cidade
      segment.position.z = i * this.segmentLength;
      this.segments.push(segment);
    }
  }

  private createRoadSegment(name: string): Mesh {
    const segmentParent = new Mesh(name, this.scene);

    // 1. Asfalto
    const roadMat = new StandardMaterial(`${name}_roadMat`, this.scene);
    roadMat.diffuseColor = new Color3(0.22, 0.18, 0.26);
    roadMat.specularColor = Color3.Black();

    const roadMesh = MeshBuilder.CreatePlane(
      `${name}_asphalt`,
      { width: this.roadWidth, height: this.segmentLength },
      this.scene,
    );
    roadMesh.rotation.x = Math.PI / 2;
    roadMesh.material = roadMat;
    roadMesh.parent = segmentParent;

    // 2. Calcadas elevadas
    const sidewalkMat = new StandardMaterial(`${name}_sidewalkMat`, this.scene);
    sidewalkMat.diffuseColor = new Color3(0.48, 0.44, 0.52);
    sidewalkMat.specularColor = Color3.Black();

    const sidewalkW = 2.5;
    const sidewalkH = 0.2;

    const leftSidewalk = MeshBuilder.CreateBox(
      `${name}_leftWalk`,
      { width: sidewalkW, height: sidewalkH, depth: this.segmentLength },
      this.scene,
    );
    leftSidewalk.position.x = -(this.roadWidth / 2 + sidewalkW / 2);
    leftSidewalk.position.y = sidewalkH / 2;
    leftSidewalk.material = sidewalkMat;
    leftSidewalk.parent = segmentParent;

    const rightSidewalk = MeshBuilder.CreateBox(
      `${name}_rightWalk`,
      { width: sidewalkW, height: sidewalkH, depth: this.segmentLength },
      this.scene,
    );
    rightSidewalk.position.x = this.roadWidth / 2 + sidewalkW / 2;
    rightSidewalk.position.y = sidewalkH / 2;
    rightSidewalk.material = sidewalkMat;
    rightSidewalk.parent = segmentParent;

    // 3. Gramado lateral — largura generosa para cobrir ate onde os predios estao
    const grassMat = new StandardMaterial(`${name}_grassMat`, this.scene);
    grassMat.diffuseColor = new Color3(0.15, 0.35, 0.15);
    grassMat.specularColor = Color3.Black();

    // 120 unidades de largura: cobre os predios em x=-10 e x=10 com folga
    const grassWidth = 120.0;

    const leftGrass = MeshBuilder.CreatePlane(
      `${name}_leftGrass`,
      { width: grassWidth, height: this.segmentLength },
      this.scene,
    );
    leftGrass.rotation.x = Math.PI / 2;
    leftGrass.position.x = -(this.roadWidth / 2 + sidewalkW + grassWidth / 2);
    leftGrass.position.y = 0.01;
    leftGrass.material = grassMat;
    leftGrass.parent = segmentParent;

    const rightGrass = MeshBuilder.CreatePlane(
      `${name}_rightGrass`,
      { width: grassWidth, height: this.segmentLength },
      this.scene,
    );
    rightGrass.rotation.x = Math.PI / 2;
    rightGrass.position.x = this.roadWidth / 2 + sidewalkW + grassWidth / 2;
    rightGrass.position.y = 0.01;
    rightGrass.material = grassMat;
    rightGrass.parent = segmentParent;

    // 4. Linhas divisorias de pista
    const lineMat = new StandardMaterial(`${name}_lineMat`, this.scene);
    lineMat.diffuseColor = new Color3(0.9, 0.9, 0.95);
    lineMat.specularColor = Color3.Black();

    [-1.0, 1.0].forEach((xPos, idx) => {
      const line = MeshBuilder.CreatePlane(
        `${name}_line_${idx}`,
        { width: 0.12, height: this.segmentLength },
        this.scene,
      );
      line.rotation.x = Math.PI / 2;
      line.position.x = xPos;
      line.position.y = 0.01;
      line.material = lineMat;
      line.parent = segmentParent;
    });

    return segmentParent;
  }

  public update(deltaTime: number): void {
    const speed = this.speedSystem.getSpeed();
    const movement = speed * deltaTime;

    for (const segment of this.segments) {
      segment.position.z -= movement;

      // Recicla quando o segmento sai completamente para tras da camera
      if (segment.position.z < -this.segmentLength) {
        let maxZ = -Infinity;
        for (const s of this.segments) {
          if (s.position.z > maxZ) maxZ = s.position.z;
        }
        segment.position.z = maxZ + this.segmentLength;
      }
    }
  }

  public dispose(): void {
    for (const segment of this.segments) {
      segment.dispose(false, true);
    }
    this.segments = [];
  }
}
