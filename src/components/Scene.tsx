import React from "react";
import Ground from "./Ground";
import AlienShip from "./Objects/AlienShip";

type Props = {};

const Scene: React.FC<Props> = ({}) => {
  return (
    <>
      <Ground />
      <AlienShip />
    </>
  );
};
export default Scene;
