import React from "react";
import { ContactShadows } from "@react-three/drei";
import { useControls } from "leva";

type Props = {};

const Lights: React.FC<Props> = ({}) => {
  const directionalLight = useControls("Directional Light", {
    position: [-10, 50, 0],
    intensity: 1,
    castShadow: true,
    mapSize: [1024, 1024],
    near: { min: 1, max: 100, value: 1, step: 1 },
    far: { min: 10, max: 100, value: 2, step: 1 },
    top: { min: 2, max: 100, value: 2, step: 1 },
    right: { min: 2, max: 100, value: 2, step: 1 },
    bottom: { min: 2, max: 100, value: 2, step: 1 },
    left: { min: 2, max: 100, value: 2, step: 1 },
  });

  const CSSettings = useControls("Contact Shadows", {
    position: [0, 0, 0],
    scale: { min: 1, max: 50, value: 42, step: 1 },
    blur: { min: 1, max: 10, value: 1, step: 0.1 },
    opacity: { min: 0, max: 1, value: 0.5, step: 0.1 },
    far: { min: 1, max: 50, value: 8, step: 1 },
    color: "#0d0d0d",
  });

  return (
    <>
      <directionalLight
        castShadow={directionalLight.castShadow}
        position={directionalLight.position}
        intensity={directionalLight.intensity}
        shadow-mapSize={directionalLight.mapSize}
        shadow-camera-near={directionalLight.near}
        shadow-camera-far={directionalLight.far}
        shadow-camera-top={directionalLight.top}
        shadow-camera-right={directionalLight.right}
        shadow-camera-bottom={-directionalLight.bottom}
        shadow-camera-left={-directionalLight.left}
      />
      <ContactShadows
        position={CSSettings.position}
        scale={CSSettings.scale}
        resolution={512}
        far={CSSettings.far}
        color={CSSettings.color}
        opacity={CSSettings.opacity}
        blur={CSSettings.blur}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};
export default Lights;
