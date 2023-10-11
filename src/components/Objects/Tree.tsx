import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, ShaderMaterial } from "three";

interface IProps {}

type GLTFResult = GLTF & {
  nodes: {
    Cylinder001_1: Mesh;
    Cylinder001_2: Mesh;
  };
  materials: {
    tree: ShaderMaterial;
    ["tree_leafs.001"]: ShaderMaterial;
  };
};

const Tree: React.FC<IProps> = () => {
  const { nodes, materials } = useGLTF("./models/tree.glb") as GLTFResult;
  return (
    <group dispose={null}>
      <group position={[0, 0, 0]} rotation={[0, -0.504, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_2.geometry}
          material={materials["tree_leafs.001"]}
        />
      </group>
    </group>
  );
};

useGLTF.preload("./models/tree.glb");

export default Tree;
