import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

import type { SpeedSystem } from "../systems/SpeedSystem";
import { BaseEntity } from "./BaseEntity";

export class RoadEntity extends BaseEntity {
  private segmentA?: Mesh;
  private segmentB?: Mesh;
  private laneA1?: Mesh;
  private laneA2?: Mesh;
  private laneB1?: Mesh;
  private laneB2?: Mesh;
  private readonly segmentLength = 50;
  private readonly speedSystem: SpeedSystem;

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);

    this.speedSystem = speedSystem;
  }

  public create(): void {
    this.segmentA = MeshBuilder.CreateGround(
      "roadA",
      {
        width: 8,
        height: this.segmentLength,
      },
      this.scene,
    );

    this.segmentB = MeshBuilder.CreateGround(
      "roadB",
      {
        width: 8,
        height: this.segmentLength,
      },
      this.scene,
    );

    this.segmentA.position = new Vector3(0, 0, 0);

    this.segmentB.position = new Vector3(0, 0, this.segmentLength);

    const laneMaterial = new StandardMaterial("laneMaterial", this.scene);

    laneMaterial.diffuseColor = Color3.White();

    this.laneA1 = this.createLaneMarker("laneA1");

    this.laneA2 = this.createLaneMarker("laneA2");

    this.laneB1 = this.createLaneMarker("laneB1");

    this.laneB2 = this.createLaneMarker("laneB2");

    this.laneA1.material = laneMaterial;

    this.laneA2.material = laneMaterial;

    this.laneB1.material = laneMaterial;

    this.laneB2.material = laneMaterial;

    this.laneA1.position = new Vector3(-1, 0.03, 0);

    this.laneA2.position = new Vector3(1, 0.03, 0);

    this.laneB1.position = new Vector3(-1, 0.03, this.segmentLength);

    this.laneB2.position = new Vector3(1, 0.03, this.segmentLength);
  }
  public update(deltaTime: number): void {
    this.moveSegment(this.segmentA, deltaTime);

    this.moveSegment(this.segmentB, deltaTime);

    this.moveSegment(this.laneA1, deltaTime);

    this.moveSegment(this.laneA2, deltaTime);

    this.moveSegment(this.laneB1, deltaTime);

    this.moveSegment(this.laneB2, deltaTime);
  }

  public dispose(): void {
    this.segmentA?.dispose();
    this.segmentB?.dispose();

    this.laneA1?.dispose();
    this.laneA2?.dispose();

    this.laneB1?.dispose();
    this.laneB2?.dispose();
  }

  private moveSegment(segment: Mesh | undefined, deltaTime: number): void {
    if (!segment) {
      return;
    }

    segment.position.z -= this.speedSystem.getSpeed() * deltaTime;

    if (segment.position.z < -this.segmentLength) {
      segment.position.z += this.segmentLength * 2;
    }
  }

  private createLaneMarker(name: string): Mesh {
    const marker = MeshBuilder.CreateBox(
      name,
      {
        width: 0.1,
        height: 0.05,
        depth: this.segmentLength,
      },
      this.scene,
    );

    return marker;
  }
}
