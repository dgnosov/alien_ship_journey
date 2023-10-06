import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, ShaderMaterial } from "three";
import { GLTF } from "three-stdlib";

interface IProps {}

type GLTFResult = GLTF & {
  nodes: {
    spaceship: Mesh;
    portal: Mesh;
    cabine: Mesh;
    lights: Mesh;
  };
  materials: {
    metalic: ShaderMaterial;
    glass: ShaderMaterial;
    lights: ShaderMaterial;
  };
};

const AlienShip: React.FC<IProps> = ({}) => {
  const { nodes, materials } = useGLTF(
    "./models/alien_spaceship.glb"
  ) as GLTFResult;

  const spaceship = useRef<Group>(null!);

  //   useFrame((state, delta) => {
  //     if (!spaceship.current) return;
  //     //
  //     spaceship.current.rotateY(delta * 0.5);
  //     const time = state.clock.getElapsedTime();
  //     spaceship.current.position.y = 2 + Math.sin(time) / 10.0;
  //   });

  return (
    <group ref={spaceship} dispose={null} position={[2, 2, 1]} scale={0.3}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.spaceship.geometry}
        material={materials.metalic}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.portal.geometry}
        material={nodes.portal.material}
        position={[0, -0.31, 0]}
        rotation={[0, 0, Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cabine.geometry}
        material={materials.glass}
        position={[0, -0.028, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lights.geometry}
        material={materials.lights}
        position={[0, -0.156, 0]}
        rotation={[0, -0.786, 0]}
      />
    </group>
  );
};

useGLTF.preload("/alien_spaceship.glb");

export default AlienShip;
