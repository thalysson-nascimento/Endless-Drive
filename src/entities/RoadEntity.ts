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
  private readonly segmentLength = 50;
  private readonly segmentCount = 3;

  private readonly speedSystem: SpeedSystem;

  private roadSegments: Mesh[] = [];
  private grassSegments: Mesh[] = [];
  private laneMarkers: Mesh[] = [];

  constructor(scene: Scene, speedSystem: SpeedSystem) {
    super(scene);

    this.speedSystem = speedSystem;
  }

  public create(): void {
    const roadMaterial = new StandardMaterial("roadMaterial", this.scene);

    roadMaterial.diffuseColor = new Color3(0.15, 0.15, 0.15);

    const grassMaterial = new StandardMaterial("grassMaterial", this.scene);

    grassMaterial.diffuseColor = new Color3(0.1, 0.5, 0.1);

    const laneMaterial = new StandardMaterial("laneMaterial", this.scene);

    laneMaterial.diffuseColor = Color3.White();

    for (let i = 0; i < this.segmentCount; i++) {
      const zPosition = i * this.segmentLength;

      // -------------------------
      // ROAD
      // -------------------------

      const road = MeshBuilder.CreateGround(
        `road_${i}`,
        {
          width: 10,
          height: this.segmentLength,
        },
        this.scene,
      );

      road.material = roadMaterial;

      road.position = new Vector3(0, 0, zPosition);

      this.roadSegments.push(road);

      // -------------------------
      // GRASS LEFT
      // -------------------------

      const grassLeft = MeshBuilder.CreateGround(
        `grassLeft_${i}`,
        {
          width: 20,
          height: this.segmentLength,
        },
        this.scene,
      );

      grassLeft.material = grassMaterial;

      grassLeft.position = new Vector3(-15, -0.01, zPosition);

      this.grassSegments.push(grassLeft);

      // -------------------------
      // GRASS RIGHT
      // -------------------------

      const grassRight = MeshBuilder.CreateGround(
        `grassRight_${i}`,
        {
          width: 20,
          height: this.segmentLength,
        },
        this.scene,
      );

      grassRight.material = grassMaterial;

      grassRight.position = new Vector3(15, -0.01, zPosition);

      this.grassSegments.push(grassRight);

      // -------------------------
      // LINHAS DA PISTA
      // -------------------------

      const leftLane = this.createLaneMarker(`leftLane_${i}`);

      leftLane.material = laneMaterial;

      leftLane.position = new Vector3(-1, 0.03, zPosition);

      this.laneMarkers.push(leftLane);

      const rightLane = this.createLaneMarker(`rightLane_${i}`);

      rightLane.material = laneMaterial;

      rightLane.position = new Vector3(1, 0.03, zPosition);

      this.laneMarkers.push(rightLane);
    }
  }

  public update(deltaTime: number): void {
    for (const road of this.roadSegments) {
      this.moveSegment(road, deltaTime);
    }

    for (const grass of this.grassSegments) {
      this.moveSegment(grass, deltaTime);
    }

    for (const lane of this.laneMarkers) {
      this.moveSegment(lane, deltaTime);
    }
  }

  public dispose(): void {
    for (const road of this.roadSegments) {
      road.dispose();
    }

    for (const grass of this.grassSegments) {
      grass.dispose();
    }

    for (const lane of this.laneMarkers) {
      lane.dispose();
    }

    this.roadSegments = [];
    this.grassSegments = [];
    this.laneMarkers = [];
  }

  private moveSegment(segment: Mesh, deltaTime: number): void {
    segment.position.z -= this.speedSystem.getSpeed() * deltaTime;

    if (segment.position.z < -this.segmentLength) {
      segment.position.z += this.segmentLength * this.segmentCount;
    }
  }

  private createLaneMarker(name: string): Mesh {
    return MeshBuilder.CreateBox(
      name,
      {
        width: 0.1,
        height: 0.05,
        depth: this.segmentLength,
      },
      this.scene,
    );
  }
}
