import React from "react";
import { levaSettings } from "../gui/LevaSettings";
import { useControls } from "leva";
import { BoxGeometry } from "three";

type Props = {};
// import { useControls } from "leva";

const Scene: React.FC<Props> = ({}) => {
  const scene_ground = useControls(levaSettings.scene.ground.name, {
    rotation: { ...levaSettings.scene.ground.settings.rotation },
    scale: { ...levaSettings.scene.ground.settings.scale },
    color: {
      value: levaSettings.scene.ground.settings.color,
    },
  });

  return (
    <>
      <mesh
        rotation={[
          scene_ground.rotation.x,
          scene_ground.rotation.y,
          scene_ground.rotation.z,
        ]}
        scale={[
          scene_ground.scale.x,
          scene_ground.scale.y,
          scene_ground.scale.z,
        ]}
      >
        <planeGeometry />
        <meshStandardMaterial color={scene_ground.color} />
      </mesh>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={"brown"} />
      </mesh>
    </>
  );
};
export default Scene;
