import React from "react";
import Ground from "./Ground";
import AlienShip from "./Objects/AlienShip";
import { Physics } from "@react-three/rapier";
import Cow from "./Objects/Cow";

type Props = {};

const enum CowsNumber {
  cows = 20,
}

const Scene: React.FC<Props> = ({}) => {
  return (
    <Physics colliders={false}>
      <Ground />
      <AlienShip />
      {[...Array(CowsNumber.cows)].map((_, key) => (
        <Cow key={`c_${key}`} />
      ))}
    </Physics>
  );
};
export default Scene;
