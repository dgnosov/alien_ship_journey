import { CuboidCollider } from "@react-three/rapier";
import { useControls } from "leva";
import React from "react";
type Props = {};

const Ground: React.FC<Props> = ({}) => {
  const settings = useControls("Ground", {
    color: "#f2a155",
  });

  return (
    <mesh receiveShadow>
      <boxGeometry args={[100, 0.1, 100]} />
      <meshStandardMaterial color={settings.color} />
      <CuboidCollider args={[100, 0.1, 100]} />
    </mesh>
  );
};
export default Ground;