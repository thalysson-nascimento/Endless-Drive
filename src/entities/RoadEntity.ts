import { Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class RoadEntity extends BaseEntity {
  private segmentA?: Mesh;
  private segmentB?: Mesh;
  private readonly segmentLength = 50;
  private readonly speed = 15;

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
  }

  public update(deltaTime: number): void {
    this.moveSegment(this.segmentA, deltaTime);

    this.moveSegment(this.segmentB, deltaTime);
  }

  public dispose(): void {
    this.segmentA?.dispose();
    this.segmentB?.dispose();
  }

  private moveSegment(segment: Mesh | undefined, deltaTime: number): void {
    if (!segment) {
      return;
    }

    segment.position.z -= this.speed * deltaTime;

    if (segment.position.z < -this.segmentLength) {
      segment.position.z += this.segmentLength * 2;
    }
  }
}
