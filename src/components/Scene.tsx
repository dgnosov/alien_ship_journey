import React from "react";
import Ground from "./Ground";
import AlienShip from "./Objects/AlienShip";
import { Physics } from "@react-three/rapier";
import Cow from "./Objects/Cow";
import Rocks from "./Objects/Rocks";
import Tree from "./Objects/Tree";
import { Euler, Vector3 } from "three";
import Rock from "./Objects/Rock";

type Props = {};

const enum CowsNumber {
  cows = 2,
}

// Huge rocks on the corners
const rocks = [
  {
    id: "r1",
    rotation: [0, 1, 0],
    position: new Vector3(15, 1, 15),
    scale: 4,
  },
  {
    id: "r2",
    rotation: [0, 4.2, 0],
    position: new Vector3(-15, 1, -15),
    scale: 4,
  },
  {
    id: "r3",
    rotation: [0, -0.5, 0],
    position: new Vector3(-15, 1, 15),
    scale: 4,
  },
  {
    id: "r4",
    rotation: [0, 2.6, 0],
    position: new Vector3(15, 1, -15),
    scale: 4,
  },
];

// Huge rocks on the borders
const rocksBorders = [
  {
    id: "rs1",
    rotation: new Euler(0, 1.5, 0),
    position: new Vector3(3, 0, 11),
    scale: 4,
  },
  {
    id: "rs2",
    rotation: new Euler(0, 1.5, 0),
    position: new Vector3(3, 0, 3),
    scale: 4,
  },
  {
    id: "rs3",
    rotation: new Euler(0, 0, 0),
    position: new Vector3(-3, 0, 3),
    scale: 4,
  },
  {
    id: "rs4",
    rotation: new Euler(0, 0, 0),
    position: new Vector3(-13, 0, 3),
    scale: 4,
  },
  {
    id: "rs5",
    rotation: new Euler(0, -0, 0),
    position: new Vector3(-8, 0, 34),
    scale: 4,
  },
  {
    id: "rs6",
    rotation: new Euler(0, -0, 0),
    position: new Vector3(-15, 0, 34),
    scale: 4,
  },
  {
    id: "rs7",
    rotation: new Euler(0, 1.7, 0),
    position: new Vector3(34, 0, 6),
    scale: 4,
  },
  {
    id: "rs8",
    rotation: new Euler(0, 1.7, 0),
    position: new Vector3(34, 0, 14),
    scale: 4,
  },
];

const Scene: React.FC<Props> = ({}) => {
  return (
    <Physics colliders={false}>
      <Ground />
      <AlienShip />
      {[...Array(CowsNumber.cows)].map((_, key) => (
        <Cow key={`c_${key}`} random={Math.floor(Math.random() * 21) - 10} />
      ))}
      {rocks.map((rock) => (
        <Rocks
          key={rock.id}
          rotation={rock.rotation}
          position={rock.position}
          scale={rock.scale}
        />
      ))}

      {rocksBorders.map((rock) => (
        <Rock
          key={rock.id}
          rotation={rock.rotation}
          position={rock.position}
          scale={rock.scale}
        />
      ))}
      <Tree />
    </Physics>
  );
};
export default Scene;
