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

  // Gerenciamento de segmentos da estrada infinita
  private segments: Mesh[] = [];
  private readonly segmentLength = 40; // Comprimento de cada bloco de estrada
  private readonly totalSegments = 4; // Blocos ativos na tela ao mesmo tempo
  private readonly roadWidth = 7.0; // Largura utilizável para as 3 pistas

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);
    this.speedSystem = speedSystem;
  }

  public create(): void {
    // Cria os blocos iniciais posicionados um na frente do outro no eixo Z
    for (let i = 0; i < this.totalSegments; i++) {
      const segment = this.createRoadSegment(`road_seg_${i}`);
      segment.position.z = i * this.segmentLength;
      this.segments.push(segment);
    }
  }

  private createRoadSegment(name: string): Mesh {
    // Nó container pai do segmento
    const segmentParent = new Mesh(name, this.scene);

    // 1. O Asfalto (Base)
    const roadMat = new StandardMaterial(`${name}_roadMat`, this.scene);
    roadMat.diffuseColor = new Color3(0.22, 0.18, 0.26);
    roadMat.specularColor = Color3.Black();

    const roadMesh = MeshBuilder.CreatePlane(
      `${name}_asphalt`,
      {
        width: this.roadWidth,
        height: this.segmentLength,
      },
      this.scene,
    );
    roadMesh.rotation.x = Math.PI / 2;
    roadMesh.material = roadMat;
    roadMesh.parent = segmentParent;

    // 2. As Calçadas Laterais Elevadas
    const sidewalkMat = new StandardMaterial(`${name}_sidewalkMat`, this.scene);
    sidewalkMat.diffuseColor = new Color3(0.48, 0.44, 0.52);
    sidewalkMat.specularColor = Color3.Black();

    const sidewalkW = 2.5;
    const sidewalkH = 0.2;

    // Calçada Esquerda
    const leftSidewalk = MeshBuilder.CreateBox(
      `${name}_leftWalk`,
      {
        width: sidewalkW,
        height: sidewalkH,
        depth: this.segmentLength,
      },
      this.scene,
    );
    leftSidewalk.position.x = -(this.roadWidth / 2 + sidewalkW / 2);
    leftSidewalk.position.y = sidewalkH / 2;
    leftSidewalk.material = sidewalkMat;
    leftSidewalk.parent = segmentParent;

    // Calçada Direita
    const rightSidewalk = MeshBuilder.CreateBox(
      `${name}_rightWalk`,
      {
        width: sidewalkW,
        height: sidewalkH,
        depth: this.segmentLength,
      },
      this.scene,
    );
    rightSidewalk.position.x = this.roadWidth / 2 + sidewalkW / 2;
    rightSidewalk.position.y = sidewalkH / 2;
    rightSidewalk.material = sidewalkMat;
    rightSidewalk.parent = segmentParent;

    // ==========================================
    // NOVA PARTE: NOVO GRAMADO LATERAL (ÁRVORES/PRÉDIOS)
    // ==========================================
    const grassMat = new StandardMaterial(`${name}_grassMat`, this.scene);
    // Um tom de verde escuro/oliva que combina com o estilo minimalista e por do sol
    grassMat.diffuseColor = new Color3(0.15, 0.35, 0.15);
    grassMat.specularColor = Color3.Black();

    const grassWidth = 50.0; // Largura grande o suficiente para cobrir até onde a câmera enxerga nas laterais

    // Gramado Esquerdo (Fica logo após a calçada esquerda)
    const leftGrass = MeshBuilder.CreatePlane(
      `${name}_leftGrass`,
      {
        width: grassWidth,
        height: this.segmentLength,
      },
      this.scene,
    );
    leftGrass.rotation.x = Math.PI / 2;
    // Posiciona exatamente colado na borda externa da calçada esquerda
    leftGrass.position.x = -(this.roadWidth / 2 + sidewalkW + grassWidth / 2);
    leftGrass.position.y = 0.01; // No nível do asfalto, criando o degrau com a calçada
    leftGrass.material = grassMat;
    leftGrass.parent = segmentParent;

    // Gramado Direito (Fica logo após a calçada direita)
    const rightGrass = MeshBuilder.CreatePlane(
      `${name}_rightGrass`,
      {
        width: grassWidth,
        height: this.segmentLength,
      },
      this.scene,
    );
    rightGrass.rotation.x = Math.PI / 2;
    // Posiciona exatamente colado na borda externa da calçada direita
    rightGrass.position.x = this.roadWidth / 2 + sidewalkW + grassWidth / 2;
    rightGrass.position.y = 0.01;
    rightGrass.material = grassMat;
    rightGrass.parent = segmentParent;
    // ==========================================

    // 3. Linhas Divisórias de Pista
    const lineMat = new StandardMaterial(`${name}_lineMat`, this.scene);
    lineMat.diffuseColor = new Color3(0.9, 0.9, 0.95);
    lineMat.specularColor = Color3.Black();

    const linePositionsX = [-1.0, 1.0];
    linePositionsX.forEach((xPos, idx) => {
      const line = MeshBuilder.CreatePlane(
        `${name}_line_${idx}`,
        {
          width: 0.12,
          height: this.segmentLength,
        },
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

  /**
   * Move os segmentos continuamente e faz a reciclagem infinita
   */
  public update(deltaTime: number): void {
    const speed = this.speedSystem.getSpeed();
    const movement = speed * deltaTime;

    for (const segment of this.segments) {
      // Move a estrada no sentido oposto ao movimento do carro (ilusão de corrida)
      segment.position.z -= movement;

      // Se o bloco passou completamente para trás da visão da câmera
      if (segment.position.z < -this.segmentLength) {
        // Encontra a posição Z atual do bloco mais distante na frente
        let maxZ = 0;
        for (const s of this.segments) {
          if (s.position.z > maxZ) {
            maxZ = s.position.z;
          }
        }
        // Reposiciona o bloco que ficou para trás na ponta final da fila (Padrão Recycle)
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
