import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Group, Mesh, ShaderMaterial } from "three";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

interface IProps {
  random: number;
}

type GLTFResult = GLTF & {
  nodes: {
    body: Mesh;
    eye_main: Mesh;
    eye_main001: Mesh;
    nose: Mesh;
    eye: Mesh;
    eye001: Mesh;
    nose_dot: Mesh;
    nose_dot001: Mesh;
    leg: Mesh;
    leg001: Mesh;
    leg002: Mesh;
    leg003: Mesh;
    horn: Mesh;
    horn001: Mesh;
    tail: Mesh;
  };
  materials: {
    body: ShaderMaterial;
    eye_main: ShaderMaterial;
    eye: ShaderMaterial;
    nose: ShaderMaterial;
    nose_dot: ShaderMaterial;
    leg: ShaderMaterial;
    horn: ShaderMaterial;
  };
};
const Cow: React.FC<IProps> = ({ random }) => {
  const { nodes, materials } = useGLTF("./models/cow.glb") as GLTFResult;

  const cowRef = useRef<Group>(null);

  useFrame((state, _) => {
    if (!cowRef.current) return;
    const time = state.clock.getElapsedTime();
    cowRef.current.rotation.y = time / 4;
  });

  return (
    <group ref={cowRef}>
      <RigidBody
        gravityScale={4}
        colliders="ball"
        restitution={1}
        linearDamping={0.5}
        angularDamping={2}
        position={[random, 0, random]}
      >
        <group dispose={null} scale={0.15} rotation={[0, Math.PI / 4, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.body.geometry}
            material={materials.body}
          />
          <mesh
            geometry={nodes.eye_main001.geometry}
            material={materials.eye_main}
            position={[0.629, 0.199, -0.311]}
            scale={0.287}
          />
          <mesh
            geometry={nodes.eye_main.geometry}
            material={materials.eye_main}
            position={[0.629, 0.183, 0.356]}
            scale={0.287}
          />
          <mesh
            geometry={nodes.nose.geometry}
            material={materials.nose}
            position={[0.677, -0.256, 0.001]}
            rotation={[0, 0, -0.447]}
            scale={[0.255, 0.451, 0.59]}
          />
          <mesh
            geometry={nodes.eye001.geometry}
            material={materials.eye}
            position={[0.83, 0.16, 0.299]}
            scale={0.068}
          />
          <mesh
            geometry={nodes.eye.geometry}
            material={materials.eye}
            position={[0.83, 0.16, -0.294]}
            scale={0.068}
          />
          <mesh
            geometry={nodes.nose_dot001.geometry}
            material={materials.nose_dot}
            position={[0.883, -0.124, -0.102]}
            scale={0.083}
          />
          <mesh
            geometry={nodes.nose_dot.geometry}
            material={materials.nose_dot}
            position={[0.883, -0.124, 0.1]}
            scale={0.083}
          />
          <mesh
            geometry={nodes.leg003.geometry}
            material={materials.leg}
            position={[-0.377, -0.729, -0.438]}
            rotation={[0.261, 0, 0]}
            scale={[0.107, 0.214, 0.107]}
          />
          <mesh
            geometry={nodes.leg.geometry}
            material={materials.leg}
            position={[-0.377, -0.736, 0.388]}
            rotation={[-0.137, 0, 0]}
            scale={[0.107, 0.214, 0.107]}
          />
          <mesh
            geometry={nodes.leg001.geometry}
            material={materials.leg}
            position={[0.387, -0.736, 0.388]}
            rotation={[-0.137, 0, 0]}
            scale={[0.107, 0.214, 0.107]}
          />
          <mesh
            geometry={nodes.leg002.geometry}
            material={materials.leg}
            position={[0.387, -0.742, -0.392]}
            rotation={[0.261, 0, 0]}
            scale={[0.107, 0.214, 0.107]}
          />
          <mesh
            geometry={nodes.horn.geometry}
            material={materials.horn}
            position={[0.587, 0.623, -0.252]}
            rotation={[-0.07, 0.47, -0.716]}
            scale={0.084}
          />
          <mesh
            geometry={nodes.horn001.geometry}
            material={materials.horn}
            position={[0.587, 0.623, 0.273]}
            rotation={[-0.07, -0.463, -0.779]}
            scale={0.084}
          />
          <mesh
            geometry={nodes.tail.geometry}
            material={materials.nose}
            position={[-0.927, 0.064, -0.036]}
            rotation={[2.88, -0.047, 3.129]}
            scale={[0.037, 0.16, 0.041]}
          />
        </group>
      </RigidBody>
    </group>
  );
};

export default Cow;

useGLTF.preload("./cow.tsx");
