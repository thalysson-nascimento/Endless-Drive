// import {
//   Color3,
//   Mesh,
//   MeshBuilder,
//   StandardMaterial,
//   Vector3,
// } from "@babylonjs/core";
// import { BaseEntity } from "./BaseEntity";

// export class RoadEntity extends BaseEntity {
//   private laneLineA?: Mesh;
//   private laneLineB?: Mesh;
//   private segmentA?: Mesh;
//   private segmentB?: Mesh;

//   private readonly segmentLength = 50;
//   private readonly speed = 15;

//   create(): void {
//     this.segmentA = MeshBuilder.CreateGround(
//       "roadA",
//       {
//         width: 8,
//         height: this.segmentLength,
//       },
//       this.scene,
//     );

//     this.segmentB = MeshBuilder.CreateGround(
//       "roadB",
//       {
//         width: 8,
//         height: this.segmentLength,
//       },
//       this.scene,
//     );

//     const laneMaterial = new StandardMaterial("laneMaterial", this.scene);
//     laneMaterial.diffuseColor = Color3.White();

//     this.laneLineA = MeshBuilder.CreateBox(
//       "laneLineA",
//       {
//         width: 0.1,
//         height: 0.05,
//         depth: this.segmentLength,
//       },
//       this.scene,
//     );

//     this.laneLineA.material = laneMaterial;

//     this.laneLineA.position = new Vector3(-1, 0.03, 0);

//     this.laneLineB = MeshBuilder.CreateBox(
//       "laneLineB",
//       {
//         width: 0.1,
//         height: 0.05,
//         depth: this.segmentLength,
//       },
//       this.scene,
//     );

//     this.laneLineB.material = laneMaterial;

//     this.laneLineB.position = new Vector3(1, 0.03, 0);
//   }

//   update(deltaTime: number): void {
//     this.moveSegment(this.laneLineA, deltaTime);

//     this.moveSegment(this.laneLineB, deltaTime);
//   }

//   dispose(): void {
//     this.segmentA?.dispose();
//     this.segmentB?.dispose();
//   }

//   private moveSegment(segment: Mesh | undefined, deltaTime: number): void {
//     if (!segment) {
//       return;
//     }

//     segment.position.z -= this.speed * deltaTime;

//     if (segment.position.z < -this.segmentLength) {
//       segment.position.z += this.segmentLength * 2;
//     }
//   }
// }
import { Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";

import { BaseEntity } from "./BaseEntity";

export class RoadEntity extends BaseEntity {
  private segmentA?: Mesh;
  private segmentB?: Mesh;

  private readonly segmentLength = 50;
  private readonly speed = 15;

  create(): void {
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

  update(deltaTime: number): void {
    this.moveSegment(this.segmentA, deltaTime);

    this.moveSegment(this.segmentB, deltaTime);
  }

  dispose(): void {
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
