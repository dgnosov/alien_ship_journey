import React from "react";
import Ground from "./Ground";

type Props = {};

const Scene: React.FC<Props> = ({}) => {
  return (
    <>
      <Ground />
      <mesh position={[1, 1, 1]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color={"red"} />
      </mesh>
    </>
  );
};
export default Scene;
