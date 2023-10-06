import React from "react";
import Ground from "./Ground";
import AlienShip from "./Objects/AlienShip";
import { Physics } from "@react-three/rapier";

type Props = {};

const Scene: React.FC<Props> = ({}) => {
  return (
    <>
      <Physics colliders={false}>
        <Ground />
        <AlienShip />
      </Physics>
    </>
  );
};
export default Scene;
