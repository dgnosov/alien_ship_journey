import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, ShaderMaterial, Vector3 } from "three";
import { Euler } from "@react-three/fiber";

interface IProps {
  position: Vector3;
  rotation: number[];
  scale: number;
}

type GLTFResult = GLTF & {
  nodes: {
    rocks: Mesh;
  };
  materials: {
    Rocks: ShaderMaterial;
  };
};

const Rocks: React.FC<IProps> = ({ position, rotation, scale }) => {
  const { nodes, materials } = useGLTF("./models/rocks_1.glb") as GLTFResult;
  return (
    <group
      dispose={null}
      rotation={rotation as Euler}
      position={position as Vector3}
      scale={scale}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rocks.geometry}
        material={materials.Rocks}
      />
    </group>
  );
};

useGLTF.preload("./models/rocks_1.glb");

export default Rocks;
