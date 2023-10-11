import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Euler, Mesh, ShaderMaterial, Vector3 } from "three";

interface IProps {
  position: Vector3;
  rotation: Euler;
  scale: number;
}

type GLTFResult = GLTF & {
  nodes: {
    rocks008: Mesh;
  };
  materials: {
    Rocks: ShaderMaterial;
  };
};

const Rock: React.FC<IProps> = ({ position, rotation, scale }) => {
  const { nodes, materials } = useGLTF("./models/rock.glb") as GLTFResult;
  return (
    <group
      dispose={null}
      rotation={rotation}
      position={position as Vector3}
      scale={scale}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rocks008.geometry}
        material={materials.Rocks}
        position={[3.26, 0.305, -4.597]}
        rotation={[0, 0.981, 0]}
      />
    </group>
  );
};

useGLTF.preload("./models/rock.glb");

export default Rock;
